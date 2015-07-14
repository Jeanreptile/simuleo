var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');


var ClasseStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.error = null;
    this.classes = {};

    this.bindActions(
      constants.LOAD_CLASSES, this.onLoadClasses,
      constants.LOAD_CLASSES_SUCCESS, this.onLoadClassesSuccess,
      constants.LOAD_CLASSES_FAIL, this.onLoadClassesFail,

      constants.ADD_CLASSE, this.onAddClasse,
      constants.ADD_CLASSE_SUCCESS, this.onAddClasseSuccess,
      constants.ADD_CLASSE_FAIL, this.onAddClasseFail
    );
  },

  onLoadClasses: function() {
    this.loading = true;
    this.emit("change");
  },

  onLoadClassesSuccess: function(payload) {
    this.loading = false;
    this.error = null;

    this.classes = payload.classes.reduce(function(acc, classe) {
      var clientId = _.uniqueId();
      acc[clientId] = {id: clientId, classe: classe, status: "OK"};
      return acc;
    }, {});
    this.emit("change");
  },

  onLoadClassesFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  },

  onAddClasse: function(payload) {
    var word = {id: payload.id, word: payload.word, status: "ADDING"};
    this.words[payload.id] = word;
    this.emit("change");
  },

  onAddClasseSuccess: function(payload) {
    this.words[payload.id].status = "OK";
    this.emit("change");
  },

  onAddClasseFail: function(payload) {
    this.words[payload.id].status = "ERROR";
    this.words[payload.id].error = payload.error;
    this.emit("change");
  }
});

module.exports = ClasseStore;
