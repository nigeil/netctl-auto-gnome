/*
 * Netctl Menu is a Gnome 3 extension that allows you to  switch between netctl
 * profiles using a menu in the notification area.
 *
 * Copyright (C) 2013  Tjaart van der Walt
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

const NETWORK_CONNECTED = "network-wired-symbolic";
const NETWORK_OFFLINE = "network-offline-symbolic";

let indicator;
let event=null;

/*
 *
 */
function Netctl() {
    this._init.apply(this, arguments);
}

Netctl.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function(){
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'netctl');
        // We include the set_icon() and update_menu() becaust otherwise the
        // icon will only appear after the timeout on refresh_details() have passed
        this._set_icon();
        this._update_menu();
        // Will keep on updating the status area icon and updating the menu every x seconds
        this._refresh_details();
    },

    _get_network_profiles: function() {
        var profileString = GLib.spawn_command_line_sync("netctl list")[1].toString();
        var profileArray = profileString.split("\n")
        return profileArray.splice(0, profileArray.length - 1)
    },

    _get_connected_networks: function() {
        let networks =  GLib.spawn_command_line_sync("netctl list")[1].toString();
        let connected = networks.match(/\*.*/g);
        return connected;
    },

    _stop_all: function() {
        this._execute_async("gksudo /usr/bin/netctl stop-all ");
    },

    _switch_to_profile: function(profileName) {
        this._execute_async("gksudo /usr/bin/netctl switch-to " + profileName);
    },

    _execute_async: function(command) {
        try {
            let [result, argv] = GLib.shell_parse_argv(command);
            GLib.spawn_async(null, argv, null, GLib.SpawnFlags.SEARCH_PATH, null);
        }
        catch (e) {
            global.logError(e);
        }
    },

    _update_menu: function() {
        this.menu.removeAll();

        var profiles = this._get_network_profiles();
        for(let i = 0; i < profiles.length; i++){
            this._add_profile_menu_item(profiles[i]);
        }
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this._add_stop_all_menu_item();
    },

    _add_stop_all_menu_item: function() {
        let menuItem = new PopupMenu.PopupMenuItem("stop-all");
        this.menu.addMenuItem(menuItem);

        menuItem.connect('activate', Lang.bind(this, function() {
            this._stop_all();
        }));
    },

    _add_profile_menu_item: function(profile) {
        // The the profile is not active, add a click action to switch to it.
        if(! profile.match(/\*.*/g)) {
            let menuItem = new PopupMenu.PopupMenuItem(profile);
            this.menu.addMenuItem(menuItem);
            menuItem.connect('activate', Lang.bind(this, function() {
                this._switch_to_profile(profile);
            }));
        }else {
            this.menu.addMenuItem(new PopupMenu.PopupMenuItem(profile,  { reactive: false }));
        }
    },

    _set_icon: function(){
        let icon_name = "";
        if(this._get_connected_networks() == null){
            icon_name = NETWORK_OFFLINE;
        } else {
            icon_name = NETWORK_CONNECTED;
        }

        let statusIcon = new St.Icon({icon_name: icon_name, icon_size: 16 });

        this.actor.get_children().forEach(function(c) {
            c.destroy()
        });
        this.actor.add_actor(statusIcon);
    },

    _refresh_details: function() {
        event = GLib.timeout_add_seconds(0, 5, Lang.bind(this, function () {
            this._set_icon();
            this._update_menu();
            return true;
        }));
    }
}


function init() {
}

function enable() {
    indicator = new Netctl();
    Main.panel.addToStatusArea('netctl', indicator);
    indicator._get_connected_networks();
}

function disable() {
    indicator.destroy();
    Mainloop.source_remove(event);
    indicator = null;
}
