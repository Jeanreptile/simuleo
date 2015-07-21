var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');


var StudentStore = Fluxxor.createStore({
  initialize: function() {
    this.students = [];

    this.bindActions(
      constants.INIT_STUDENTS, this.onInitStudent
    );
  },
  getState: function() {
    return {
      studentsOptions: this.studentsOptions
    };
  },

  onInitStudent: function(payload) {
    this.students = payload.students;
    this.emit("change");
  },

  removeStudent: function(student){

  }
});

module.exports = StudentStore;
