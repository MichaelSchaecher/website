---
title: The Better Way to Take BTRFS Snapshots on Ubuntu
date: 2023-12-22T12:03:58-07:00
description: ""
slug: ""
authors:
  - Michael Schaecher
tags:
  - btrfs
  - Ubuntu
categories:
  - Ubuntu
  - Filesystem
externalLink: ""
series:
  - Ubuntu N Btrfs
draft: true
weight: 20
featuredImage: ""
---

<!-- Do not talk about Timeshift or Snapper on managing snapshots -->

## Introduction

BTRFS is by fare one of the best filesystem for modern day hardware today. It is a copy-on-write filesystem with built-in RAID support, snapshots, and checksums. It is also the default filesystem for the root partition on OpenSUSE, SUSE Enterprise Linux, and Fedora. Ubuntu also supports BTRFS, but it is not the default filesystem. In this article, we will show you how to setup dpkg/apt hooks to automatically create a BTRFS snapshot before changes are made to the system. This will allow you to easily rollback changes if something goes wrong.

If you are using Ubuntu 20.04 or newer and did a guided btrfs install please read this [article]](/posts/fix-ubuntu-btrfs-subvolume-layout/) first, as I will be referencing the subvolume layout mentioned in that article here. If you are using a different subvolume layout, you will need to adjust the commands accordingly; in particular, if you are storing the snapshots in a different location and/or subvolume. Though, I would recommend using the layout mentioned in that article for the best experience.

## Prerequisites

You well need a current or supported version of Debian or Ubuntu (based distro) with btrfs-progs that support space_cache=v2 and compress=zstd:3/lzo. You can check if your system supports these features by running the following command: `btrfs --version`. If the output is 5.4 or newer, you are good to go. If not, you will need to upgrade your system or install a newer version of btrfs-progs from source.

As of this writing Ubuntu 22.04 uses btrfs v5.16.2.

### System Requirements

BTRFS is not like ext4 or xfs. It is a copy-on-write filesystem, which means that it will use more RAM than other filesystems. The more RAM you have, the better. I would recommend at least 8GB of RAM with a SWAP partition of at least 16GB. If you have 16GB of RAM or more look into setting up ZRAM. In the [previous](/posts/fix-ubuntu-btrfs-subvolume-layout/#without-a-swap-partition) article I give a brief overview of ZRAM and how to set it up.

- 8GB of RAM
- 16GB of SWAP or 2GB of ZRAM (16GB of RAM or more)
- 64bit Dual Core CPU or better that is at 1.5GHz or faster.
- 128GB SSD or larger (snapshots will take up space)
- BTRFS as the root filesystem (not required, but recommended)
  - BTRFS can convert ext4 to BTRFS without data loss.

## Setup Instructions

The fun is about to begin, so make some coffee and set at least 30 minutes or more aside for this. remember to backup your data before you start and take your time.

### Step 1: Create a Snapshot Subvolume

There is a handy tool called btrfs-grub, and what it does is add snapshots of the root filesystem to the grub menu. This is useful if you need to rollback to a previous snapshot by booting into it. The program looks for snapshots in the /@/.snapshots and /@/timeshift directories. We will be using the /@/.snapshots directory for this guide.

First, we need to create the snapshot subvolume. To do this, run the following command to install git and clone the btrfs-grub repository:

```console
sudo apt install --reinstall -y git
git clone https://https://github.com/Antynea/grub-btrfs.git /usr/local/src/grub-btrfs
```

Change into the directory `cd /usr/local/src/grub-btrfs` and run `sudo make install`. This will install the btrfs-grub and if you have any snapshots, it will add them to the grub menu. If you do not have any snapshots yet, create one by running the following command if you are using the subvolume layout mentioned in the [previous](/posts/fix-ubuntu-btrfs-subvolume-layout/) article:

```console
sudo btrfs subvolume snapshot -r /@ /@/.snapshots/$(date +%Y-%m-%d_%H:%M:%S)_root
```

And run `sudo update-grub` to add the snapshot to the grub menu. If you are using a different subvolume layout, you will need to adjust the command accordingly. Remove the `-r` flag if you do not want the snapshot to be read-only, allowing you to make changes to it if needed, but this is not recommended.
