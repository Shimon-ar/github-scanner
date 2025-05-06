import type { Request, Response, NextFunction } from 'express';

import {ScheduleScanService} from "../services/scheduleScanService";
import {repoQueue} from "../app";
import {HTTP_CODE} from "../constants";
import {HttpBadRequestError} from "../errors/erros";

export class ScanController {
    readonly #scanService = new ScheduleScanService(repoQueue);

    public async post(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const { repo, owner, branch } = req.body;
        if (!repo || !owner) {
            throw new HttpBadRequestError('repo or owner are missing');
        }

        this.#scanService.scheduleRepoScan(owner, repo, branch);
        res.status(HTTP_CODE.CREATED);
    }
}
