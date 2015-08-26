# netctl-gnome-shell-extension #
This is a Gnome 3 shell extension for  [Netctl](https://wiki.archlinux.org/index.php/Netctl), the network profile manager for Arch Linux.

**PLEASE NOTE**

This plugin is pretty old by now and could use an update. For example`netctl-auto` support. Unfortunately I have since moved away from using Gnome 3 (although I still use Netctl). I still believe this package could add value for Gnome users that prefer something more light weigth than NetworkManager. It would be really nice if someone would be willing to adopt this package. If you are interested please contact me.

## Rationale ##
The wifi connection in our lab is pretty bad. While using Network Manager (the Gnome default connection manager) my connection kept on dropping, so I decided to switch to netctl. It worked well, but the one feature I missed was the ability to switch to a different wireless networks by using the shortcut in the notification area.

## Features ##
Currently the extension only does 3 things
* It shows a network icon in the status area. This icon changes based on whether there is currently an active profile or not.
* You can switch to a different profile by clicking on the desired profile in the dropdown menu.
* You can stop all active profiles.

**NB!** This plugin does not do any netctl configuration, that must be done from the command line.

**No active profile**

![network disabled](https://github.com/tjaartvdwalt/netctl-gnome-shell-extension/blob/master/screenshots/network-disabled.png?raw=true)
**Profile activated**

![network enabled](https://github.com/tjaartvdwalt/netctl-gnome-shell-extension/blob/master/screenshots/network-enabled.png?raw=true)

## Dependencies ##
* netctl (obviously)
* gksudo (with sudo access for the logged in user)

## Known issues ##
* netctl-auto is not supported.
* Need feedback when switching profiles fails.
