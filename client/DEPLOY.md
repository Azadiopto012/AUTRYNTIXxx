# Deploying to Netlify

Follow these steps to deploy your Autryntix app to Netlify:

1. **Build the Application**
   ```bash
   npm run build
   ```
   This will create a `dist` folder with your built application.

2. **Deploy to Netlify**

   a. Go to [Netlify](https://app.netlify.com/)
   
   b. Log in to your account
   
   c. Click "Add new site" > "Deploy manually"
   
   d. Drag and drop the `dist/public` folder from your local computer

3. **Configure Site Settings**

   After the initial deploy:

   a. Go to Site settings > Build & deploy > Edit settings
   
   b. Set the following:
   - Build command: `npm run build`
   - Publish directory: `dist/public`

4. **Set up Redirects**

   Add the following redirect rule in your site settings:
   - From: `/*`
   - To: `/index.html`
   - Status: `200`

5. **Environment Variables**

   If needed, set up your environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add any required environment variables

6. **Domain Settings**

   To set up a custom domain:
   - Go to Domain settings
   - Add your custom domain
   - Follow the DNS configuration instructions

Your site should now be live at the Netlify URL provided! 