---
title: How to Use Cloudflare for the Home Lab
date: 2023-10-06T17:22:07Z
description: ""
slug: ""
authors:
  - Michael Schaecher
tags:
  - Container
  - Trust
  - New
categories:
  - Linux Server
  - Docker
  - VPN
externalLink: ""
featuredImage:
series:
draft: true
---

----
Some people may not be able to get a static IP address from there ISP or be able to pay for the cost having one. Thanks to [Cloudflare](https://cloudflare.com) that is another way that is easier to setup them a reverse proxy. Although that would be the better options, but unless you have the hardware, it maybe out of reach.

## Signing Up With Cloudflare

This is the easiest part of the whole set and that setting up a **Cloudflare** account is free: although there are paid plans, you well not have to pick one unless your setup requires it.

First if you do not have an account with **Cloudflare you can do so [here](https://dash.cloudflare.com/sign-up)

You well need an email address, which pertty much is a requirement these days and a password that is at lease 8 characters long with 1 number and 1 special character. At this point you well want a strong password with more them 8 characters. I recommend no less the 15 with more then one number and special character and both lower/upper cases.

![Cloudflare-Account](/images/setting-up-raspberry-pi-as-cloudflare-tunnel-server/cloudflare-sign-up.png)

After running through the setup and email verification you be asked to log into your account for the first time. The first thing you see on your accounts landing page is a blue button asking to to "Add a site." After click the blue button you well either enter a domain name that you already have or click on the link to register one with **Cloudflare**.

![first-domain](/images/setting-up-raspberry-pi-as-cloudflare-tunnel-server/first-domain.png)

[Back](#signing-up-with-cloudflare)

### Adding a Domain

At this point you have 2 options for adding a domain, one is setting or transferring an existing domain or creating one with **Cloudflare**. The second is using the Nameservers for your new account doing so can take up to 24 hours to populate, but in most cases you'll it well take about half-an-hour.

You well receive an email notification that your domain is linked and ready to used. Once that is done it is time for the fun part.

## The Raspberry Pi

```yml
version: '3.8'

networks:
  home:
    name: home

services:
  cloudflare:
    image: cloudflare/cloudflared:latest
    container_name: cloudflare-tunnel
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${MY_TOKEN}
    networks:
      - home
```
