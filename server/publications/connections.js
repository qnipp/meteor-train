Meteor.publish('userPresence', function() {
  // Example of using a filter to publish only "online" users:
  var filter = {state: "online"};
  return UserPresences.find(filter);
});