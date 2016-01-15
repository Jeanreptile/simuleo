var constants = require('../constants/constants');

module.exports = {

    addSimulRole: function(simulContext, roleName, roleMessage) {
      this.dispatch(constants.ADD_SIMUL_ROLE, {simulContext: simulContext, roleName: roleName, roleMessage: roleMessage});
    },
    addSimulModelResource: function(resourceName, resourceHigherValue, resourceLowerValue, resourceInitialValue, resourceIsShared, resourceIsCritical, resourceRole) {
      this.dispatch(constants.ADD_SIMUL_MODEL_RESOURCE, { resourceName: resourceName,
        resourceHigherValue: resourceHigherValue, resourceLowerValue: resourceLowerValue,
        resourceInitialValue: resourceInitialValue, resourceIsShared: resourceIsShared,
        resourceIsCritical: resourceIsCritical, resourceRole: resourceRole });
    },
    addSimulModelActionAvailableIf: function(actionName, actionAvailableIfResource, actionAvailableIfOperator, actionAvailableIfValue) {
      this.dispatch(constants.ADD_SIMUL_MODEL_ACTION_AVAILABLEIF, { actionName: actionName,
        actionAvailableIfResource: actionAvailableIfResource, actionAvailableIfOperator: actionAvailableIfOperator,
        actionAvailableIfValue: actionAvailableIfValue });
    },
    addSimulModelActionAvailableForRole: function(actionName, actionAvailableForRole) {
      this.dispatch(constants.ADD_SIMUL_MODEL_ACTION_AVAILABLEFOR, { actionName: actionName,
        actionAvailableForRole: actionAvailableForRole });
    },
    addSimulModelActionEffects: function(actionName, actionEffectsResource, actionEffectsOperator, actionEffectsValue, actionEffectsValueInput) {
      this.dispatch(constants.ADD_SIMUL_MODEL_ACTION_EFFECT, { actionName: actionName,
        actionEffectsResource: actionEffectsResource, actionEffectsOperator: actionEffectsOperator,
        actionEffectsValue: actionEffectsValue, actionEffectsValueInput: actionEffectsValueInput });
    },
    addSimulModelAction: function(actionName, actionAvailableIfResource, actionAvailableIfOperator, actionAvailableIfValue, actionAvailableForRole, actionEffectsResource, actionEffectsOperator, actionEffectsValue) {
      this.dispatch(constants.ADD_SIMUL_MODEL_ACTION, { actionName: actionName });
    },
    addSimulModelEndOfRoundCondition: function(endOfRoundConditionResource1, endOfRoundConditionResource2, endOfRoundConditionOperator) {
      this.dispatch(constants.ADD_SIMUL_MODEL_ACTION_END_OF_ROUND_CONDITION, { endOfRoundConditionResource1: endOfRoundConditionResource1,
        endOfRoundConditionResource2: endOfRoundConditionResource2, endOfRoundConditionOperator: endOfRoundConditionOperator });
    },
    addSimulModel: function(simulName, simulContext, roles, resources, actions, endOfRoundConditions) {
      this.dispatch(constants.ADD_SIMUL_MODEL, { simulName: simulName, simulContext: simulContext });

      $.post('/api/simul_model/', { name: simulName, context: simulContext, roles: roles, resources: resources,
        actions: actions, endOfRoundConditions: endOfRoundConditions },
        function(links) { }.bind(this)
      )
      .done(function(links) {
          this.dispatch(constants.ADD_SIMUL_MODEL_SUCCESS, {uniqueId: links.uniqueId, name: name, context: simulContext, roles: roles, resources: resources,
          actions: actions, endOfRoundConditions: endOfRoundConditions });
        }.bind(this)
      )
      .fail(function(error) {
          this.dispatch(constants.ADD_SIMUL_MODEL_FAIL, {error: error});
        }.bind(this)
      );
    },
    loadSimulationModels: function() {
      this.dispatch(constants.LOAD_SIMUL_MODELS, {});
      $.get('/api/simul_model/', function(simulationModels) {
        this.dispatch(constants.LOAD_SIMUL_MODELS_SUCCESS, { simulationModels: simulationModels });
      }.bind(this))
      .done(function() {
      })
      .fail(function(error) {
         this.dispatch(constants.LOAD_SIMUL_MODELS_FAIL, {error: error});
      }.bind(this));
    },
    editSimulModelCreationForm: function(simulationModelUniqueId) {
      this.dispatch(constants.EDIT_SIMUL_MODEL);
      $.get('/api/simul_model/' + simulationModelUniqueId, function(simulationModel) {
        this.dispatch(constants.EDIT_SIMUL_MODEL_SUCCESS, {simulationModel: simulationModel });
      }.bind(this))
      .done(function() {
      })
      .fail(function(error) {
         this.dispatch(constants.EDIT_SIMUL_MODEL_FAIL, {error: error});
      }.bind(this));
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
