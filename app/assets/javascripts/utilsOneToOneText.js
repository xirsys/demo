/**
 * Author: Lee Sylvester
 * Copyright: XirSys 2013
 * 
 * Description: This utilities file encapsulates the users list functionality. It is
 * contained within this file so as to not clutter the important steps required to
 * establish connections as detailed in the demo HTML files.
 **/

var utilsOneToOneText = {};
(function (utilsOneToOneText, xrtc) {
	var _av = false,
		_room = null,
		_userName = null,
		_textChannel = null,
		_connection = null,
		_localMediaStream = null,
		_remoteParticipantId = null;

	xrtc.Class.extend(utilsOneToOneText, {

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
		  // xrtc.getUserMedia(
			//   data,
			//   success,
			// 	 fail
			// );
			// _av = true;
		},

		// Once connection created, assign necessary events
		connectionCreated: function(connectionData) {
			_connection = connectionData.connection;
			_remoteParticipantId = connectionData.userId;

			utilsOneToOneText.subscribe( _connection, xrtc.Connection.events );

			var data = _connection.getData();

			_connection
				// On remote stream, assign to video DOM object and refresh users list
				.on( xrtc.Connection.events.remoteStreamAdded, function (data) {
					data.isLocalStream = false;
					console.log("adding remote stream");
					utilsOneToOneText.addVideo(data);
					utilsOneToOneText.refreshRoom();
				})
				// Update users list on state change
				.on( xrtc.Connection.events.stateChanged, function (state) {
					utilsOneToOneText.refreshRoom();
				})
				// Handler for simple chat demo's data channel
				.on( xrtc.Connection.events.dataChannelCreated, function (data) {
					_textChannel = data.channel;
					utilsOneToOneText.subscribe(_textChannel, xrtc.DataChannel.events);
					_textChannel.on( xrtc.DataChannel.events.sentMessage, function(msgData) {
						utilsOneToOneText.addMessage(roomInfo.user.name, msgData.data, true);
					}).on(xrtc.DataChannel.events.receivedMessage, function (msgData) {
						utilsOneToOneText.addMessage(_textChannel.getRemoteUser().name, msgData.data);
					});
          
					utilsOneToOneText.addMessage("XirSys", "You connected with " + _textChannel.getRemoteUser().name + ".");
          
				}).on(xrtc.Connection.events.dataChannelCreationError, function(data) {
					console.log('Failed to create data channel ' + data.channelName + '. Make sure that your Chrome M25 or later with --enable-data-channels flag.');
				})
				// Assign empty handlers
        // You may wish to add real functionality here
				.on( xrtc.Connection.events.localStreamAdded, function (data) { })
				.on( xrtc.Connection.events.connectionEstablished, function (data) { })
				.on( xrtc.Connection.events.connectionClosed, function (data) { 
          utilsOneToOneText.addMessage("XirSys", "You disconnected from " + data.user.name + ".");
        });

			if (_av)
				_connection.addStream(_localMediaStream);
		},

		// Assign stream to a video DOM tag
		addVideo: function(data) {
			var stream = data.stream;
			var userId = data.userId;

			var video = (data.isLocalStream) ? $('#vid1').get(0) : $('#vid2').get(0);

			stream.assignTo(video);

			if ( data.isLocalStream ) {
				video.volume = 0;
			}
		},

		sendMessage: function (message) {
			console.log('Sending message...', message);
			if (_textChannel) {
				_textChannel.send(message);
			} else {
				console.log('DataChannel is not created. Please, see log.');
			}
		},

		addMessage: function (name, message, isMy) {
			var $chat = $('#chatwindow');
      $chat.append("<div class='text-chat-line'><text class='text-chat-user'>" + name + ":</text> " + message + "</div>");
      
      // Fixes chat scrolling behavior
      $chat[0].scrollTop = $chat[0].scrollHeight;
		},

		// Update drop-down list of remote peers
		refreshRoom: function() {
			roomInfo = _room.getInfo();
			$('#userlist').empty();
      
			var contacts = utilsOneToOneText.convertContacts(_room.getUsers());
			for (var index = 0, len = contacts.length; index < len; index++) {
				utilsOneToOneText.addUser(contacts[index]);
			}
		},

		// Call accept on incoming stream
		acceptCall: function(incomingConnectionData) {
			incomingConnectionData.accept();
		},

		// Return a list of participants excluding local user's name
		convertContacts: function(participants) {
			var contacts = [];

			for (var i = 0, len = participants.length; i < len; i++) {
				var name = participants[i];
				if ( !!name && name.id != gon.username )
					contacts.push(name.id);
			}

			return contacts;
		},

		// Add remote peer name to drop-down list of contacts
		addUser: function(participant) {
			$('#userlist').append(
				'<option value="' + participant + '">' + participant + '</option>'
			);
		},

		// Remove remote peer from drop-down list of contacts
		removeUser: function(participant) {
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

})(utilsOneToOneText, xRtc);