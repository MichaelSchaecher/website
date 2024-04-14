---
title: Projects
date: 2023-10-07T10:47:57Z
draft: true
featuredImage: "./projects/projects.jpg"
externalLink: ""
---

{{< flex src="/projects/SystemdScripts.png" alt="SystemD Timer Scripts" class="rowRight"
href="https://github.com/MichaelSchaecher/systemd-scripts" >}}

Here are some **SystemD Timer Scripts** I wrote to automate some tasks on my Virtual Machine and/or LXC Containers that help me to keep my system up-to-date and running without much need manual intervention.

- Update [Pihole](https://pi-hole.net/) Gravity and underlying Framework.
- Keep [Unbound](https://nlnetlabs.nl/projects/unbound/about/) DNS Resolver up-to-date.
- Clean up apt cache.
- Update [Starship](https://starship.rs/) prompt to the latest version.
- Keep [Vaultwarden](https://hub.docker.com/r/vaultwarden/server) Docker container updated.

If using these scripts, please make sure to adjust the paths and commands to your needs.

> **Note:** The timer script for **Starship Prompt** only works if Starship is installed globally.

{{< /flex >}}
