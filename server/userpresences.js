/*
 * Meteor.startup(function(){

	Connections.remove({});    

	Meteor.default_server.stream_server.register( Meteor.bindEnvironment( function(socket) {
		var intervalID = Meteor.setInterval(function() {
			if (socket.meteor_session) {

				var connection = {
					connectionID: socket.meteor_session.id,
					connectionAddress: socket.address,
					userID: socket.meteor_session.userId
				};

				socket.id = socket.meteor_session.id;

				Connections.insert(connection); 

				Meteor.clearInterval(intervalID);
			}
		}, 1000);

			socket.on('close', Meteor.bindEnvironment(function () {
			Connections.remove({connectionID: socket.id});
		}, function(e) {
			Meteor._debug("Exception from connection close callback:", e);
		}));


	}, function(e) {
		Meteor._debug("Exception from connection registration callback:", e);
	}));
});
*/
/*
UserPresenceSettings({
  idleDelay: 10000, // How long it takes to go idle
  tickDelay: 5000, // How often the server will check for idle
  onDisconnect: function(userPresence){
	// Do something with userPresence data on user disconnect
} 
});*/

UserPresenceSettings({
	idleDelay: 10000, // How long it takes to go idle
	tickDelay: 5000, // How often the server will check for idle
	onDisconnect: function(userPresence) {
		 // Do something with userPresence data on user disconnect
		console.log('User: '+ userPresence._id + ' has disconnected.');
	}
});