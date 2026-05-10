#!/bin/bash
sudo apt update
sudo apt install -y nginx nodejs npm git
sudo npm install -g n && sudo n 20

# create sites dir
sudo mkdir -p /var/www/sites
sudo chown -R ubuntu:ubuntu /var/www/sites

# copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/myplatform
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/myplatform /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# install backend deps and start
cd back
npm install
node server.js