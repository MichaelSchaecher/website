---
title: Setting Up Wsl2 With Custom Kernel
date: 2023-10-08T10:25:38Z
description: ""
slug: ""
authors:
  - Michael Schaecher
tags:
  - kernel
  - compilation
categories:
  - development
  - Windows Subsystem for Linux
externalLink: ""
series:
draft: true
weight: 20
---

## Introduction

This is a guide on how to set up WSL2 with a custom kernel. This guide is based on the kernel compilation guide from for bare metal compiling.

## Prerequisites
The downside to compiling any software is that you need to install a lot of dependencies, and those dependencies names can change depending on the distribution you are using. This guide is based on Ubuntu 22.04 and Arch Linux. If you are using a different distribution, you will need to find the equivalent packages for your distribution.

### Ubuntu 22.04
```bash
sudo apt install build-essential flex bison libssl-dev libelf-dev
```

### Arch Linux
```bash
sudo pacman -S base-devel flex bison openssl-1.0 libelf
```
