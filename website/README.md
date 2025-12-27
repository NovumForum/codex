# Codex CLI Documentation Website

This directory contains the static website for Codex CLI documentation.

## Building the Website

To build the website locally:

```bash
bash scripts/build-website.sh
```

This will generate HTML pages from the markdown documentation in the `docs/` directory.

## Deployment Options

### 1. Netlify

#### Option A: Deploy via Netlify UI
1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Netlify will automatically detect the `netlify.toml` configuration
5. Click "Deploy site"

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

The site will be available at: `https://your-site-name.netlify.app`

### 2. Vercel

#### Option A: Deploy via Vercel UI
1. Go to [Vercel](https://vercel.com/)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect the `vercel.json` configuration
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

The site will be available at: `https://your-project.vercel.app`

### 3. GitHub Pages

The website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch via the GitHub Actions workflow (`.github/workflows/deploy-docs.yml`).

After the workflow runs, the site will be available at:
`https://novumforum.github.io/codex/`

**Note:** You may need to enable GitHub Pages in your repository settings:
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose the `gh-pages` branch
4. Click Save

## Local Development

To preview the website locally:

```bash
# Build the website
bash scripts/build-website.sh

# Serve it with a simple HTTP server
cd website
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## File Structure

```
website/
├── index.html          # Main landing page
├── style.css           # Global styles
└── docs/              # Generated documentation pages
    ├── getting-started.html
    ├── config.html
    ├── authentication.html
    └── ...
```

## Configuration Files

- `netlify.toml` - Netlify deployment configuration
- `vercel.json` - Vercel deployment configuration
- `.github/workflows/deploy-docs.yml` - GitHub Actions workflow for automated deployment

## Updating Documentation

When documentation is updated in the `docs/` directory:
1. The changes are automatically reflected in the website after running the build script
2. Push to the `main` branch to trigger automatic deployment
3. Or manually deploy using the Netlify/Vercel CLI

## Custom Domain (Optional)

### For Netlify:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

### For Vercel:
1. Go to Project settings → Domains
2. Add your custom domain
3. Configure your DNS as instructed

## Support

For issues with the documentation website, please open an issue on the [GitHub repository](https://github.com/NovumForum/codex/issues).
