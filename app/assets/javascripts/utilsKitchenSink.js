/**
 * Author: Lee Sylvester
 * Copyright: XirSys 2013
 * 
 * Description: This utilities file encapsulates the users list functionality. It is
 * contained within this file so as to not clutter the important steps required to
 * establish connections as detailed in the demo HTML files.
 **/

var utilsKitchenSink = {};
(function (utilsKitchenSink, xrtc) {
	var _av = false,
		_room = null,
		_userName = null,
		_textChannel = [],
		_connection = null,
		_localMediaStream = null,
		_remoteParticipantId = null;

	xrtc.Class.extend(utilsKitchenSink, {

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

		// Once connection created, assign necessary events
		connectionCreated: function(connectionData) {
			_connection = connectionData.connection;
			_remoteParticipantId = connectionData.userId;

			utilsKitchenSink.subscribe( _connection, xrtc.Connection.events );

			var data = _connection.getData();

			_connection
				// On remote stream, assign to video DOM object and refresh users list
				.on( xrtc.Connection.events.remoteStreamAdded, function (data) {
					data.isLocalStream = false;
					console.log("adding remote stream");
					utilsKitchenSink.addVideo(data);
					utilsKitchenSink.refreshRoom();
				})
				// Update users list on state change
				.on( xrtc.Connection.events.stateChanged, function (state) {
					utilsKitchenSink.refreshRoom();
				})
				// Handler for simple chat demo's data channel
				.on( xrtc.Connection.events.dataChannelCreated, function (data) {
          var remoteUser = data.channel.getRemoteUser().name;
					_textChannel[remoteUser] = data.channel;
					utilsKitchenSink.subscribe(_textChannel[remoteUser], xrtc.DataChannel.events);
					_textChannel[remoteUser].on( xrtc.DataChannel.events.sentMessage, function(msgData) {
					}).on(xrtc.DataChannel.events.receivedMessage, function (msgData) {
						utilsKitchenSink.addMessage(_textChannel[remoteUser].getRemoteUser().name, msgData.data);
					});
          
					utilsKitchenSink.addMessage("XirSys", "You connected with " + remoteUser + ".");
          
				}).on(xrtc.Connection.events.dataChannelCreationError, function(data) {
					console.log('Failed to create data channel ' + data.channelName + '. Make sure that your Chrome M25 or later with --enable-data-channels flag.');
				})
				// Assign empty handlers
        // You may wish to add real functionality here
				.on( xrtc.Connection.events.localStreamAdded, function (data) { })
				.on( xrtc.Connection.events.connectionEstablished, function (data) { })
				.on( xrtc.Connection.events.connectionClosed, function (data) {
          utilsKitchenSink.addMessage("XirSys", "You disconnected from " + data.user.name + ".");
          var userId = data.user.id;
          delete _textChannel[userId]
          
          // Remove video element of disconnecting user
          $("#video-" + userId).remove();
        });

			if (_av)
				_connection.addStream(_localMediaStream);
		},

		// Assign stream to a video DOM tag
		addVideo: function(data) {
			var stream = data.stream;
      var userId;
      
      if (data.isLocalStream) {
        userId = data.userId;
      } else {
        userId = data.user.id;
      }

			// var video = (data.isLocalStream) ? $('#vid1').get(0) : $('#vid2').get(0);

			var video;
      if (data.isLocalStream) {
        $("#video-slots").append("<video class='many-to-many' id='video-local'></video>")
        video = $('#video-local').get(0);
      } else {
        // Add a new video element with connection credentials
        $("#video-slots").append("<video class='many-to-many' id='video-" + userId + "'></video>")
        video = $('#video-' + userId).get(0);
      }
      
			stream.assignTo(video);

			if ( data.isLocalStream ) {
				video.volume = 0;
			}
		},

		sendMessage: function (message) {
			console.log('Sending message...', message);
      
      // Add your own message to the chat box
      utilsKitchenSink.addMessage(roomInfo.user.name, message, true);
      
      Object.keys(_textChannel).forEach(function (key) {
        if (_textChannel[key]) {
          _textChannel[key].send(message);
        } else {
          console.log('DataChannel is not created. Please, see log.');
        }
      })

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
      
			var contacts = utilsKitchenSink.convertContacts(_room.getUsers());
			for (var index = 0, len = contacts.length; index < len; index++) {
				utilsKitchenSink.addUser(contacts[index]);
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
				'<li class="participant">' + participant + '</li>'
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
		},
    
    // Tests if conditions are good for establishing a connection
		preConnect: function(participant) {
      if (!_textChannel[participant]) {
        utilsKitchenSink.room().connect(participant, { createDataChannel: 'auto' });
      }
    }

	});

})(utilsKitchenSink, xRtc);