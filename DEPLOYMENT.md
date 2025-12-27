# Quick Deployment Guide

This repository is ready to deploy to Netlify, Vercel, or GitHub Pages.

## 🚀 Deploy in 3 Steps

### Netlify (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select this repository

**Done!** Your site will be live at `https://your-site.netlify.app`

### Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import this GitHub repository

**Done!** Your site will be live at `https://your-project.vercel.app`

### GitHub Pages (Free)

1. Go to your repository Settings → Pages
2. Select "Deploy from a branch"
3. Choose the `gh-pages` branch

**Done!** Your site will be live at `https://novumforum.github.io/codex/`

## 🧪 Test Locally

```bash
# Build and preview the website
bash scripts/test-website.sh
```

Then open http://localhost:8000

## 📚 Full Documentation

For detailed instructions, custom domains, and troubleshooting:
- See [docs/deployment.md](docs/deployment.md)

## 🎨 What Gets Deployed

- **Landing page** with quickstart guide
- **Documentation pages** converted from markdown
- **Responsive design** that works on all devices
- **Security headers** for safe browsing

## 🔄 Automatic Updates

Once deployed, your documentation site automatically updates when you:
- Push to the main branch
- Merge a pull request

No manual rebuilding required!
