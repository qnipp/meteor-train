Template.registerHelper('equals', function (a, b) {
	return a === b;
});

Template.dashboard.onCreated( () => {
  Template.instance().subscribe( 'train' );
  //Template.instance().subscribe( 'connections' );
  Template.instance().subscribe( 'userPresence' );
  
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
		return Connections.find({});
	},
});


Template.dashboard.events({
	"change #targetspeed": function (event) {
		Meteor.call("setTargetspeed", $(event.currentTarget).val());
	},
});