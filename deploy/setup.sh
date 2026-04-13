#!/bin/bash

# Digital Ocean Droplet Setup Script for Interncraft Academy
# Run this on your Ubuntu droplet

echo "=== Interncraft Academy Deployment Setup ==="

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Create app directory
sudo mkdir -p /var/www/interncraft
cd /var/www/interncraft

echo "=== Setup Complete ==="
echo "Next steps:"
echo "1. Upload your project files to /var/www/interncraft"
echo "2. Configure environment variables"
echo "3. Start the applications with PM2"
echo "4. Configure Nginx and SSL"
