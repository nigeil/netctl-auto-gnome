const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter

let meta;

function NetworkStatus(metadata) {
    this._init.apply(this, arguments);
}


 NetworkStatus.prototype = {
     __proto__: PanelMenu.SystemStatusButton.prototype,

     _init: function(){
       this._build_ui();
       this._update_popup();
     },

     _get_network_profiles: function() {
       var profileString = GLib.spawn_command_line_sync("netcfg -l")[1].toString();
       var profileArray = profileString.split("\n")
       return profileArray.splice(0, profileArray.length - 1)
     },

     _get_connected_networks: function() {
       let networks =  GLib.spawn_command_line_sync("netcfg current")[1].toString();
       return networks.split("\n")[0];

     },

     _addMenuItem: function(profile) {
	  let menuItem = new PopupMenu.PopupMenuItem("");
	  let label=new St.Label({
			text:profile,
			style_class: "sm-label"
		    });
	  menuItem.addActor(label);
	  if (this._get_connected_networks() == profile) {
	    menuItem.setShowDot(true);
	  }
	  this.menu.addMenuItem(menuItem);

	  menuItem.connect('activate', Lang.bind(this, function() {
	    this._disconnect_network(profile);
	    this._connect_network(profile);
	  }));
     },
     _disconnect_network: function(profileName) {
       this._spawn_command("/usr/bin/pkexec /usr/bin/netcfg -u " + profileName);
     },
     _connect_network: function(profileName) {
       this._spawn_command("/usr/bin/pkexec /usr/bin/netcfg -u " + profileName);
     },
     _spawn_command: function(command) {
	      //GLib.spawn_command_line_async("pkexec netcfg -c " + profile);
	      let [result, argv] = GLib.shell_parse_argv(command);
	      global.log(argv)


	    if (result)
	    {
		try {
		    [result, pid] = GLib.spawn_async_with_pipes(null, argv, null, GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD, null, null);
		} catch (e) {
		    global.logError(e);
		}
	    }
	    GLib.spawn_close_pid(pid);
	    return result;

     },

     _update_popup: function() {
	this.menu.removeAll();
	var profiles = this._get_network_profiles();
	 for(let i = 0; i < profiles.length; i++){
	   this._addMenuItem(profiles[i]);
	 }
     },

     _build_ui: function(){
       PanelMenu.SystemStatusButton.prototype._init.call(this, 'networkstatus');
       this.statusIcon = new St.Icon({icon_name: 'network-wired-symbolic', icon_size: 16 });

       this.actor.get_children().forEach(function(c) {
	    c.destroy()
       });
       this.actor.add_actor(this.statusIcon);
     }
 }


function init(metadata) {
  meta = metadata;
}

function enable() {
  let indicator = new NetworkStatus(meta);
  Main.panel.addToStatusArea('networkstatus', indicator);
  indicator._get_connected_networks();
}

function disable() {
  indicator.destroy();
  indicator = null;
}
