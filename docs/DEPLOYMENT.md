# CODESYNC Rebuild — Production Deployment Guide (`DEPLOYMENT.md`)

**Target Domain:** `cdmlko.com` & `www.cdmlko.com`  
**Current Production Address:** Lucknow, Uttar Pradesh, India  
**Date:** 11 November 2026  
**Architecture:** Next.js 14 App Router (Node.js runtime)

> [!IMPORTANT]
> **Hosting Architecture Notice:** The legacy CODESYNC website was hosted on a traditional PHP shared hosting environment (Hostinger cPanel). **Traditional PHP shared hosting cannot execute a modern Next.js App Router application.** Next.js requires a Node.js runtime environment to execute server components, edge image generation, dynamic sitemaps, and serverless inquiry endpoints.

---

## 1. Supported Hosting Targets

### Option A: Vercel / Managed Next.js Hosting (Recommended)
Vercel is the native platform built by the creators of Next.js, providing zero-configuration edge image generation, instant previews, and global CDN caching.

1. **Connect Repository:**
   - Link the GitHub/GitLab repository to Vercel.
   - Framework Preset: **Next.js**
   - Root Directory: `./`
2. **Build & Output Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Environment Variables:**
   Configure in Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://www.cdmlko.com`
   - `INQUIRY_PROVIDER`: `resend` (or `webhook`)
   - `RESEND_API_KEY`: *(Private Resend API key)*
   - `INQUIRY_TO_EMAIL`: `support@cdmlko.com`
   - `INQUIRY_FROM_EMAIL`: `leads@cdmlko.com` (from verified domain)
   - `NEXT_PUBLIC_GA_ID`: *(Optional GA4 Measurement ID)*
4. **Custom Domain:**
   - Add `cdmlko.com` and `www.cdmlko.com`. Set `www.cdmlko.com` as primary (or redirect apex to www).

---

### Option B: Node-Capable VPS / Cloud Server (Ubuntu 22.04 / 24.04 LTS)
For deployment on AWS EC2, DigitalOcean Droplet, Linode, or any VPS:

1. **Server Prerequisites:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   # Install Node.js 20.x LTS
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx git
   # Install PM2 process manager
   sudo npm install -g pm2
   ```

2. **Project Setup & Build:**
   ```bash
   git clone <repo-url> /var/www/codesync-agency
   cd /var/www/codesync-agency
   npm install --production=false
   # Create production environment file
   cp .env.example .env.local
   nano .env.local # Populate verified production values
   npm run build
   ```

3. **Process Management with PM2:**
   ```bash
   # Start Next.js on port 3000
   pm2 start npm --name "codesync-web" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```

4. **Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/cdmlko.com`):**
   ```nginx
   server {
       server_name cdmlko.com www.cdmlko.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Enable site & obtain SSL certificate:
   ```bash
   sudo ln -s /etc/nginx/sites-available/cdmlko.com /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d cdmlko.com -d www.cdmlko.com
   ```

---

### Option C: Static Export (`output: 'export'`) — Architectural Analysis
If the client strictly insists on zero-Node static object storage (e.g., AWS S3 + CloudFront, Cloudflare Pages, or static cPanel):
- **What breaks if static export is forced:**
  1. `/api/inquiry` (Node server endpoint fails; inquiry forms must be replaced with third-party iframe or Google Form / Formspree / Formbold endpoint).
  2. Edge runtime dynamic OpenGraph image generator (`src/app/opengraph-image.tsx`) and dynamic favicon marks (`icon.tsx`) must be replaced with pre-rendered static `.png` files.
  3. Dynamic route handlers (`sitemap.ts`, `robots.ts`) must be replaced with static `sitemap.xml` and `robots.txt` in the `/public` directory.
- **Recommendation:** Do not use static export unless absolutely forced, as the modern Next.js lead security, serverless verification, and rate-limiting will be lost.

---

## 2. DNS Cutover & Domain Transition Plan

### Pre-Cutover (24 to 48 Hours Before Launch)
1. **Lower DNS TTL:**
   Access the domain registrar / DNS manager (Hostinger / Cloudflare) and lower the TTL (Time-To-Live) on `cdmlko.com` and `www.cdmlko.com` from `86400` (24h) to `300` seconds (5 minutes). This ensures DNS changes propagate globally in minutes during cutover.
2. **Preserve Legacy Site Copy:**
   Create an A record for `legacy.cdmlko.com` pointing to the old Hostinger server IP address. Keep the old site accessible under this temporary domain for 30 days for reference and emergency fallback.
3. **Verify Environment Variables:**
   Ensure production keys (`RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`) are loaded in the production environment.

### Cutover Execution
1. Update DNS Records:
   - **Apex (`cdmlko.com`):** Point to Vercel IP (`76.76.21.21`) or your VPS public IP.
   - **Subdomain (`www.cdmlko.com`):** Point CNAME to `cname.vercel-dns.com` or your VPS reverse proxy.
2. Verify SSL Certificate generation (automatic via Vercel or Let's Encrypt).
3. Test legacy redirects immediately:
   - `https://www.cdmlko.com/seo-services-lucknow` → 301 to `/services/seo`
   - `https://www.cdmlko.com/portfolio` → 301 to `/services`
   - `https://www.cdmlko.com/career` → 301 to `/about#careers`

### Rollback Plan
If any critical infrastructure defect occurs after DNS switch:
1. Revert the DNS A records for `cdmlko.com` and `www.cdmlko.com` back to the Hostinger server IP.
2. Because the TTL was reduced to 300 seconds, traffic will restore to the previous site within 5 to 10 minutes.
3. Fix the defect in a staging environment before re-attempting cutover.

### Post-Cutover (48 Hours After Launch)
1. Verify Google Search Console: Submit `https://www.cdmlko.com/sitemap.xml`.
2. Send a live test enquiry through the inquiry modal and verify delivery to `support@cdmlko.com`.
3. Increase DNS TTL back to standard values (e.g., `3600` or `86400`).
