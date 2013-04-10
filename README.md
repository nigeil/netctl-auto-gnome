# netcfg-gnome-shell-extension #
This is a Gnome 3 shell extension for  [Netcfg](https://www.archlinux.org/netcfg/), the network configuration tool written for Arch Linux.

## Rationale ##
The wifi connection in our lab is pretty bad. While using Network Manager (the Gnome default connection manager) my connection kept on dropping, so I decided to switch to netcfg. It worked well, but the one feature I missed was the ability to switch to a different wireless network by using the shortcut in the notification area.

There exists a Gnome 2 plugin [netcfg-tray](https://github.com/tlatsas/netcfg-tray) that can do this, but that is out of date, and does not support Systemd (that is now default in Arch Linux). Rather than update this plugin I decided to write a native Gnome 3 extension.
