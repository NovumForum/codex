# Documentation Website Deployment

This guide explains how to deploy the Codex CLI documentation website to various platforms.

## Overview

The Codex CLI documentation is available as a static website that can be deployed to:
- **Netlify** (recommended for static sites)
- **Vercel** (alternative static hosting)
- **GitHub Pages** (free hosting via GitHub)

## Prerequisites

- A GitHub account
- The repository cloned and pushed to GitHub

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify offers excellent static site hosting with automatic deployments.

#### Deploy via Netlify UI

1. **Sign up / Log in** to [Netlify](https://www.netlify.com/)

2. **Create a new site**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select the `NovumForum/codex` repository

3. **Configure build settings**:
   - Netlify will automatically detect the `netlify.toml` file
   - Build command: `bash scripts/build-website.sh`
   - Publish directory: `website`
   - Click "Deploy site"

4. **Your site is live!**
   - Netlify will assign a random URL like `https://random-name.netlify.app`
   - You can customize this in Site settings → Domain management

#### Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from the repository root
cd /path/to/codex
netlify deploy --prod

# Follow the prompts to create a new site or link to existing one
```

#### Custom Domain on Netlify

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `docs.yoursite.com`)
4. Configure your DNS provider with the provided settings
5. Enable HTTPS (automatic with Let's Encrypt)

### Option 2: Vercel

Vercel is another excellent platform for static site hosting.

#### Deploy via Vercel UI

1. **Sign up / Log in** to [Vercel](https://vercel.com/)

2. **Import project**:
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select the `NovumForum/codex` repository

3. **Configure project**:
   - Vercel will detect the `vercel.json` configuration
   - Framework Preset: Other
   - Build Command: `bash scripts/build-website.sh`
   - Output Directory: `website`
   - Click "Deploy"

4. **Your site is live!**
   - Vercel assigns a URL like `https://codex-xyz.vercel.app`
   - Customize in Project Settings → Domains

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the repository root
cd /path/to/codex
vercel --prod

# Follow the prompts
```

#### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Enter your custom domain
3. Configure your DNS as instructed
4. HTTPS is automatically configured

### Option 3: GitHub Pages

GitHub Pages provides free hosting directly from your repository.

#### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-docs.yml`) that automatically builds and deploys to GitHub Pages when you push to the `main` branch.

**Setup Steps:**

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select the `gh-pages` branch
   - Click Save

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Wait for deployment**:
   - Go to Actions tab to see the deployment progress
   - Once complete, your site will be available at:
     `https://novumforum.github.io/codex/`

#### Manual Deployment to GitHub Pages

If you prefer manual control:

```bash
# Build the website
bash scripts/build-website.sh

# Install gh-pages package
npm install -g gh-pages

# Deploy to gh-pages branch
gh-pages -d website
```

## Local Development and Testing

### Build the website locally

```bash
# From the repository root
bash scripts/build-website.sh
```

This will generate HTML files in the `website/docs/` directory.

### Preview locally

```bash
# Navigate to website directory
cd website

# Start a local server (Python)
python3 -m http.server 8000

# Or using Node.js
npx http-server -p 8000

# Or using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## Continuous Deployment

### Netlify Auto-Deploy

Once connected, Netlify automatically deploys when you:
- Push to the main branch
- Merge a pull request

You can configure this in Site settings → Build & deploy → Deploy contexts.

### Vercel Auto-Deploy

Vercel automatically deploys when you:
- Push to the main branch (production)
- Create a pull request (preview deployment)

Configure in Project Settings → Git.

### GitHub Pages Auto-Deploy

The GitHub Actions workflow (`.github/workflows/deploy-docs.yml`) triggers on:
- Push to main branch
- Manual workflow dispatch

## Troubleshooting

### Build fails on deployment platform

**Issue**: Build script fails during deployment

**Solution**: Check the build logs for errors. Common issues:
- Missing dependencies
- Path issues (ensure `scripts/build-website.sh` is executable)
- Environment differences

### Website displays incorrectly

**Issue**: CSS or links broken

**Solution**: 
- Verify all relative paths are correct
- Check that `style.css` is in the same directory as `index.html`
- Clear browser cache

### Documentation not updating

**Issue**: Changes to docs don't appear on the website

**Solution**:
- Rebuild the website: `bash scripts/build-website.sh`
- For platforms: trigger a new deployment
- For GitHub Pages: push to main branch to trigger workflow

### 404 errors on documentation pages

**Issue**: Documentation pages return 404

**Solution**:
- Verify the build script ran successfully
- Check that HTML files exist in `website/docs/`
- Verify redirects are configured correctly in `netlify.toml` or `vercel.json`

## Configuration Files

### netlify.toml
Configures Netlify deployment settings:
- Build command
- Publish directory
- Redirects and headers

### vercel.json
Configures Vercel deployment settings:
- Build command
- Output directory
- Rewrites and headers

### .github/workflows/deploy-docs.yml
GitHub Actions workflow for automated deployment to GitHub Pages.

## Updating Documentation

When you update markdown files in the `docs/` directory:

1. **Local testing**:
   ```bash
   bash scripts/build-website.sh
   cd website && python3 -m http.server 8000
   ```

2. **Commit and push**:
   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push origin main
   ```

3. **Automatic deployment**:
   - Netlify/Vercel: Automatically rebuilds
   - GitHub Pages: Workflow runs automatically

## Support

For issues with deployment:
- Check the platform's build logs
- Review configuration files
- Open an issue on [GitHub](https://github.com/NovumForum/codex/issues)

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
