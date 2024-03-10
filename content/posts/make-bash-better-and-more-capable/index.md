---
title: Make Bash Better and More Capable
# Set date to Mountain Standard Time. Example: 2023-12-17T20:01:00-07:00
date: 2024-02-16T12:00:28-07:00
lastmod: 2024-02-16T12:00:28-07:00
description: ""
slug: ""
authors:
  - Michael Schaecher
tags:
  - Bash
  - Terminal
categories:
  - Shell & Terminal
externalLink: ""
series:
draft: true
weight: 20
featuredImage: "/posts/make-bash-better-and-more-capable/bash-terminal.png"
---

Bash is a powerful shell and scripting language, but it can be made even better with a few simple tweaks. In this post, we'll look at some ways to make Bash more capable and user-friendly and how some of these tweaks are similar to those found in other shells like Zsh and Fish.

<!--more-->

## Bash Completion

Bash completion is a feature that allows you to complete commands, file paths, and other items by pressing the `Tab` key. This can be a huge time-saver, especially when working with long file paths or complex commands. To enable Bash completion for default commands all need to do is source the completion file in your <u>.bashrc</u> or <u>.bash_profile</u>. By doing this you may also get completion for some applications that you have installed: for example **docker** or **kubectl**.

This is because the **bash shell** is the still the default shell for many Linux distributions, users, but mostly system administrators. However, this changing with the rise of **zsh** and **fish** requiring the user to source the completion with a command related to the application you want to have completion available. For example **hugo** you would need to run `source <(hugo completion bash)`. I find that adding the completion to the <u>.bashrc</u> yields better handling of the completion.

How like to add the following to my <u>.bashrc</u>:

```bash
# enable bash completion in interactive shells.
test ! -n "${PS1}" && return || source "/usr/share/bash-completion/bash_completion"
```

For applications that require a command to enable completion for a specific shell, I add the following to my <u>.bashrc</u>:

```bash
# enable bash completion for hugo
test ! -x "$(command -v hugo)" || source <(hugo completion bash)
```

In most cases you well have a more complete experience with the completion in **bash** than in **zsh** and especially **fish**.

## Bash History

Bash history is a feature that allows you to access and search through your command history. This can be a huge time-saver, especially when you need to repeat a command or find a command that you used previously. The default history size is fine for most users so there really is not need to change it but if you are a heavy user of the terminal you may want to increase the size of the history file. To do this you can add the following to your <u>.bashrc</u>:

```bash
HISTFILESIZE="1000" ; HISTSIZE="10000"                                  # Set history file size.
```

Some commands are used so commonly that you may want to exclude them from the history file. To do this you can add the following to your <u>.bashrc</u>:

```bash
HISTIGNORE="ls:cd:clear:history"                                        # Exclude some commands from the history file.
```

I recommend that you add the following to the list of commands to ignore:

```bash
HISTIGNORE="&:[bf]g:exit:clear:history:pwd:cd:source:reload:helpful:ls:ll:la:lt"
```

You may also want to add some custom aliases and/or functions to the list as well.

Another thing that you may want to do is to add a timestamp to the history file. This can be done by adding the following to your <u>.bashrc</u>:

```bash
HISTTIMEFORMAT="$(echo -e "%d/%m/%y %T")"                               # Add date and time to history.
```

With color, using green for the example in 256 color mode:

```bash
HISTTIMEFORMAT="$(echo -e "\e[38;5;2m%d/%m/%y %T\e[0m")"                # Add date and time to history.
```

### Starship and Bash History

If you are like me and use **starship** as your prompt you may run into an issue where the history is not saved or multiple entries are saved. This is because the **bash** prompt is not be used causing the history to be behave in an unexpected way (this is not a problem in **zsh** and **fish**).

To fix this you can add the following function to your <u>.bashrc</u>: then call with `starship_precmd_user_func="histControl"`. This will ensure that the history is saved and that duplicates are removed by telling **starship** what to do before the prompt is displayed.

```bash
function histControl () {

    STARSHIP_LOG="errors"                                               # Don't show errors for Starship.
    PROMPT_COMMAND="starship_precmd ; history -w"                       # Write history to history file.

    HISTFILESIZE="1000" ; HISTSIZE="10000"                              # Set history file size.
    HISTTIMEFORMAT="$(echo -e "\e[38;5;2m%d/%m/%y %T ${CL}")"           # Add date and time to history.

    # Ignore some commands from being added to the history file to prevent populating the history file with
    # redundant commands that are the most offen used.
    HISTIGNORE="&:[bf]g:exit:clear:history:pwd:cd:source:ls:ll:la:lt"

    # Rewrite the history file, removing all duplicates preserving the most recent version of the
    # command. This is done by reversing the order of the history file, removing duplicates, then
    # reversing the order again to put the history file back in the correct order.
    test ! -f "~/.bash_history.old" && { tac "${HISTFILE}" | awk '!x[$0]++' > ~/.bash_history.old
    tac ~/.bash_history.old > "${HISTFILE}" ; } || true

    # Remove the old history file if it exists.
    test -f "~/.bash_history.old" && rm ~/.bash_history.old > /dev/null 2>&1 || true

}
```

Some may think that **bash** is not as capable as **zsh** or **fish** because of the way the history is handled when using a different prompt need to remember that **bash** was not designed with special prompts and symbols in mind. This does not mean that **bash** is not capable.

## Archives and Compression

One of the most useful feature to add is the ability to extract and compress archives with a simple command and argument. I first came across this by search [GitHub](https://github.com) for functions that I could add to my <u>.bashrc</u>.

```bash
function xtract () {

    local outDir ; outDir="(echo "${1}" | awk '{print ${1}')"           # Set output directory based on file name.

    # Use case menu.
    case "${1}" in
        *.tar.bz2|*.tbz2    )    tar xvjf "${1}" -C "${outDir}"  ;;
        *.tar.gz|*.tgz      )    tar xvzf "${1}" -C "${outDir}"  ;;
        *.tar.xz|*.tar      )    tar xvf "${1}" -C "${outDir}"   ;;
        *.bz2               )    bunzip2 -vd "${1}"              ;;
        *.rar               )    rar a "${1}" "${outDir}"        ;;
        *.gz                )    gunzip "${1}"                   ;;
        *.zip               )    unzip "${1}"                    ;;
        *.7z                )    7zz x "${1}"                    ;;
        *                   )
            # Echo common error regardless if file exists.
            test -f "${1}" && { echo "${1} archive type or file not supported!" ; return ; }
        ;;
    esac

}
```

The function above requires an argument to be passed to it; if the argument is a supported archive type it will extract the archive to the current directory or one using the filename. If the argument is not a supported archive type it will echo an error message.

Now to complete the functionality so that you can compress files and directories with a simple command and argument. This is done by adding the following alias.

```bash
### ARCHIVE ALIASES ###
alias xz='tar cvf'                                                      # Create tar.xz archive.
alias gz='tar cvjf'                                                     # Create tar.gz archive
alias bzip2='bzip2 -zk'                                                 # Create bzip archive.
alias rar='rar a'                                                       # Create rar archive.
alias gzip='gzip -9'                                                    # Create gzip archive.
alias zip='zip -r'                                                      # Create zip archive.
alias 7z='7zz a'                                                        # Create archive using 7z.
```

## Application Aliases

When it comes to commonly used commands is one for installing, updating, and removing packages. Sometimes the commands are long or you may need to use a specific flag or argument. This is where aliases come in handy. For example, I have the following aliases in my <u>.bashrc</u>:

```bash
### APT ALIASES ###
alias update='sudo apt update && sudo apt dist-upgrade --yes'           # Upgrade installed applications.
alias query='sudo apt list'                                             # Query explicitly-installed packages.
alias inst='sudo apt install --yes'                                     # Install package.
alias uinst='sudo apt purge --yes --autoremove'                         # Remove/uninstall application.
alias srch='apt search'                                                 # Search for package.
alias clean='sudo apt clean && sudo apt autoclean'                      # Clean up apt cache.

### PACMAN ALIASES ###
alias update='sudo pacman -Syu'                                         # Upgrade installed applications.
alias query='pacman -Qe'                                                # Query explicitly-installed packages.
alias inst='sudo pacman -S --noconfirm'                                 # Install package.
alias uinst='sudo pacman -Rns --noconfirm'                              # Remove/uninstall application.
alias srch='pacman -Ss'                                                 # Search for package.
alias clean='sudo pacman -Sc'                                           # Clean up pacman cache.
```

If you are using **yay** remember to not use the **sudo** command.

Using aliases like the ones above can save you time and make your life easier when installing, updating, and removing packages. You can use aliases for any package manager that you use like **dnf**, **zypper**, **zypper**, **apk**, **brew**, **snap**, **flatpak**, and **gem**.

## Working with Directories

The biggest thing when working inside the terminal is navigating the file system, this is why I have added the following aliases to my <u>.bashrc</u> makes it easier to navigate the file system. You may think that you have to add cd to every time you want to change the directory but adding `shopt -s autocd` to your <u>.bashrc</u> will allow you to change the directory without having to type `cd` before the directory name.

```bash
### DIRECTORY ALIASES ###
alias bk='../'                                                          # Go back one directory.
alias home='~'                                                          # Go to user home directory.
```

Another thing that you can do is add commonly used directories like the ones I have added.

```bash
alias site='~/Projects/website'                                         # Go to website project.
alias theme='~/Projects/simple-dark'                                    # Go to theme project.
alias skel='~/Projects/skel'                                            # Go to skel project.
alias pro='~/Projects/MichaelSchaecher'                                 # Go to Github profile.
```
