
Meteor.methods({
	
	// seting speed for train
	setTargetspeed: function (targetspd) {
		
		check(targetspd, String);
		/*
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized. User is not in charge.");
		}*/
		 /*user: Meteor.userId(),*/ 
		
		Train.update({ targetspeed: {$ne: "" } }, { $set: {targetspeed: targetspd }}, {upsert: true} );
		
	}
});