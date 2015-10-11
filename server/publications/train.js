Meteor.publish( 'train', function () {
	//return Train.find({}, { fields: {'targetspeed': 1, 'currentspeed': 1 }} );
	return Train.find({});
});
