
Meteor.methods({
	
	// seting speed for train
	setTargetspeed: function (targetspd) {
		
		check(targetspd, Number); // number does not work
		//check(targetspd, String);
		/*
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized. User is not in charge.");
		}*/
		 /*user: Meteor.userId(),*/ 
		
		Train.update({ targetspeed: {$ne: "" } }, { $set: {targetspeed: targetspd }}, {upsert: true} );
		
	},
	// seting speed for train
	setDirection: function (direction) {
		
		check(direction, Number);
		/*
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized. User is not in charge.");
		}*/
		 /*user: Meteor.userId(),*/ 
		
		Train.update({ direction: {$ne: "" } }, { $set: {direction: direction }}, {upsert: true} );
		
	}
});