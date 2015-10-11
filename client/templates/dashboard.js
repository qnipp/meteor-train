Template.dashboard.onCreated( function() {
  Template.instance().subscribe( 'train' );
});

Template.dashboard.helpers({
		getTargetspeed: function() {
			var query = Train.findOne({ targetspeed: {$ne: "" } }, { fields: {'targetspeed': 1 }} );
			if(query) {
				return query.targetspeed;
			} else {
				return 0;
			}
		},
		getCurrentspeed: function() {
			var query = Train.findOne({ currentspeed: {$ne: "" } }, { fields: {'currentspeed': 1 }} );
			if(query) {
				return query.currentspeed;
			} else {
				return 0;
			}
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
			Meteor.call("setTargetspeed", $(event.currentTarget).val());


		},
	});
