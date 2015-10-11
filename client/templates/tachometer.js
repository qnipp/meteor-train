Template.tachometer.helpers({
	needleStyle: function() {
		var train = Train.findOne();
		var angle = -120 + train.currentspeed / 100 * 240;

		return {
			style: 'transform: rotate(' + angle + 'deg)'
		}
	},
	selectorStyle: function() {
		var train = Train.findOne();
		var angle = -120 + train.targetspeed / 100 * 240;

		return {
			style: 'transform: rotate(' + angle + 'deg)'
		}
	},
	speed: function() {
		var train = Train.findOne();
		return Math.round(train.currentspeed);
	}
});