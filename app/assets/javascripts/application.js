// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap

//= require 'xrtc-1.4.0'
//= require 'xRtc/Common'
//= require 'xRtc/Class'
//= require 'xRtc/CommonError'
//= require 'xRtc/Logger'
//= require 'xRtc/EventDispatcher'
//= require 'xRtc/Ajax'
//= require 'xRtc/ServerConnector'
//= require 'xRtc/AuthManager'
//= require 'xRtc/DataChannel'
//= require 'xRtc/HandshakeController'
//= require 'xRtc/UserMedia'
//= require 'xRtc/Connection'
//= require 'xRtc/Stream'
//= require 'xRtc/Room'

//= require 'utils'

//= require_tree .

// Makes external links open in new tab
$(document).ready(function() {
  $("a").click(function() {
    link_host = this.href.split("/")[2];
    document_host = document.location.href.split("/")[2];
    
    // Undefined makes sure green status updates don't open new tabs
    if (link_host != document_host && link_host != undefined) {
      window.open(this.href);
      return false;
    }
  });
});