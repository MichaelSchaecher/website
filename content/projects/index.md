---
title: Projects
date: 2023-10-07T10:47:57Z
draft: false
featuredImage: ""
externalLink: ""
---

## [Website Source](https://github.com/MichaelSchaecher/website)

This website is built using [Hugo](https://gohugo.io/) and a custom version of [Simple Dark](https://github.com/MichaelSchaecher/simple-dark). Through a combination of hosting the source code on [GitHub](https://github.com) and using Cloudflare's [Pages](https://pages.cloudflare.com/) service, I am able to host this website for free.

This well be a place for me to share my thoughts and ideas on various topics, as well as a place to share my projects and other things I am working on. I hope to make this website as useful as possible not only for myself, but for others as well. Because the only way to gain more knowledge is to share it with others what we've already learned.


## [Pihole Services](https://github.com/MichaelSchaecher/pihole-services)

Pi-hole is a useful tool for blocking ads, trackers, malware, etc. on your home network. However, the Internet is not static and neither are the lists that Pi-hole uses. So I created a set of systemd timers and services to keep the lists up to date and to keep the Pi-hole database optimized. There is also a service for updating the Pi-hole software itself, but only use at your own risk bacause it is something that Pi-hole does not endorse.

## [Custom WSL2 Kernel](https://github.com/MichaelSchaecher/wsl-kernel-patch)

For a time I would compile the latest stable Linux Kernel release from [kernel.org](https://www.kernel.org/), adding my own patches to use wsl2 config if `make oldconfig` detected that I was running on WSL2.

Do to some life events I have not been able to keep up with this project for some time. I hope to get back to it soon, but for now I have to put it on hold. The patch is still available for anyone who wants to use it, but I will not be able to provide any support for it with the Linux Kernel for now.

## [BTRFS-Manager](https://github.com/MichaelSchaecher/btrfs-manager)

Current up and coming project for management of btrfs snapshots via dpkg/apt hooks, systemd timers and grub boot entries. This project is still in its infancy and is not ready for production use yet, but expect it to be ready in by the end of January 2023.

Got the idea from [snapper](https://en.opensuse.org/openSUSE:Snapper_Tutorial) which is a great tool for managing btrfs snapshots on openSUSE, however it is very well support on Debian/Ubuntu. So I decided to make my own tool for managing btrfs snapshots on Debian/Ubuntu. Yes I know there is [Timeshift](https://github.com/linuxmint/timeshift), but it does not support btrfs subvolumes beyond the `@` and `@home` subvolumes which is not ideal.

There is a need for a tool like this on Debian/Ubuntu as it is a very popular distro's and btrfs is a great filesystem for protecting home users from data loss. I hope to make this tool as easy to use as possible, so that it can be used by anyone.
