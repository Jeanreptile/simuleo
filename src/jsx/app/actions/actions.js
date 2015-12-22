var constants = require('../constants/constants');

module.exports = {

    addSimulRole: function(roleName, roleMessage) {
      this.dispatch(constants.ADD_SIMUL_ROLE, {roleName: roleName, roleMessage: roleMessage});
    },
    addSimulModelResource: function(resourceName, resourceHigherValue, resourceLowerValue, resourceInitialValue, resourceIsShared, resourceIsCritical, resourceRole) {
      this.dispatch(constants.ADD_SIMUL_MODEL_RESOURCE, { resourceName: resourceName, resourceHigherValue: resourceHigherValue,
        resourceLowerValue: resourceLowerValue, resourceInitialValue: resourceInitialValue, resourceIsShared: resourceIsShared,
        resourceIsCritical: resourceIsCritical });
    },
    //Simulation config
    addSimul: function(groups) {
      this.dispatch(constants.ADD_SIMUL);
      /*
      $.post( "/api/simul_negociation", {acheteur: acheteur, vendeur: vendeur, contexte: contexte}, function(links) {
        }.bind(this))
        .done(function(links) {
          this.dispatch(constants.ADD_SIMUL_SUCCESS, {uniqueId: links.uniqueId, acheteur : acheteur, vendeur: vendeur, contexte: contexte});
        }.bind(this))
        .fail(function(error) {
           this.dispatch(constants.ADD_SIMUL_FAIL, {error: error});
        }.bind(this));*/
        setTimeout(function(){
          this.dispatch(constants.ADD_SIMUL_SUCCESS, {tutu: "1213"});
        }.bind(this), 5000)
    },
  // Simulation 1 config – students
    initStudents: function(students)
    {
      this.dispatch(constants.INIT_STUDENTS, {students: students});
    },

    removeStudent: function(studentId)
    {
      this.dispatch(constants.REMOVE_STUDENT, {studentId: studentId});
    },

  //Simulations
  loadSimul: function(type, uniqueId) {
    this.dispatch(constants.LOAD_SIMUL, {type, uniqueId});
    $.get( "/api/simul_negociation/" + uniqueId, function(infos) {
        this.dispatch(constants.LOAD_SIMUL_SUCCESS, {infos: infos[0], type: this.type});
      }.bind(this))
      .done(function() {
      })
      .fail(function(error) {
         this.dispatch(constants.LOAD_SIMUL_FAIL, {error: error});
      }.bind(this));
  },


  // Login
  loginUser: function(jwt) {
    var savedJwt = localStorage.getItem('jwt');

    if (savedJwt !== jwt) {
      var nextPath = RouterContainer.get().getCurrentQuery().nextPath || '/';

      RouterContainer.get().transitionTo(nextPath);
      localStorage.setItem('jwt', jwt);
    }

    this.dispatch(constants.LOGIN_USER, {jwt: jwt});
  },

  logoutUser: function() {
    RouterContainer.get().transitionTo('/login');
    localStorage.removeItem('jwt');

    this.dispatch(constants.LOGOUT_USER);
  },

  //Classes

  loadClasses: function(emailProf) {
    this.dispatch(constants.LOAD_CLASSES);
    $.get( "/classess/" + emailProf, function(classes) {
        this.dispatch(constants.LOAD_CLASSES_SUCCESS, {classes: classes});
      }.bind(this))
      .done(function() {
      })
      .fail(function() {
         this.dispatch(constants.LOAD_CLASSES_FAIL, {error: error});
      }.bind(this));
  },

  addClasse: function(word) {
    var id = _.uniqueId();
    this.dispatch(constants.ADD_CLASSE, {id: id, word: word});

    ClassewordClient.submit(word, function() {
      this.dispatch(constants.ADD_CLASSE_SUCCESS, {id: id});
    }.bind(this), function(error) {
      this.dispatch(constants.ADD_CLASSE_FAIL, {id: id, error: error});
    }.bind(this));
  },

  // Sign up
  addUser: function(email, firstname, lastname, type, password) {
    console.log("Adding USER ", email, firstname, lastname, type, password);
    this.dispatch(constants.ADD_USER);
    $.post( "/api/user", { email: email, firstname: firstname, lastname: lastname, type: type, password: password },
      function(links) { }.bind(this)
    )
    .done(function(links) {
        this.dispatch(constants.ADD_USER_SUCCESS, {uniqueId: links.uniqueId, email: email, firstname: firstname, lastname: lastname, type: type, password: password });
      }.bind(this)
    )
    .fail(function(error) {
        this.dispatch(constants.ADD_USER_FAIL, {error: error});
      }.bind(this)
    );
  }
};
