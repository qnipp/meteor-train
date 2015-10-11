Template.dashboard.onCreated( () => {
  Template.instance().subscribe( 'train' );
});

Template.dashboard.helpers({
		getTargetspeed: function() {
			return Train.find({ targetspeed: {$ne: "" } }, { fields: {'targetspeed': 1 }} );
			
		},
		getCurrentspeed: function() {
			return Train.find({ currentspeed: {$ne: "" } }, { fields: {'currentspeed': 1 }} );
		},
		/*
		
		top: function() {
			dep.depend();
			
			var serverTime = (new Date).getTime() + Session.get("serverDiff");
			
			var totalTime = (this.finishAt - this.createdAt);
			var elapsedTime = (serverTime - this.createdAt);
			var percentage = Math.min(1, elapsedTime / totalTime);
			
			return this.source_top + (this.target_top - this.source_top) * percentage; 
		},*/
	}); 

Template.dashboard.events({
		"change #targetspeed": function (event) {
			// current value: $(event.currentTarget).val()
			Meteor.call("setTargetspeed", $(event.currentTarget).val(), this);
			
			
		},
	});