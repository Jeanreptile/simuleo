var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');


var StudentStore = Fluxxor.createStore({
  initialize: function() {
    this.students = [];

    this.bindActions(
      constants.INIT_STUDENTS, this.onInitStudent,
      constants.REMOVE_STUDENT, this.removeStudent
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

  removeStudent: function(payload){
    var studentId = payload.studentId;
    var students = this.students;
    students.forEach(function(student, i){
      if (student.id === studentId){
        this.students = students.splice(i, 1);
      }
    });
    console.log("new students list " + this.students);
    this.emit("change");
  }
});

module.exports = StudentStore;
