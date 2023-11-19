---
title: Install Ubuntu with BTRFS
date: 2023-11-03T11:50:36Z
description: ""
slug: ""
authors:
  - Michael Schaecher
tags:
  - btrfs
  - subvolume
categories:
  - Filesystem
  - Ubuntu
externalLink: ""
series:
  - Ubuntu N Btrfs
draft: false
weight: 20
---

## Introduction

BTRFS is a filesystem that shares some of the same features as ZFS and one of the is very useful for both standard desktop and enterprise servers. It is a copy-on-write filesystem that allows for snapshots and subvolumes. It is also a journaling filesystem that allows for data integrity and recovery. Because of this Linux distributions like Fedora and OpenSUSE use it as the default filesystem over ext4.

The downside to BTRFS is the RAM requirements for the filesystem.

It is recommended that you have at least 1GB of RAM for every 1TB of storage. This is not a hard requirement but it is recommended. If you do not have enough RAM then you may run into issues with the filesystem; such as a slow, unresponsive system when running snapshots or a system that is slow to respond to commands.

Because of this it has lead to [Canonical](https://canonical.com/) to not use BTRFS as the default filesystem for Ubuntu and instead use ext4. However, they do offer BTRFS as an option for the filesystem with a poor subvolume layout. Only the root and home subvolumes are created. It is not bad but it is not optimal.

In this post I will show you how to fix that. I will also show you how to set up a either a swap partition or ZRAM for swap if you have more then 16 GB of RAM.

## Installing Ubuntu

When you first start Ubuntu from a live ISO or USB you are given an option to Try Ubuntu or install: You want to click on Try Ubuntu. This will start a live session of Ubuntu.

<div class="float-right">
  <img class="ubuntu-live"
    src="https://ubuntucommunity.s3.us-east-2.amazonaws.com/original/3X/e/6/e650ba8eeab98bbe9ab5adbfa7708d18a5a468c6.png"
    alt="Ubuntu Live USB"></img>
  <p class="caption">Pick your preferred language</p>
</div>

In most cases you well not have to pick a language, but if you do, pick your language and click on Try Ubuntu. From here you well be asked if you would like to try Ubuntu or install it. The image below shows the **Install Ubuntu** option selected. You want to click on **Try Ubuntu**.

<div class="float-left">
  <img class="ubuntu-live"
    src="https://ubuntucommunity.s3.us-east-2.amazonaws.com/original/3X/5/b/5b9075674e7a219dfb8fb62b4730987d4e5ec699.png"
    alt="Ubuntu Live USB"></img>
  <p class="caption">Selecting the Install Ubuntu</p>
</div>

Fallow the instructions on the screen making sure to connect to the internet and to install the third-party software.

<div class="float-right">
  <img class="ubuntu-live"
    src="https://ubuntucommunity.s3.us-east-2.amazonaws.com/original/3X/d/1/d1234f14d7922434fe9467bde2ce5b25779e02fb.png"
    alt="Ubuntu Live USB"></img>
  <p class="caption">Selecting third-party software</p>
</div>

When you get to the type of installation screen you want to select **Something else**. This will allow you to change the partition layout. Making sure to select the right drive you wish to install Ubuntu onto.

<div class="float-left">
  <img class="ubuntu-live"
    src="https://ubuntucommunity.s3.us-east-2.amazonaws.com/original/3X/e/5/e5101b968a2c7b8e626a34217179b6910db14649.png"
    alt="Ubuntu Live USB"></img>
  <p class="caption">Manual partitioning</p>
</div>

With the drive selected you well want to click on the **New Partition Table** button and select **GPT**. This well erase all data on the drive so make sure you have a backup of any data you wish to keep. From there you well want to create a new partition by clicking on the big **➕** button.

### Partition Layout

- Boot Partition:
  1. Set the size to 512 MiB
  2. Set the type to **EFI System Partition**
  3. Save the partition

- Swap Partition if RAM is less then 16GB:
  1. Set the size to 16384 MiB (16GB)
  2. Set the type to **swap**
  3. Save the partition

- No swap partition if RAM is greater then 16GB, instead use ZRAM for swap.

- Root Partition if RAM is less then 16GB:
  1. Set the size to to the rest of the drive.
  2. Set the type to **Btrfs**
  3. Set the mount point to **/**
  4. Save the partition

### Finishing the Installation

Once you have the partitions set up you can click on the **Install Now** button. You well be asked to confirm the changes, picking your location, language, keyboard layout, and user information. Once you have done that the installation well start. When everything is done you well be asked to restart the computer or continue using the live session.

You well want to continue using the live session. Once you are back in the live session you well want to open the terminal and run the following command:

[back](#installing-ubuntu)

## Fixing the Subvolume Layout

There are different ways to fix the subvolume layout; the best way is to figure out what you want to do with the system and what you do not want to change if you have to restore from a snapshot.

<!-- A table for root directory layout with a star making the ones for best -->

### My Layout

Because Ubuntu does not have a good subvolume layout, some directories and files that change after a reboot are stored in the root subvolume. Then there is the waste of space from storing snapshots with cache and log files.

The layout for Ubuntu based distributions should look like the following:

| Subvolume | Mount Point | Benefits |
| :--- | :--- | :--- |
| @ | / | Goes without saying |
| @home | /home | User data |
| @snapshots | /.snapshots | Keeps snapshots hidden |
| @log | /var/log | System log data |
| @tmp | /tmp | No need to keep |
| @apt | /var/cache/apt | No snapshots with @ |
| @src | /usr/local/src | Keeps code safe |

### Changing the Layout

This is easy, but there are some steps involved. First you well need to run the `umount -a` command to unmount all the subvolumes and the bond directories. You may get a warning about some mounted directories being busy, this normal.

Mount the root subvolume without mounting the other subvolume and without options. This is so that you can change the subvolume layout without any issues. Make sure to replace `<device>` with the device that the root subvolume is on: `/dev/sd*<partition number> or /dev/nvme<pci-e>n<device>p<partition number>`.

> NVME drives are labeled commonly as nvme0n1 or nvme1n1. The number after "p" is the partition number. If you have a drive that is not NVME then it is most likely labeled as sda or sdb. The number is the partition number.

```sh
mount -o /dev/<device> /mnt
```

Open and other terminal or tab and run the following command to edit the fstab file in a non terminal editor. This is so that you can copy and paste the subvolume layout without any issues.

```console
# For Gnome
gedit /mnt/etc/fstab
# For KDE
kate /mnt/etc/fstab
# For XFCE
mousepad /mnt/etc/fstab
# For Cinnamon
xed /mnt/etc/fstab
# For Elementary
scratch-text-editor /mnt/etc/fstab
```

Create the subvolume for the `.snapshots` directory first.

```console
btrfs subvolume create /mnt/@snapshots
```

There is nothing to copy and or move to the new subvolume so you can just change the fstab file to the following: remembering to leave the `UUID=` part alone.

```console
# /etc/fstab
UUID=<UUID>   /             btrfs subvol=@,ssd,noatime,space_cache=v2,compress=lzo     0 0
UUID=<UUID>   /boot/efi     vfat  umask=0077                                           0 1
UUID=<UUID>   /home         btrfs subvol=@home,ssd,noatime,space_cache=v2,compress=lzo 0 0
```

Add the following for the new subvolume: remembering to copy the UUID from the root/home subvolume.

```console
# /etc/fstab
UUID=<UUID>   /.snapshots   btrfs subvol=@snapshots,ssd,noatime,space_cache=v2,compress=lzo 0 0
```

Create the subvolume for the `/var/log` directory.

```console
btrfs subvolume create /mnt/@log
```

Copy the `/var/log` directory to the new subvolume.

```console
cp -av /mnt/var/log/* /mnt/@log
```

Verify that the files have been copied over and remove those files from the `/var/log` directory.

```console
# Verify that the file in /var/log are the same as the ones in /@log
cmp -s /mnt/var/log/* /mnt/@log/* && rm -rf /mnt/var/log/* || echo "Files are not the same"
```

Edit the fstab file to add the new subvolume.

```console
# /etc/fstab
UUID=<UUID>   /.snapshots   btrfs subvol=@snapshots,ssd,noatime,space_cache=v2,compress=lzo 0 0
```

Create the subvolume for the `/tmp` directory.

```console
btrfs subvolume create /mnt/@tmp
```

There is nothing to copy and or move to the new subvolume so you can just change the fstab file to the following: remembering to copy the UUID from the root/home subvolume.

```console
# /etc/fstab
UUID=<UUID>   /tmp          btrfs subvol=@tmp,ssd,noatime,space_cache=v2,compress=lzo 0 0
```

Create the subvolume for the `/var/cache/apt` directory.

```console
btrfs subvolume create /mnt/@apt
```

Copy the `/var/cache/apt` directory to the new subvolume and verify that the files have been copied over and remove those files from the `/var/cache/apt` directory.

```console
cp -av /mnt/var/cache/apt/* /mnt/@apt
cmp -s /mnt/var/cache/apt/* /mnt/@apt/* && rm -rf /mnt/var/cache/apt/* ||
echo "Files are not the same"
```

Edit the fstab file to add the new subvolume.

```console
# /etc/fstab
UUID=<UUID>   /var/cache/apt  btrfs subvol=@apt,ssd,noatime,space_cache=v2,compress=lzo 0 0
```

The last one is the `/usr/local/src` directory and this one is optional but I like to have it because it is a good place to put source code for programs that I want to compile.

```console
btrfs subvolume create /mnt/@src
```

There is nothing to copy and or move to the new subvolume so you can just change the fstab file to the following: remembering to copy the UUID from the root/home subvolume.

```console
# /etc/fstab
UUID=<UUID>   /usr/local/src  btrfs subvol=@src,ssd,noatime,space_cache=v2,compress=lzo 0 0
```

The final fstab file should look like the following: remembering that the UUIDs for `/`, `/home`, `/.snapshots`, `/tmp`, `/var/cache/apt`, and `/usr/local/src` are the same.

<!-- Use the same text for comments that Ubuntu uses. -->

```console
# /etc/fstab
UUID=<UUID>   /               btrfs subvol=@,ssd,noatime,space_cache=v2,compress=lzo          0 0
UUID=<UUID>   /boot/efi       vfat  umask=0077                                                0 1
UUID=<UUID>   /home           btrfs subvol=@home,ssd,noatime,space_cache=v2,compress=lzo      0 0
UUID=<UUID>   /.snapshots     btrfs subvol=@snapshots,ssd,noatime,space_cache=v2,compress=lzo 0 0
UUID=<UUID>   /tmp            btrfs subvol=@tmp,ssd,noatime,space_cache=v2,compress=lzo       0 0
UUID=<UUID>   /var/log        btrfs subvol=@log,ssd,noatime,space_cache=v2,compress=lzo       0 0
UUID=<UUID>   /var/cache/apt  btrfs subvol=@apt,ssd,noatime,space_cache=v2,compress=lzo       0 0

# Optional
UUID=<UUID>   /usr/local/src  btrfs subvol=@src,ssd,noatime,space_cache=v2,compress=lzo       0 0

# If you have a swap partition
UUID=<UUID>   swap            swap  defaults                                                  0 0
```

Relabel the btrfs partition so that it is easier to identify from the file manager.

```console
btrfs filesystem label /mnt <label>
```

Unmount `umount /mnt` and reboot the system. Remember to remove the live USB or CD from the system.

[back](#fixing-the-subvolume-layout)

## Verifying the subvolume layout

Once the system boots into the may want to verify that the subvolume layout is correct. To do this you well need to open the terminal and run the following command:

```console
sudo btrfs subvolume list /
```

To see if the partitions mount points are correct you can run the following command:

```console
lsblk -o NAME,UUID,MOUNTPOINT
```

## Without a Swap Partition

If your system had more then 16 GB of RAM and you followed the steps about not setting up a swap partition then you well need to us a ZRAM for swap. ZRAM is something that has be available in the Linux kernel since version 3.14. It is a compressed block device that uses RAM for storage. It is faster then a swap partition and it is more efficient. However, I would not recommend using it on a system with less then 16 GB of RAM as it may cause issues with low memory.

Some people may tell that if you have a lot of RAM then you do not need a swap. This is not true, you should always have a swap or ZRAM partition. The reason for this is some application may require a swap partition to run. If you do not have one then the application well not run or function correctly.

You see this on Windows PC with .Net applications and the requirement of a page file even if the system is running as much RAM as I have in my system.

To set it up you well need to run the following commands:

```bash
sudo apt install --yes zram-tools
```

Edit the configuration file for ZRAM.

```bash
# 16 - 32 GB of RAM
sudo sed -i 's/#SIZE=256/SIZE=2048/g' /etc/default/zramswap.conf
# 32 GB of RAM or greater
sudo sed -i 's/#SIZE=256/SIZE=4096/g' /etc/default/zramswap.conf
```

Edit the compression algorithm to use lzo and the priority to 100.

```bash
sudo sed -i 's/#ALGO=lz4/ALGO=lzo/g' /etc/default/zramswap.conf
sudo sed -i 's/#PRIORITY=100/PRIORITY=100/g' /etc/default/zramswap.conf
```

Restart the ZRAM service `sudo systemctl restart zramswap.service` and verify that the new swap partition is there and that size is correct by running `free -h`.

## Conclusion

That is it, you are done. You can now use the system as you normally would. If you have any questions or comments please leave them below once I get the comment section up and running. Other wise reach out to me on [Github](https://github.com/MichaelSchaecher).

In the next post I well show you how to set up btrfs-grub with dpkg/apt hooks
