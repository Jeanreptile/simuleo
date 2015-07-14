var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');

var SimulStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = true;
    this.typeRole = "";
    this.montant_acheteur = "";
    this.montant_vendeur = "";
    this.proposition_acheteur = "";
    this.uniqueId = "";
    //this.socket = io.connect('http://localhost');

    this.bindActions(
      constants.LOAD_SIMUL, this.onLoadSimul,
      constants.LOAD_SIMUL_SUCCESS, this.onLoadSimulSuccess,
      constants.LOAD_SIMUL_FAIL, this.onLoadSimulFail
    );
  },

  onLoadSimul: function(payload) {
    this.typeRole = payload.type;
    this.uniqueId = payload.uniqueId;
    this.loading = false;
    this.emit("change");
    /*
     this.socket.on('news', function (data) {
       console.log(data);
       socket.emit('my other event', { my: 'data' });
     });
     */
  },

  onLoadSimulSuccess: function(payload) {
    this.loading = false;
    this.error = null;
    this.contexte = payload.infos.contexte;
    console.log(JSON.stringify(payload.infos));
    if (this.typeRole == "acheteur")
    {
      this.montant_acheteur = payload.infos.acheteur;
    }
    else {
      this.montant_vendeur = payload.infos.vendeur;
    }
    this.emit("change");

/*
    this.classes = payload.classes.reduce(function(acc, classe) {
      var clientId = _.uniqueId();
      acc[clientId] = {id: clientId, classe: classe, status: "OK"};
      return acc;
    }, {});
    this.emit("change");
    */
  },

  onLoadSimulFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  }
});


module.exports = SimulStore;
