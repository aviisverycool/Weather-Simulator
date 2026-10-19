# Weather-Simulator
A sandbox where you can see how weather affects the surrounding environment and what combinations create what weather

## Deploy to Vercel

This is a static site and does not need a build step, dependencies, or environment variables. The included `vercel.json` serves the project root and applies security-related response headers.

To deploy with Git:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository in the [Vercel dashboard](https://vercel.com/new).
3. Keep the project root as the Root Directory. The Vercel configuration disables framework detection and build commands and serves the root directory directly.
4. Deploy. Subsequent pushes to the connected production branch deploy automatically.

Alternatively, install the Vercel CLI and run `vercel --prod` from the project root.
