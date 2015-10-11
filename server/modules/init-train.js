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

	if ( !speedsExist || speedsExist < 2 ) {
		Train.update({}, { $set: { targetspeed: 0 }}, {upsert: true} );
		Train.update({}, { $set: { currentspeed: 0 }}, {upsert: true} );
	}
};

Modules.server.initTrain = initTrain;


