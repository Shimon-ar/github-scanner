export class AwsKeyScanner implements Scanner{
    // Regex to match AWS Access Key IDs (AKIA or ASIA prefix + 16 uppercase alphanumeric chars)
    readonly #accessKeyRegex = /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g;

    // Regex to match AWS Secret Access Keys (40 base64 characters)
    readonly #secretKeyRegex = /\b[A-Za-z0-9/+=]{40}\b/g;

    // Regex to match AWS Session Tokens (start with 'FQo' followed by base64 chars)
    readonly #sessionTokenRegex = /\bFQo[\w+/]+=*\b/g;

    /**
     * Find all AWS Access Key IDs in content
     */
    #findAccessKeys(content: string): string[] {
        return content.match(this.#accessKeyRegex) ?? [];
    }

    /**
     * Find all AWS Secret Access Keys in content
     */
    #findSecretKeys(content: string): string[] {
        return content.match(this.#secretKeyRegex) ?? [];
    }

    /**
     * Find all AWS Session Tokens in content
     */
     #findSessionTokens(content: string): string[] {
        return content.match(this.#sessionTokenRegex) ?? [];
    }

    /**
     * Check if any AWS credential (access key, secret key, or session token) exists
     */
    public scan(content: string): string[] {
        return [
            ...this.#findAccessKeys(content),
            ...this.#findSecretKeys(content),
            ...this.#findSessionTokens(content),
        ];
    }
}
