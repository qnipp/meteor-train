var speedInterval = 50;
var acceleration = 0.8;
var speedRange = 256;

var speedOffset = 150;
var speedFactor = 0.3;
var startingPulse = 40;
var startingPulseDecrement = 10;

var pwmPin = 1;
var directionPin1 = 2;
var directionPin2 = 3;

var frontWhitePin = 6;
var frontRedPin = 7;
var rearWhitePin = 5;
var rearRedPin = 4;

var spawn = null;

Meteor.startup(function() {

	function sign(x) {
		return x > 0 ? 1 : x == 0 ? 0 : -1;
	}

	function oneIf(x) {
		return x ? 1 : 0;
	}

	try {
		var wpi = Meteor.npmRequire("wiring-pi");
		wpi.setup("wpi");
	} catch(e) {
		wpi = null;
	}

	try {
		spawn = Meteor.npmRequire('child_process').spawn;
	} catch(e) {
		spawn = null;
	}

	Train.update({}, {$set: {wpi: wpi ? "available" : "not-available", targetspeed: 0, direction: 1, currentspeed: 0, currentdirection: 1, currentengineman: '', brake: 0}}, {upsert: true});

	if (wpi) {

		// Initialize PWM

		wpi.pinMode(pwmPin, wpi.PWM_OUTPUT);
		wpi.pwmSetMode(wpi.PWM_MODE_MS);
		wpi.pwmSetClock(4);
		wpi.pwmSetRange(speedRange);
		wpi.pwmWrite(pwmPin, 0);

		// Initialize direction pin

		wpi.pinMode(directionPin1, wpi.OUTPUT);
		wpi.digitalWrite(directionPin1, 1);
		wpi.pinMode(directionPin2, wpi.OUTPUT);
		wpi.digitalWrite(directionPin2, 1);

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

	var starting = startingPulse;
	var idleStepper = 0;

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

			if(sign(newspeed) != train.currentdirection) {
				starting = startingPulse;
			}

			if (wpi) {

				// control the engine

				wpi.pwmWrite(pwmPin, Math.floor(speedFactor * Math.abs(newspeed)) + (Math.abs(newspeed) > 0 ? speedOffset + starting : 0));
				if (starting > 0) starting -= startingPulseDecrement;

				wpi.digitalWrite(directionPin1, newspeed >= 0 ? 1 : 0);
				wpi.digitalWrite(directionPin2, newspeed >= 0 ? 0 : 1);

				// switch the lights

				if (newspeed != 0) {
					wpi.digitalWrite(frontWhitePin, oneIf(newspeed > 0));
					wpi.digitalWrite(frontRedPin, oneIf(newspeed < 0));
					wpi.digitalWrite(rearWhitePin, oneIf(newspeed < 0));
					wpi.digitalWrite(rearRedPin, oneIf(newspeed > 0));
				}

			} else {
				console.log("Controlling train: speed = " + Math.abs(newspeed) + "  direction = " + (newspeed >= 0));
			}

		}

		if (signedCurrentspeed == 0 && wpi) {

			var engineman = (train.currentengineman != "");

			if (engineman) {
				stepper = 0;
				wpi.digitalWrite(frontWhitePin, oneIf(train.direction > 0));
				wpi.digitalWrite(frontRedPin, oneIf(train.direction <= 0));
				wpi.digitalWrite(rearWhitePin, oneIf(train.direction < 0));
				wpi.digitalWrite(rearRedPin, oneIf(train.direction >= 0));
			} else {
				idleStepper++;
				if (idleStepper >= 200) idleStepper = 0;

				wpi.digitalWrite(frontWhitePin, oneIf(idleStepper < 10));
				wpi.digitalWrite(frontRedPin, oneIf(idleStepper >= 100 && idleStepper < 110));
				wpi.digitalWrite(rearWhitePin, oneIf(idleStepper >= 50 && idleStepper < 60));
				wpi.digitalWrite(rearRedPin, oneIf(idleStepper >= 150 && idleStepper < 160));
			}

		}

	}, speedInterval);

});

Meteor.methods({
	playSound: function(sound) {

		if (spawn) {
			spawn('aplay', [ '-D', 'sysdefault:CARD=Set', "/home/pi/taurus_horn_gemischt_e.wav" ]);
		}

		/*
		//var Sound = require('node-aplay');
		var Sound = Meteor.npmRequire("node-aplay");

		// fire and forget:
		new Sound('/home/pi/taurus_horn_gemischt_e.wav').play();
		*/

		/*
		// with ability to pause/resume:
		var music = new Sound('/home/pi/taurus_horn_gemischt_e.wav');
		music.play();

		setTimeout(function () {
			music.pause(); // pause the music after five seconds
		}, 5000);

		setTimeout(function () {
			music.resume(); // and resume it two seconds after pausing
		}, 7000);
		*/

		/*
		// you can also listen for various callbacks:
		music.on('complete' function () {
			console.log('Done with playback!');
		});
		*/
	}
});
