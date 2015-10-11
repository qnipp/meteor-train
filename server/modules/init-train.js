let trainConfig = [
  {
    targetspeed: 0
  },
  {
	currentspeed: 0
  }
];

let initTrain = () => {	
	let speedsExist    = Train.find().count();

	if ( !speedsExist ) {
		Train.update({}, { $set: { targetspeed: 0, direction: 1, currentconductor: '' }}, {upsert: true} );
	}
};

Modules.server.initTrain = initTrain;
