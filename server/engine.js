var speedInterval = 50;
var acceleration = .4;
var speedRange = 50;

var pwmPin = 1;
var directionPin = 5;

var frontWhitePin = 3;
var frontRedPin = 7;
var rearWhitePin = 4;
var rearRedPin = 15;


Meteor.startup(function() {

	function sign(x) {
		return x > 0 ? 1 : x == 0 ? 0 : -1;
	}

	function oneIf(x) {
		return x ? 1 : 0;
	}

	try {
		var wpi = Meteor.npmRequire("wiring-pi");
	} catch(e) {
		wpi = null;
	}

	Train.update({}, {$set: {wpi: wpi ? "available" : "not-available", targetspeed: 0, direction: 1, currentspeed: 0, currentdirection: 1}}, {upsert: true});

	if (wpi) {

		// Initialize PWM

		wpi.pinMode(pwmPin, wpi.PWM_OUTPUT);
		wpi.pwmSetMode(wpi.PWM_MODE_MS);
		wpi.pwmSetClock(4);
		wpi.pwmSetRange(speedRange);
		wpi.pwmWrite(pwmPin, 0);

		// Initialize direction pin

		wpi.pinMode(directionPin, wpi.OUTPUT);
		wpi.digitalWrite(directionPin, 1);

		// Initialize light pins

		wpi.pinMode(frontWhitePin, wpi.OUTPUT);
		wpi.digitalWrite(frontWhitePin, 0);
		wpi.pinMode(frontRedPin, wpi.OUTPUT);
		wpi.digitalWrite(frontRedPin, 0);
		wpi.pinMode(rearWhitePin, wpi.OUTPUT);
		wpi.digitalWrite(rearWhitePin, 0);
		wpi.pinMode(rearRedPin, wpi.OUTPUT);
		wpi.digitalWrite(rearRedPin, 0);

	}

	// Initialize interval for speed updates

	Meteor.setInterval(function() {

		var train = Train.findOne();

		var signedTargetspeed = train.targetspeed * train.direction;
		var signedCurrentspeed = train.currentspeed * train.currentdirection;

		if (signedTargetspeed != signedCurrentspeed) {

			var newspeed = signedCurrentspeed +
				sign(signedTargetspeed - signedCurrentspeed) *
				Math.min(Math.abs(signedTargetspeed - signedCurrentspeed), acceleration);

			Train.update({}, {$set: {currentspeed: Math.abs(newspeed), currentdirection: sign(newspeed)}});

			if (wpi) {

				// control the engine

				wpi.pwmWrite(pwmPin, Math.floor(Math.abs(newspeed)));
				wpi.digitalWrite(directionPin, newspeed >= 0 ? 1 : 0);

				// switch the lights

				if (newspeed == 0) {
					wpi.digitalWrite(frontWhitePin, oneIf(train.direction > 0));
					wpi.digitalWrite(frontRedPin, oneIf(train.direction <= 0));
					wpi.digitalWrite(rearWhitePin, oneIf(train.direction < 0));
					wpi.digitalWrite(rearRedPin, oneIf(train.direction >= 0));
				} else {
					wpi.digitalWrite(frontWhitePin, oneIf(newspeed > 0));
					wpi.digitalWrite(frontRedPin, oneIf(newspeed <= 0));
					wpi.digitalWrite(rearWhitePin, oneIf(newspeed < 0));
					wpi.digitalWrite(rearRedPin, oneIf(newspeed >= 0));
				}

			} else {
				console.log("Controlling train: speed = " + Math.abs(newspeed) + "  direction = " + (newspeed >= 0));
			}

		}

	}, speedInterval);

});

