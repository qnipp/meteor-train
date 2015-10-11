Meteor.publish('userPresence', function() {
	// Example of using a filter to publish only "online" users:
	return UserPresences.find({state: "online"});
});