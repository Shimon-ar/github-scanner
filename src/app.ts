import express, {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import * as core from "express-serve-static-core";
import {QueueImpl} from "./clients/queueImpl";
import {CommitDetailJob, CommitJob, ContentJob} from "./types";
import {GithubClient} from "./clients/githubClient";
import type {AddressInfo} from "node:net";
import {HTTP_CODE, TIMING} from "./constants";
import {scanRoute} from "./route/scanRoute";
import {NotFoundSystemError} from "./errors/erros";
import {AwsKeyScanner} from "./services/awsKeyScanner";

export const repoQueue = new QueueImpl<CommitJob>();
export const commitQueue = new QueueImpl<CommitDetailJob>();
export const contentQueue = new QueueImpl<ContentJob>();
export const client = new GithubClient("https://api.github.com");
export const scanner = new AwsKeyScanner()


const app = express();
const PORT = process.env.PORT || 3000;

const routes: Record<string, core.Router> = {
    '/': scanRoute,
};

const errorRequestHandler: ErrorRequestHandler = (err, req: Request, res: Response, _next: NextFunction) => {
    res.status(err.httpStatusCode ?? HTTP_CODE.SERVER_ERROR).send({
        type: 'error',
        status: err.httpStatusCode ?? HTTP_CODE.SERVER_ERROR,
        message: err.message ?? 'Unexpected error'
    });
}

app.use(express.json());
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

for (const [path, router] of Object.entries(routes)) {
    app.use(path, router);
}

app.all(/.*/, (_req, _res, next) => next(new NotFoundSystemError()));
app.use(errorRequestHandler);
const listeningCallback = () => console.log(`Listening on port ${(server.address() as AddressInfo).port}`);
const server = app.listen(PORT, listeningCallback);


setInterval(async () => {
    console.log("Processing repos...");
    while (!repoQueue.isEmpty()) {
        const { owner, repo, branch } = repoQueue.dequeue()!;
        const commits = await client.listCommits(owner, repo, branch);
        for (const c of commits) commitQueue.enqueue({ owner, repo, sha: c.sha, date: c.commit.author.date });
    }
}, TIMING.MINUTE * 2);


setInterval(async () => {
    console.log("Processing commits...");
    while (!commitQueue.isEmpty()) {
        const { owner, repo, sha } = commitQueue.dequeue()!;
        const detail = await client.getCommit(owner, repo, sha);
        for (const f of detail.files) {
            contentQueue.enqueue({
                owner,
                repo,
                contentUrl: f.contents_url,
            });
        }
    }
}, TIMING.MINUTE);


setInterval(async () => {
    console.log("Processing contents...");
    while (!contentQueue.isEmpty()) {
        const msg = contentQueue.dequeue()!;
        const contentRes = await client.getContent(msg.contentUrl);
        const content = Buffer.from(contentRes.content!, 'base64').toString('utf-8');
        console.log(content);
        const keys = scanner.scan(content);
        console.log(keys);
    }
}, TIMING.MINUTE);
