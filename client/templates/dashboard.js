
Template.registerHelper('equals', function (a, b) {
	return a === b;
});

//// dashboard

Template.dashboard.onCreated( function() {
	Template.instance().subscribe( 'train' );
	Template.instance().subscribe( 'userPresence' );
});

Template.dashboard.helpers({
	trains: function () {
		return Train.find({});
	},
	connections: function () {
		return UserPresences.find({});
	},
});



//// train

Template.train_controls.onCreated( function() {
	this.myconnection = new ReactiveVar( Meteor.connection._lastSessionId );
});
Template.train_cab.onCreated( function() {
	this.myconnection = new ReactiveVar( Meteor.connection._lastSessionId );
});


Template.train_controls.onRendered( function() {
	//console.log('updating myconnection in rendered: '+ Meteor.connection._lastSessionId);
	if(Meteor.connection._lastSessionId == null) {
		var myconn = this.myconnection;
		var timeout_train_controls;
		
		console.log('train_controls - myconnection is null in rendered: '+ Meteor.connection._lastSessionId + ' starting interval');
		
		timeout_train_controls = Meteor.setInterval(
			function(){
				console.log('train_controls - updating myconnection in interval: '+ Meteor.connection._lastSessionId);
				if(Meteor.connection._lastSessionId != null) {
					myconn.set(Meteor.connection._lastSessionId);
					Meteor.clearInterval(timeout_train_controls);
				}
			}, 1000);
	} else {
		this.myconnection.set(Meteor.connection._lastSessionId);
	}
});

Template.train_cab.onRendered( function() {
	//console.log('updating myconnection in rendered: '+ Meteor.connection._lastSessionId);
	if(Meteor.connection._lastSessionId == null) {
		var myconn = this.myconnection;
		var timeout_train_cab;
		
		console.log('train_cab - myconnection is null in rendered: '+ Meteor.connection._lastSessionId + ' starting interval');
		
		timeout_train_cab = Meteor.setInterval(
			function(){
				console.log('train_cab - updating myconnection in interval: '+ Meteor.connection._lastSessionId);
				if(Meteor.connection._lastSessionId != null) {
					myconn.set(Meteor.connection._lastSessionId);
					Meteor.clearInterval(timeout_train_cab);
				}
			}, 1000);
	} else {
		this.myconnection.set(Meteor.connection._lastSessionId);
	}
});


Template.train_controls.helpers({
	directioncheck: function () {
		//console.log(this.direction);
		return this.direction == 1 ? 'checked' : false;
	},
	
	myconnection: function () {
		return Template.instance().myconnection.get();
		//return Meteor.connection._lastSessionId;
	}
});


Template.train_cab.helpers({
	myconnection: function () {
		return Template.instance().myconnection.get();
		//return Meteor.connection._lastSessionId;
	},
	currentengineman: function () {
	//return Template.instance().myconnection.get();
		var train = Train.findOne({});
		if(train) {
			if(train.currentengineman != '') {
				var isStillhere = UserPresences.findOne({_id: train.currentengineman});
				if(isStillhere) {
					return train.currentengineman;
				} else {
					Train.update({ currentengineman: train.currentengineman }, { $set: {currentengineman: "", targetspeed: 0}}, null, function(error, rowsaffected) {
						console.log('unsetEngineman update message: '+ error + " - "+ rowsaffected);
					});
				}
			}
			return "";

		} else {
			return "";
		}
	},
});



Template.train_controls.events({
	"change input.targetspeed": function (event) {
		// current value: $(event.currentTarget).val()
		//console.log('setTargetspeed: '+ $(event.currentTarget).val() );
		
		Meteor.call("setTargetspeed", parseInt($(event.currentTarget).val()) );
	},
	"change input.direction": function (event) {
		// current value: $(event.currentTarget).prop('checked')
		//console.log('direction: '+ $(event.currentTarget).prop('checked'));
		
		//Meteor.call("setDirection", $(event.currentTarget).prop('checked') ? 1 : -1);
		Meteor.call("setDirection", parseInt($(event.currentTarget).val()));
	},
});

Template.train_cab.events({
	"click input.engineman": function (event) {
		// current value: $(event.currentTarget).prop('checked')
		//console.log('direction: '+ $(event.currentTarget).prop('checked'));
		
		Meteor.call("setEngineman", Meteor.connection._lastSessionId, false );
	},
	"click input.leave": function (event) {
		Meteor.call("setEngineman", Meteor.connection._lastSessionId, true );
	},
});


//// connection

Template.connection.helpers({
	myconnection: function () {
		//return Template.instance().myconnection.get();
		return Meteor.connection._lastSessionId;
	},
	username: function () {
		//return Template.instance().myconnection.get();
		var user = Meteor.users.findOne({_id: this.userId});
		if(user) {
			return user.profile.name.first + ' ' +user.profile.name.last ;
		} else {
			return 'unknown';
		}
	},
	currentengineman: function () {
		//return Template.instance().myconnection.get();
		var train = Train.findOne({});
		if(train) {
			if(train.currentengineman != '') {
				var isStillhere = UserPresences.findOne({_id: train.currentengineman});
				if(isStillhere) {
					return train.currentengineman;
				}
			}
			return "";

		} else {
			return "";
		}
	}
});




