// just for test ignore


import console from "console";
import {GithubClient} from "./clients/githubClient";

function decodeBase64(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('utf-8');
}

(async () => {
    console.log(process.env.GITHUB_TOKEN);
 const client = new GithubClient("https://api.github.com");
 const data = await client.listCommits("Shimon-ar", "test-repo", "main");
 console.log(data[0].commit);
 const commit = await client.getCommit("Shimon-ar", "test-repo", data[0].sha);
 console.log(commit.files[0].contents_url);
 const content = await client.getContent(commit.files[0].contents_url);
 console.log(decodeBase64(content.content!));

})();
