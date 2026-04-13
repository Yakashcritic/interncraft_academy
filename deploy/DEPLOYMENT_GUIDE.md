# Interncraft Academy - Digital Ocean Deployment Guide

## Server Details
- **IP**: 168.144.79.191
- **Domain**: learnmythos.app
- **OS**: Ubuntu 24.04

---

## Step 1: Initial Server Setup (via SSH)

```bash
# SSH into your droplet
ssh root@168.144.79.191

# Run setup script
curl -fsSL https://raw.githubusercontent.com/yourusername/interncraft/main/deploy/setup.sh | bash
```

Or manually:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Create app directory
sudo mkdir -p /var/www/interncraft
```

---

## Step 2: Upload Project Files

### Option A: Using SCP (from your local machine)
```bash
# From your project folder, run:
scp -r backend frontend root@168.144.79.191:/var/www/interncraft/
scp -r deploy/ecosystem.config.js root@168.144.79.191:/var/www/interncraft/
```

### Option B: Using Git
```bash
# On server
cd /var/www/interncraft
git clone https://github.com/yourusername/interncraft.git .
```

---

## Step 3: Configure Environment Variables

### Backend .env (`/var/www/interncraft/backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_strong_secret_key_here
FRONTEND_URL=https://learnmythos.app

# Admin emails
ADMIN_EMAILS=admin@learnmythos.app

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://learnmythos.app/api/auth/google/callback

# Cashfree Payment
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=PRODUCTION

# WhatsApp URLs
WHATSAPP_URL_AI_ML=
WHATSAPP_URL_DIGITAL_MARKETING=
WHATSAPP_URL_VIDEO_EDITING=
WHATSAPP_URL_BUSINESS=
WHATSAPP_URL_FULLSTACK_DEV=
WHATSAPP_URL_DATA_ANALYTICS=
```

### Frontend .env.local (`/var/www/interncraft/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://learnmythos.app/api
```

---

## Step 4: Install Dependencies & Build

```bash
ssh root@168.144.79.191

cd /var/www/interncraft/backend
npm install --production

cd /var/www/interncraft/frontend
npm install
npm run build
```

---

## Step 5: Start Applications with PM2

```bash
cd /var/www/interncraft

# Copy ecosystem file
cp deploy/ecosystem.config.js .

# Start both apps
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save
pm2 startup systemd
```

---

## Step 6: Configure Nginx

```bash
# Copy nginx config
sudo cp /var/www/interncraft/deploy/nginx.conf /etc/nginx/sites-available/learnmythos.app

# Enable site
sudo ln -s /etc/nginx/sites-available/learnmythos.app /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## Step 7: SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d learnmythos.app -d www.learnmythos.app

# Auto-renewal is set up automatically
```

---

## Step 8: Configure Domain DNS

In your domain registrar (where you bought learnmythos.app):

| Type | Host | Value |
|------|------|-------|
| A | @ | 168.144.79.191 |
| A | www | 168.144.79.191 |

---

## Step 9: Configure Google OAuth

In Google Cloud Console:
1. Add authorized redirect URI: `https://learnmythos.app/api/auth/google/callback`
2. Add authorized JavaScript origins: `https://learnmythos.app`

---

## Useful Commands

```bash
# Check app logs
pm2 logs interncraft-backend
pm2 logs interncraft-frontend

# Restart apps
pm2 restart all

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check PM2 status
pm2 status

# Update deployment
cd /var/www/interncraft
git pull
pm2 restart all
```

---

## File Locations on Server

- **App**: `/var/www/interncraft/`
- **Backend env**: `/var/www/interncraft/backend/.env`
- **Frontend env**: `/var/www/interncraft/frontend/.env.local`
- **Nginx config**: `/etc/nginx/sites-available/learnmythos.app`
- **Logs**: `/var/log/interncraft-*.log`
