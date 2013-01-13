/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

var GNOMEThemeTweak = {
    loadStyle: function(name) {
        let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
        let uri = Services.io.newURI("resource://gnome-theme-tweak/content/tweaks/"+name+".css", null, null);
        if (!sss.sheetRegistered(uri, sss.USER_SHEET))
            sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
    },
    
    unloadStyle: function(name) {
        let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
        let uri = Services.io.newURI("resource://gnome-theme-tweak/content/tweaks/"+name+".css", null, null);
        if (sss.sheetRegistered(uri, sss.USER_SHEET))
            sss.unregisterSheet(uri, sss.USER_SHEET);
    },

    init: function() {
        this.loadStyle("fxbutton");
        this.loadStyle("newtab-page");
        this.loadStyle("restore-button");
        this.loadStyle("tabs");
        this.loadStyle("urlbar-history-dropmarker");
    },
    
    uninit: function() {
        this.unloadStyle("fxbutton");
        this.unloadStyle("newtab-page");
        this.unloadStyle("restore-button");
        this.unloadStyle("tabs");
        this.unloadStyle("urlbar-history-dropmarker");
    },
}

let ResourceAlias = {
    register: function(alias, data) {
        let ios = Services.io;
        if (!alias) return false;
        this._alias = alias;
        if (this._resProtocolHandler) return false;
        this._resProtocolHandler = ios.getProtocolHandler("resource");
        this._resProtocolHandler.QueryInterface(Ci.nsIResProtocolHandler);
        let uri = data.resourceURI;
        if (!uri) { // packed
            if (data.installPath.isDirectory()) {
                uri = ios.newFileURI(data.installPath);
            } else { // unpacked
                let jarProtocolHandler = ios.getProtocolHandler("jar");
                jarProtocolHandler.QueryInterface(Ci.nsIJARProtocolHandler);
                let spec = "jar:" + ios.newFileURI(data.installPath).spec + "!/";
                uri = jarProtocolHandler.newURI(spec, null, null);
            }
        }
        this._resProtocolHandler.setSubstitution(alias, uri);
        return true;
    },
    unregister: function() {
        if (!this._resProtocolHandler) return false;
        this._resProtocolHandler.setSubstitution(this._alias, null);
        delete this._resProtocolHandler;
        delete this._alias;
        return true;
    }
}

function startup(data, reason) {
    ResourceAlias.register("gnome-theme-tweak", data);
    GNOMEThemeTweak.init();
}

function shutdown(data, reason) {
    ResourceAlias.unregister();
    GNOMEThemeTweak.uninit();
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
