# GitHub Pages Deployment Guide

This guide will help you deploy your QwikDel demo to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository

## Deployment Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `qwikdel-demo` (or any name you prefer)
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README (since you already have files)

### 2. Push Your Code

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: QwikDel logistics dashboard"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/qwikdel-demo.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main/master branch

### 4. Configure Repository Name (Important!)

**If your repository name is NOT `qwikdel-demo`**, you need to update the base path in `vite.config.js`:

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

Replace `YOUR_REPO_NAME` with your actual repository name.

### 5. Access Your Deployed Site

After the GitHub Action completes (usually takes 2-3 minutes), your site will be available at:

```
https://YOUR_USERNAME.github.io/qwikdel-demo/
```

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The built files will be in the 'dist' folder
# You can upload these files to any static hosting service
```

## Troubleshooting

### Common Issues:

1. **404 Error**: Make sure the base path in `vite.config.js` matches your repository name
2. **Build Fails**: Check the Actions tab in your GitHub repository for error details
3. **Assets Not Loading**: Ensure all file paths are relative and the base path is correct

### Check Deployment Status:

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Look for the "Deploy to GitHub Pages" workflow
4. Click on it to see the deployment status and logs

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure your domain's DNS to point to `YOUR_USERNAME.github.io`
3. Enable custom domain in GitHub Pages settings

## Environment Variables

The app uses mock data, so no environment variables are needed for basic deployment.

## Support

If you encounter any issues, check:
- GitHub Actions logs
- Browser console for errors
- Network tab for failed requests
