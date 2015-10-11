let startup = () => {
  _setBrowserPolicies();
  _generateAccounts();
  _initTrain();
};

var _setBrowserPolicies = () => {};

var _generateAccounts = () => Modules.server.generateAccounts();

var _initTrain = () => Modules.server.initTrain();

Modules.server.startup = startup;
