/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

var GNOMEThemeTweak = {
    availableStyles: ["newtab-page", "restore-button", "relief-buttons", "tabs-border", "urlbar-history-dropmarker"],
    appliedStyles: [],
    
    prefs: null,
    
    loadStyle: function(name) {
        let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
        let uri = Services.io.newURI("chrome://gnome-theme-tweak/content/tweaks/"+name+".css", null, null);
        if (!sss.sheetRegistered(uri, sss.USER_SHEET))
            sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
    },
    
    unloadStyle: function(name) {
        let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
        let uri = Services.io.newURI("chrome://gnome-theme-tweak/content/tweaks/"+name+".css", null, null);
        if (sss.sheetRegistered(uri, sss.USER_SHEET))
            sss.unregisterSheet(uri, sss.USER_SHEET);
    },

    init: function() {
        this.prefs = Cc["@mozilla.org/preferences-service;1"]
                       .getService(Components.interfaces.nsIPrefService)
                       .getBranch("extensions.gnome-theme-tweak.");
        
        this.prefs.addObserver("", this, false);
        
        for (var i = 0; i < this.availableStyles.length; i++) {
            if(this.prefs.getPrefType(this.availableStyles[i]) && this.prefs.getBoolPref(this.availableStyles[i]) == true) {
                this.loadStyle(this.availableStyles[i]);
                this.appliedStyles.push(this.availableStyles[i]);
            }
        }
    },
    
    uninit: function() {
        this.prefs.removeObserver("", this);    
        
        for (var i = 0; i < this.appliedStyles.length; i++) {
            this.unloadStyle(this.appliedStyles[i]);
        }
    },
    
    observe: function(subject, topic, data) {
        if (topic != "nsPref:changed") {
            return;
        }
        
        if (this.availableStyles.indexOf(data)) {
            if (this.prefs.getBoolPref(data)) {
                this.loadStyle(data);
            }
            else {
                this.unloadStyle(data);
            }
        }
    },
}

function startup(data, reason) {
    GNOMEThemeTweak.init();
}

function shutdown(data, reason) {
    GNOMEThemeTweak.uninit();
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
