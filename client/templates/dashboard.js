
Template.registerHelper('equals', function (a, b) {
	return a === b;
});

Template.dashboard.onCreated( function() {
	Template.instance().subscribe( 'train' );
	Template.instance().subscribe( 'userPresence' );
});

Template.train.onCreated( function() {
	//console.log('updating myconnection in onCreated: '+ Meteor.connection._lastSessionId);
	this.myconnection = new ReactiveVar( Meteor.connection._lastSessionId );
});

Template.train.onRendered( function() {
	//console.log('updating myconnection in rendered: '+ Meteor.connection._lastSessionId);
	if(Meteor.connection._lastSessionId == null) {
		var myconn = this.myconnection;
		
		Meteor.setTimeout(
				function(){
					console.log('updating myconnection in timeout: '+ Meteor.connection._lastSessionId);
					myconn.set(Meteor.connection._lastSessionId);
				}, 2000);
	} else {
		this.myconnection.set(Meteor.connection._lastSessionId);
	}
});

Template.dashboard.helpers({
	trains: function () {
		return Train.find({});
	},
	connections: function () {
		return UserPresences.find({});
	},
});

Template.train.helpers({
	direction: function () {
		//console.log(this.direction);
		return this.direction == 1 ? 'checked' : false;
	},
	myconnection: function () {
		return Template.instance().myconnection.get();
		//return Meteor.connection._lastSessionId;
	}
});

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
			return train.currentengineman;
		} else {
			return "";
		}
	},
});

Template.train.events({
	"click input.engineman": function (event) {
		// current value: $(event.currentTarget).prop('checked')
		//console.log('direction: '+ $(event.currentTarget).prop('checked'));
		
		Meteor.call("setEngineman", Meteor.connection._lastSessionId, false );
	},
	"click input.leave": function (event) {
		Meteor.call("setEngineman", Meteor.connection._lastSessionId, true );
	},
});

Template.dashboard.events({
	"change input.targetspeed": function (event) {
		// current value: $(event.currentTarget).val()
		//console.log('setTargetspeed: '+ $(event.currentTarget).val() );
		
		Meteor.call("setTargetspeed", parseInt($(event.currentTarget).val()) );
	},
	"change input.direction": function (event) {
		// current value: $(event.currentTarget).prop('checked')
		//console.log('direction: '+ $(event.currentTarget).prop('checked'));
		
		Meteor.call("setDirection", $(event.currentTarget).prop('checked') ? 1 : -1);
	},
});