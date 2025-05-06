// Minimal representation of a GitHub user
export interface GitHubUser {
    id: number;
    url: string;
    html_url: string;
    type: "User" | "Organization";
    site_admin: boolean;
}

export interface GitHubCommitSummary {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
        url: string;
        comment_count: number;
    };
    url: string;
    html_url: string;
    comments_url: string;
    author: GitHubUser | null;
    committer: GitHubUser | null;
}

export interface GitHubCommitDetail extends GitHubCommitSummary {
    stats: {
        total: number;
        additions: number;
        deletions: number;
    };
    files: Array<{
        sha: string;
        filename: string;
        status: "added" | "removed" | "modified" | string;
        changes: number;
        blob_url: string;
        raw_url: string;
        contents_url: string;
    }>;
}

export interface GitHubContentFile {
    type: "file" | "dir" | "symlink" | "submodule";
    encoding?: "base64";      // only present when type="file"
    name: string;
    path: string;
    content?: string;         // base64‐encoded, only for files
    sha: string;
    url: string;
    git_url?: string;
    html_url: string;
    download_url?: string | null;
    _links: {
        self: string;
        git: string;
        html: string;
    };
}

export type ListCommitsResponse = GitHubCommitSummary[];
export type GetCommitResponse   = GitHubCommitDetail;
export type GetFileContentResponse = GitHubContentFile;
export interface CommitJob { owner: string; repo: string; branch: string; }
export interface CommitDetailJob {
    owner: string;
    repo: string;
    sha: string;
    date: string;
}
export interface ContentJob {
    owner: string;
    repo: string;
    contentUrl: string;
}

