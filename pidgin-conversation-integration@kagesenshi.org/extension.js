
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;



const PidginIface = <interface name='im.pidgin.purple.PurpleInterface'>
    <signal name='DisplayedImMsg'>
      <arg name="account" type='i'/>
      <arg name="author" type='s'/>
      <arg name="message" type='s'/>
      <arg name="conversation" type='i'/>
      <arg name="flag" type='i'/>
    </signal>    
  </interface>

const PidginProxy = Gio.DBusProxy.makeProxyWrapper(PidginIface);

function PidginClient() {
    this._init();
}
PidginClient.prototype = {
    _init: function() {
        this._proxy = new PidginProxy(Gio.DBus.session, 'im.pidgin.purple.PurpleService', '/im/pidgin/purple/PurpleObject');
        this._displayedImMsgId = 0;
    },

    enable: function() {
        this._displayedImMsgId = this._proxy.connectSignal('DisplayedImMsg', this._messageDisplayed);
    },
    
    disable: function() {
        if (this._displayedImMsgId > 0) {
            this._proxy.disconnectSignal(this._displayedImMsgId);
            this._displayedImMsgId = 0;
        }
    },

    proxy: function () {
        return this._proxy;
    },

    _messageDisplayed: function(emitter, account, author, message, conversation, flag) {
        // only trigger on message received/message sent
        global.log("Received!");
        global.log(arguments)
        global.log("=======================")
        for (var i = 0; i < arguments.length; i++) {
            global.log(arguments[i]);
            global.log("--------------------------------")
        }
	global.log(emitter);
	global.log(account);
	global.log(author);
	global.log(message);
	global.log(conversation);
	global.log(flag);
        global.log("=======================")
            
    }
}

function init(metaObject) {
    var LocalDir;
    LocalDir = metaObject.metadata.localedir;
    imports.gettext.bindtextdomain('gnome-shell-extensions', LocalDir);
    return new PidginClient();
}
