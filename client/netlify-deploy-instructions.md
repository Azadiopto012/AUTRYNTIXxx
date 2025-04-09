# Deploying to Netlify

Follow these steps to deploy the Autryntix app to Netlify:

## 1. Create a new site on Netlify

- Go to [Netlify](https://app.netlify.com/)
- Log in to your account
- Click "Add new site" > "Deploy manually"

## 2. Upload your site files

- Drag and drop the `dist/public` folder from your local computer
- This folder contains the built application files

## 3. Configure site settings

After the initial deploy is complete:

1. Go to Site settings > Build & deploy > Edit settings
2. Set the following:
   - Build command: `npm run build`
   - Publish directory: `dist/public`

## 4. Add redirect rules

1. Go to Site settings > Build & deploy > Edit settings > Advanced
2. Add the following redirect rule:
   - From: `/*`
   - To: `/index.html`
   - Status: `200`
   - Force: `Yes`

## 5. Deploy the backend (if needed)

If your app needs a backend:

1. Go to the Functions tab
2. Deploy your serverless functions from the `dist/functions` directory

## 6. Set environment variables

If your app requires environment variables:

1. Go to Site settings > Build & deploy > Environment
2. Add your environment variables

## 7. Custom domain (optional)

1. Go to Domain settings
2. Add your custom domain and follow the instructions

## Notes

- Make sure all assets are correctly referenced with relative paths
- The site is set up with a Single Page Application (SPA) redirect rule
- If you have API endpoints, you might need to configure them as Netlify Functions 