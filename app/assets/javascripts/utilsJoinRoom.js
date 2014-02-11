/**
 * Author: Lee Sylvester
 * Copyright: XirSys 2013
 * 
 * Description: This utilities file encapsulates the users list functionality. It is
 * contained within this file so as to not clutter the important steps required to
 * establish connections as detailed in the demo HTML files.
 **/

var utilsJoinRoom = {};
(function (utilsJoinRoom, xrtc) {
	var _av = false,
		_room = null,
		_userName = null,
		_textChannel = null,
		_connection = null,
		_localMediaStream = null,
		_remoteParticipantId = null;

	xrtc.Class.extend(utilsJoinRoom, {

		init: function() {
			// Set middle tier service proxies (on server)
			// This is the server page which handles the calls 
			// to the XirSys services
      
			xrtc.AuthManager.settings.tokenHandler = "/xirsys/getToken";
			xrtc.AuthManager.settings.iceHandler = "/xirsys/getIceServers";

			// Enable logging for sanity's sake
			xrtc.Logger.enable({ debug: true, warning: true, error: true, test: true });
		},

		// Accessors / properties
		room: function(r) {
			if (!!r) _room = r;
			return _room;
		},

		username: function(u) {
			if (!!u) _userName = u;
			return _userName;
		},

		connection: function(c) {
			if (!!c) _connection = c;
			return _connection;
		},

		localMediaStream: function(l) {
			if (!!l) _localMediaStream = l;
			return _localMediaStream;
		},

		remoteParticipantId: function(r) {
			if (!!r) _remoteParticipantId = r;
			return _remoteParticipantId;
		},

		// Utility functions

		// Proxy getUserMedia so we can log if video / audio is being requested
		getUserMedia: function(data, success, fail) {
			xrtc.getUserMedia(
				data,
				success,
				fail
			);
			_av = true;
		},

		// Update drop-down list of remote peers
		refreshRoom: function() {
			roomInfo = _room.getInfo();
			$('#userlist').empty();
      
			var contacts = utilsJoinRoom.convertContacts(_room.getUsers());
			for (var index = 0, len = contacts.length; index < len; index++) {
				utilsJoinRoom.addParticipant(contacts[index]);
			}
		},

		// Return a list of participants
		convertContacts: function(participants) {
			var contacts = [];

			for (var i = 0, len = participants.length; i < len; i++) {
				var name = participants[i];
				if ( !!name )
					contacts.push(name.id);
			}

			return contacts;
		},

		// Add remote peer name to drop-down list of contacts
		addParticipant: function(participant) {
			$('#userlist').append(
				'<li>' + participant + '</li>'
			);
		},

		// Remove remote peer from drop-down list of contacts
		removeParticipant: function(participant) {
			$('#userlist').find('.option[value="' + participant + '"]').remove();
		},
    
		// Subscribe to events on eventDispatcher object
		subscribe: function(eventDispatcher, events) {
			if (typeof eventDispatcher.on === "function") {
				for (var eventPropertyName in events) {
					(function (eventName) {
						eventDispatcher.on(eventName, function () {
							console.log('CHAT', eventDispatcher.className, eventName, Array.prototype.slice.call(arguments));
						});
					})(events[eventPropertyName]);
				}
			}
		}

	});

})(utilsJoinRoom, xRtc);