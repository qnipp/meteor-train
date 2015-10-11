
Template.registerHelper('equals', function (a, b) {
	return a === b;
});

Template.dashboard.onCreated( function() {
	Template.instance().subscribe( 'train' );
	Template.instance().subscribe( 'userPresence' );
	
	this.myconnection = new ReactiveVar( Meteor.connection._lastSessionId );
	
	if(Meteor.connection._lastSessionId == null) {
		console.log('updating myconnection in rendered: '+ Meteor.connection._lastSessionId);
		Meteor.setTimeout(
				function(){
					this.myconnection.set(Meteor.connection._lastSessionId);
				}, 1000);
	}
});

Template.dashboard.onRendered( function() {
	console.log('updating myconnection in rendered: '+ Meteor.connection._lastSessionId);
	
	if(Meteor.connection._lastSessionId == null) {
		
		Meteor.setTimeout(
				function(){
					console.log('updating myconnection in timeout: '+ Meteor.connection._lastSessionId);
					this.myconnection.set(Meteor.connection._lastSessionId);
				}, 1000);
	} else {
		this.myconnection.set(Meteor.connection._lastSessionId);
	}
});

Template.dashboard.helpers({
	/*
	getTargetspeed: function() {
		let query = Train.findOne({ targetspeed: {$ne: "" } }, { fields: {'targetspeed': 1 }} );
		if(query) {
			return query.targetspeed;
		} else {
			return 0;
		}
	},
	getCurrentspeed: function() {
		let query = Train.findOne({ currentspeed: {$ne: "" } }, { fields: {'currentspeed': 1 }} );
		if(query) {
			return query.currentspeed;
		} else {
			return 0;
		}
	},
	*/
	trains: function () {
		return Train.find({});
	},
	connections: function () {
		return UserPresences.find({});
	},
	myconnection: function () {
		return Template.instance().myconnection.get();
		//return Meteor.connection._lastSessionId;
	}
});

Template.train.helpers({
	direction: function () {
		//console.log(this.direction);
		return this.direction == 1 ? 'checked' : false;
	}
});

Template.connection.helpers({
	myconnection: function () {
		//return Template.instance().myconnection.get();
		return Meteor.connection._lastSessionId;
	}
});

Template.dashboard.events({
	"change input.targetspeed": function (event) {
		// current value: $(event.currentTarget).val()
		console.log('setTargetspeed: '+ $(event.currentTarget).val() );
		
		Meteor.call("setTargetspeed", parseInt($(event.currentTarget).val()) );
	},
	"change input.direction": function (event) {
		// current value: $(event.currentTarget).prop('checked')
		//console.log('direction: '+ $(event.currentTarget).prop('checked'));
		
		Meteor.call("setDirection", $(event.currentTarget).prop('checked') ? 1 : -1);
	},
});