<p align=center><font size=24px>
    <a href="https://blackstewie.com">Website</a>
</font></p>
<p align=center><font size=10px>It is still a work in progress.</font></p>

## About
This is a simple pesonal website made with [Hugo](https://gohugo.io/) and [hugo-coder](https://github.com/luizdepra/hugo-coder) theme. Hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

As I have discovered that as I get older I tend to forget things, I decided to create this website to keep track of my projects and ideas. I also use it to write about things I have learned and to share my thoughts. I hope you find something useful here.

I tried [Jekyll](http://jekyllrb.com) before, but the documentation was hard to follow, then I found Hugo and I loved it. It is fast, easy to use and has a lot of themes to choose from. Most of all because of the documentation it is easy to customize the theme to your liking. For me that is a big plus.

## Setting Up Hugo on Windows the Right Way

If you do not have VS Code installed I recommend that you do so. You can download it from [here](https://code.visualstudio.com/), or use a more fun way to install it:

```powershell
winget install Microsoft.VisualStudioCode
```

Windows 11 comes with Windows Terminal, but if you are using Windows 10 follow the instructions [here](https://docs.microsoft.com/en-us/windows/terminal/get-started), or use the following command:

```powershell
winget install Microsoft.WindowsTerminal
```

One of the best things about Windows Terminal is that it supports WSL2 out of the box. You can use it to access your Linux distro and run Hugo from there. By clicking on the down arrow next to the plus sign you can select the distro you want to use, although you may need setup your distro first.

Microsoft move WSL2 to the Windows Subsystem for Linux section in the Microsoft Store. You can use the following command to install it:

```powershell
winget install Microsoft.WSL
```

You may need to enable WSL2 in PowerShell:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

Enable VS Code to access WSL2 by installing the Remote - WSL extension. You can do this by clicking on the Extensions icon on the left side of the VS Code window and search for Remote - WSL. You can also use the following command:

```powershell
code --install-extension ms-vscode-remote.remote-wsl
```

Then you need to install a Linux distro. I recommend Ubuntu 22.04 LTS, but you can use any distro you like. You can install it from the Microsoft Store or use the following command:

```powershell
wsl --install -d Ubuntu-22.04
# Enable the distribution: You will need to set a username and password.
wsl --distribution Ubuntu-22.04
```

Create a new folder for your Hugo site.

```bash
mkdir hugo-site ; cd hugo-site
```

Start Vs Code from the folder you just created by using `code . &` or `code . -r &`. You well see a progress in the terminal window. When it is done you will see a message that says `Installing VS Code Server for x64 (e6b636cc5c0a0d129ce4c150fec959b446d0f6f1)`. This may take a while depending on your internet connection and the hardware you are using.

### Setting Up VS Code

With VS Code open click on the extensions icon on the left side of the window and search prettier and install it, it should be the first one on the list.

The following steps are for formatting.

1. Click on the gear icon on the bottom left corner of the window.
2. Click on Settings.
3. Search for format on the search bar.
4. Set Default Formatter to Prettier - Code formatter.
5. Format on paste should be checked.
6. Format on save should be checked.
7. Set Editor: Format On Save Timeout to 5000.

Close the settings windows, don't worry about saving it, VS Code will do it for you.

click on the Terminal menu and select New Terminal. This will open a new terminal window. You can also use the keyboard shortcut `Ctrl + Shift + `.

With the terminal window open, type the following command to install git first

```bash
sudo apt update
sudo apt install --yes git
```

Then install snap, although it should be installed by default.

```bash
sudo apt install --yes snapd
```

Then install Hugo. Thankfuly Hugo extended is the default version.

```bash
sudo snap install hugo
```

Enable git and Hugo.

```bash
git init ; git config --global user.name "Your Name" ; git config --global user.email " ; hugo new site . --force
```

You should see a message that says `Congratulations! Your new Hugo site is created in /home/yourname/hugo-site` and a bunch of stuff appearing in the explorer window on the left side of the VS Code window.

You can now start using Hugo the right way.

## License

This project is licensed under the [MIT License](LICENSE).
