import {QueueImpl} from "../clients/queueImpl";
import {CommitJob} from "../types";

export class ScheduleScanService {
    constructor(private repoQueue: QueueImpl<CommitJob>) {}

    scheduleRepoScan(owner: string, repo: string, branch: string): void {
        this.repoQueue.enqueue({ owner, repo, branch });
    }
}
