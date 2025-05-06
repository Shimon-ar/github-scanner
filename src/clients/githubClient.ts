import axios, { AxiosInstance } from 'axios';
import {GetCommitResponse, GetFileContentResponse, ListCommitsResponse} from "../types";

export class GithubClient {
    private axios: AxiosInstance;

    constructor(baseUrl: string) {
        this.axios = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json',
            },
        });
    }

    async listCommits(
        owner: string,
        repo: string,
        branch: string
    ): Promise<ListCommitsResponse> {
        const response = await this.axios.get<ListCommitsResponse>(
            `/repos/${owner}/${repo}/commits`,
            // { params: { sha: branch } }
        );
        return response.data as ListCommitsResponse;
    }

    async getCommit(
        owner: string,
        repo: string,
        sha: string
    ): Promise<GetCommitResponse> {
        const response = await this.axios.get<GetCommitResponse>(
            `/repos/${owner}/${repo}/commits/${sha}`
        );
        return response.data as GetCommitResponse;
    }

    async getContent(
        constentUrl: string
    ): Promise<GetFileContentResponse> {
        const response = await this.axios.get<GetFileContentResponse>(
            constentUrl,
        );
        return response.data as GetFileContentResponse;
    }
}
