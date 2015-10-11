
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
		
		Train.update({}, { $set: {targetspeed: targetspd }});
		
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
		
		Train.update({}, { $set: {direction: direction }} );
		
	},
	// 
	setEngineman: function (connection, leaving) {
		check(connection, String);
		check(leaving, Boolean);
		
		if(connection === "") {
			throw new Meteor.Error("setEngine needs a current connection");
		}
		
		console.log('setEngineman: '+ connection + " - "+ leaving);
		
		if(leaving === true) {
			Train.update({ currentengineman: connection }, { $set: {currentengineman: "", targetspeed: 0}}, null, function(error, rowsaffected) {
				if(rowsaffected !== 1) {
					throw new Meteor.Error("only you can leave the drivers cab.");
				}
				console.log('setEngineman update message: '+ error + " - "+ rowsaffected);
			});
		} else {
			Train.update({ currentengineman: "" }, { $set: {currentengineman: connection }}, null, function(error, rowsaffected) {
				if(rowsaffected !== 1) {
					throw new Meteor.Error("You can only become the engineman, when the drivers cab is empty.");
				}
				console.log('setEngineman update message: '+ error + " - "+ rowsaffected);
			});
		}
	}
});