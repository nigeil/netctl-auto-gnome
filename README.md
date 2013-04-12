# netctl-gnome-shell-extension #
This is a Gnome 3 shell extension for  [Netctl](https://wiki.archlinux.org/index.php/Netctl), the network profile manager for Arch Linux.

## Rationale ##
The wifi connection in our lab is pretty bad. While using Network Manager (the Gnome default connection manager) my connection kept on dropping, so I decided to switch to netctl. It worked well, but the one feature I missed was the ability to switch to a different wireless networks by using the shortcut in the notification area.

## Features ##
Currently the extension only does 3 things
* It shows a network icon in the status area. This icon changes based on whether there is currently an active profile or not.
* You can switch to a different profile by clicking on the desired profile in the dropdown menu.
* You can stop all active profiles.

**NB!** This plugin does not do any netctl configuration, that must be done from the command line.


![network enabled](https://github.com/tjaartvdwalt/netcfg-gnome-shell-extension/blob/master/screenshots/network-enabled.png?raw=true)

![network disabled](https://github.com/tjaartvdwalt/netcfg-gnome-shell-extension/blob/master/screenshots/network-disabled.png?raw=true)

## Dependencies ##
* netctl (obviously)
* gksu

## Known issues ##
* If you are using netctl-auto, the plugin does not show your active profile. I logged a bug [here](https://github.com/joukewitteveen/netctl/issues/23) for the netctl developers.
* Need better feedback when switching profiles. E.g: If you switch profile and the new profile fails to connect.