


Meteor.methods({
	
	// seting speed for train
	setTargetspeed: function (targetspd) {
		
		check(targetspd, String);
		
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized. User is not in charge.");
		}
		
		Train.update({ targetspeed: {$ne: "" } }, { $set: { /*user: Meteor.userId(),*/ targetspeed: targetspd }}, {upsert: true} );
		
	}
});