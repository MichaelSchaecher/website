---
title: Manage BTRFS Snapshots On Ubuntu the Proper Way
# Set date to Mountain Standard Time. Example: 2023-12-17T20:01:00-07:00
date: 2024-05-19T05:42:49-06:00
lastmod: 2024-05-19T05:42:49-06:00
description: ""
slug: manage-btrfs-snapshots-on-ubuntu-the-proper-way
authors:
  - Michael Schaecher
tags:
  - Ubuntu
  - BTRFS
  - Snapshots
categories:
  - Linux
externalLink: ""
draft: false
weight: 20
featuredImage: "/posts/manage-btrfs-snapshots-on-ubuntu-the-proper-way/snapshots.png"
---

One of the best features for Copy-On-Write filesystem like BTRFS is the ability to create snapshots. These snapshots can be used to restore files or directories back to an earlier state. This is especially useful when you accidentally delete or modify files. In this guide, we will show you how to manage BTRFS snapshots on Ubuntu the proper way. If you are running _**Ubuntu 22.04**_ or **_20.04_** or followed the [guide](../install-ubuntu-24.04-with-proper-btrfs-setup/), then this guide is for you.

In this guide, we will set up an apt/dpkg hook to automatically create snapshots before installing or removing packages. This will allow you to easily rollback to a previous state if something goes wrong. We will also show you how to manually create and manage snapshots. We'll also install [grub-btrfs](https://github.com/Antynea/grub-btrfs) to easily boot into snapshots from the GRUB menu.

Let's get started!

## Create a BTRFS Subvolume for Snapshots

If you already have a `@snapshots` subvolume, you can skip this step. If you followed our [previous guide](../install-ubuntu-24.04-with-proper-btrfs-setup/), you should already have a `@snapshots` subvolume. If not, you can create one by running the following commands:

```bash
sudo mkdir /.snapshots
sudo btrfs subvolume create @snapshots
```

Find what the UUID of your BTRFS partition run `lsblk -o uuid,fstype | grep btrfs`. Copy the UUID of your BTRFS partition and replace `UUID` in the command above.

No add the new subvolume to `/etc/fstab` to mount it automatically on boot. Open `/etc/fstab` with your favorite text editor and add the following line, and again replace `UUID` with the UUID of your BTRFS partition:

```bash
/dev/mount/by-uuid/UUID /.snapshots btrfs ssd,noatime,space_cache=v2,compress=lzo,subvol=@snapshots 0 0
```

Now, run `sudo mount -a` to mount the new subvolume.

## BTRFS Management Scripts

First thing is install grub-btrfs. What this program does is add a submenu to the GRUB menu that allows you to boot into snapshots. To install grub-btrfs, run the following commands: `git clone https://github.com/Antynea/grub-btrfs.git`. Change into the directory or open it in your file manager. Locate the 'config' and uncomment the line `GRUB_BTRFS_SUBMENUNAME="Arch Linux snapshots"`. Rename submenu to `Ubuntu Snapshots` or whatever you like.

Save  the file and run `sudo make install` to install grub-btrfs.

To keep the snapshots from taking up too much space we need to limit the number of snapshots What this script should do is count the number of snapshots and if over a certain number, delete the oldest snapshots.

Create a file called `btrfs-snapshot-cleanup`.

```bash
#!/bin/env bash

set -e

# Number of snapshots to keep
keepNum=10
snapshotsDir="/.snapshots"

test -d "$snapshotsDir" || { echo "Snapshots directory not found"; exit 1; }

# Count the number of snapshots
snapshotCount=$(find "$snapshotsDir" -maxdepth 1 -type d -name "$snapshotFormat*" | wc -l)

# find the oldest snapshot
oldestSnapshot=$(ls -t "$snapshotsDir" | tail -n 1)

test "$snapshotCount" -lt "$keepNum" && exit 0 || btrfs subvolume delete "$snapshotsDir/$oldestSnapshot"

echo "Deleted snapshot: $oldestSnapshot" ; sleep 2

exit 0
```

Make the script executable by running `chmod +x btrfs-snapshot-cleanup` and mv it to `/usr/local/bin`.

## Create an APT/DPKG Hook

We've all been there. You install a package and it breaks your system. Now you have to spend hours trying to fix it. With this script, you can automatically create a snapshot before installing or removing packages. This way you can easily rollback to a previous state if something goes wrong.

Create a file called `50btrfs-snapshot` in `/etc/apt/apt.conf.d/`. Use your favorite terminal text editor to create the file. I use `nano` so I would run `sudo nano /etc/apt/apt.conf.d/50btrfs-snapshot`.

```bash
DPkg::Pre-Invoke {
  "btrfs subvolume snapshot -r / /.snapshots/$(hostname)-$(date +%Y-%m-%d);btrfs-snapshot-cleanup;update-grub";
};
```

Save the file and exit the text editor. Now, whenever you install or remove a package, a snapshot will be created. You cat test it by running `sudo apt install <package>`. You should see the hook running and a snapshot being created; the new snapshot being added to the GRUB menu and the oldest snapshot being deleted.

## Systemd Timer For Automatic Snapshots

If you are wondering why we not using crontab, it's because if the time is missed do to system being off or asleep or the system was rebooted cron will not run. However, systemd timers will run as soon as possible after the missed time.

Create a file called `btrfs-snapshot.timer` in `/usr/local/lib/systemd/system/`.

```ini
[Unit]
Description = Create BTRFS snapshots

[Timer]
OnCalendar = daily
RandomizedDelaySec = 30m
Persistent = true

[Install]
WantedBy = timers.target
```

Create a file called `btrfs-snapshot.service` in `/usr/local/lib/systemd/system/`.

```ini
[Unit]
Description = Create BTRFS snapshots

[Service]
Type = oneshot
Environment = NAME=$(/usr/bin/hostname)
Environment = DATE=$(/usr/bin/date +%Y-%m-%d_%H-%M)
ExecStart = /usr/bin/btrfs subvolume snapshot -r / /.snapshots/$NAME-$DATE
ExecStart = /usr/local/bin/btrfs-snapshot-cleanup

[WantedBy]
WantedBy = multi-user.target
```

Enable the timer by running `sudo systemctl enable --now btrfs-snapshot.timer`.

### Booting Into Snapshots

Now that you have snapshots set up, you can easily boot into them from the GRUB menu. When you boot your system, you should see a new submenu called `Ubuntu Snapshots`. Select this submenu and you will see a list of snapshots. Select the snapshot you want to boot into and press enter. Your system will boot into the selected snapshot.

> **Note:** That the snapshots are read-only. This means you can't make changes to the system while booted into a snapshot. This makes it safer for restoring from the snapshot you just booted into.

### Restore From a Snapshot

If you want to restore your system from the snapshot you just booted into, you can do so by running the following command and reboot the system selecting the default GRUB menu option.

```bash
sudo btrfs su delete @ ; sudo btrfs su snapshot /.snapshots/<booted_snapshot> @
```

## Conclusion

In this guide, we showed you how to manage BTRFS snapshots on Ubuntu the proper way. We set up an apt/dpkg hook to automatically create snapshots before installing or removing packages. We also showed you how to manually create and manage snapshots. We installed grub-btrfs to easily boot into snapshots from the GRUB menu. We also created a systemd timer to automatically create snapshots daily.

I hope you found this guide helpful. If you have any questions or feedback, feel free to leave a comment below.
