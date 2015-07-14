var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');

var UserStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.finished = false;
    this.info = {};
    //this.socket = io.connect('http://localhost');

    this.bindActions(
      constants.ADD_USER, this.onAddUser,
      constants.ADD_USER_SUCCESS, this.onAddUserSuccess,
      constants.ADD_USER_FAIL, this.onAddUserFail
    );
  },

  onAddUser: function(payload) {
    //var word = {id: payload.id, word: payload.word, status: "ADDING"};
    //this.words[payload.id] = word;
    //APICALL
    //this.emit("change");
    this.finished = true;
    this.emit("change");
  },

  onAddUserSuccess: function(payload) {
    //this.
    // this.info["acheteur"] = "http://localhost:8080/simul_negociation/" + payload.uniqueId + "/acheteur";
    // this.info["vendeur"] = "http://localhost:8080/simul_negociation/" + payload.uniqueId + "/vendeur";;
    // this.info["montant_acheteur"] = payload.acheteur;
    // this.info["contexte"] = payload.contexte;
    // this.info["montant_vendeur"] = payload.vendeur;
    this.emit("change");
  },

  onAddUserFail: function(payload) {
    // this.words[payload.id].status = "ERROR";
    // this.words[payload.id].error = payload.error;
    this.emit("change");
  }
});

module.exports = UserStore;