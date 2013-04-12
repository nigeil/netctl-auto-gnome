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

function NetworkStatus() {
    this._init.apply(this, arguments);
}

 NetworkStatus.prototype = {
     __proto__: PanelMenu.SystemStatusButton.prototype,

     _init: function(){
       this._refresh_details();
       PanelMenu.SystemStatusButton.prototype._init.call(this, 'networkstatus');
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
	 let stdin = "";
	 let [result, argv] = GLib.shell_parse_argv(command);
	 let res = GLib.spawn_async_with_pipes(null, argv, null, GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD, this._stdout, this._stdout, this._stdout);
       } catch (e) {
	 global.logError(e);
       }
     },

     _stdout: function() {
       global.log("sucess")
     },

     _update_popup: function() {
	this.menu.removeAll();

	var profiles = this._get_network_profiles();
	for(let i = 0; i < profiles.length; i++){
	   if(! profiles[i].match(/\*.*/g)) {
	     this._add_menu_item(profiles[i]);
	   }else {
	     this.menu.addMenuItem(new PopupMenu.PopupMenuItem(profiles[i],  { reactive: false }));
	   }
	}
	this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
	this._add_stop_all();

     },

     _add_stop_all: function() {
	  let menuItem = new PopupMenu.PopupMenuItem("stop-all");
	  this.menu.addMenuItem(menuItem);

	  menuItem.connect('activate', Lang.bind(this, function() {
	    this._stop_all();
	  }));
     },

     _add_menu_item: function(profile) {
	  let menuItem = new PopupMenu.PopupMenuItem(profile);
	  this.menu.addMenuItem(menuItem);

	  menuItem.connect('activate', Lang.bind(this, function() {
	    this._switch_to_profile(profile);
	  }));
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
		this._update_popup();
		return true;
	    }));
     }
 }


function init() {
}

function enable() {
  indicator = new NetworkStatus();
  Main.panel.addToStatusArea('networkstatus', indicator);
  indicator._get_connected_networks();
}

function disable() {
  indicator.destroy();
  Mainloop.source_remove(event);
  indicator = null;
}
