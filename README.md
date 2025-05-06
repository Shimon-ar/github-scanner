# Project Title

### Complete flow wasnt tested so it may crash..

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

## Build & Run

1. **Start the application**
   ```bash
   npm run start
   ```

## Configuration

The application requires a valid GitHub token with access to the target repository. Set the `GITHUB_TOKEN` environment variable using one of the following methods:

- **Terminal session**
  ```bash
  export GITHUB_TOKEN=your_token_here
  ```
  Then run the application as shown above.

- **`.env` file**
  1. Create a file named `.env` in the root of the project.  
  2. Add the following line:
     ```ini
     GITHUB_TOKEN=your_token_here
     ```
  3. Ensure you have a dependency like `dotenv` configured to load environment variables.

## Usage

### Schedule a Repository Scan

You can trigger a repository scan with a simple `curl` command:

```bash
curl --location --request POST 'http://localhost:3000/scan' \
--header 'Accept: application/vnd.github+json' \
--header 'X-GitHub-Api-Version: 2022-11-28' \
--header 'Content-Type: application/json' \
--data-raw '{
    "repo": "example-repo",
    "owner": "owner",
    "branch": "main"
}'
```

Replace `example-repo`, `owner`, and `main` with the repository name, owner, and branch you wish to scan.
