var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');

var SimulModelStore = Fluxxor.createStore({
  initialize: function() {
    this.status = "";
    this.name = "";
    this.context = "";
    this.roles = {};
    this.resources = {};
    this.actions = {};
    this.endOfRoundConditions = [];
    this.existingSimulationModels = [];
    this.loadingSimulationModels = "";
    this.loadingError = "";
    this.editing = "";
    this.editingError = "";
    this.actionName = "";

    this.bindActions(
      constants.ADD_SIMUL_ROLE, this.onAddRole,
      constants.ADD_SIMUL_MODEL_RESOURCE, this.onAddResource,
      constants.ADD_SIMUL_MODEL_ACTION, this.onAddAction,
      constants.ADD_SIMUL_MODEL_ACTION_AVAILABLEIF, this.onAddActionAvailableIf,
      constants.ADD_SIMUL_MODEL_ACTION_AVAILABLEFOR, this.onAddActionAvailableForRole,
      constants.ADD_SIMUL_MODEL_ACTION_EFFECT, this.onAddActionEffect,
      constants.ADD_SIMUL_MODEL_ACTION_END_OF_ROUND_CONDITION, this.onAddEndOfRoundCondition,
      constants.ADD_SIMUL_MODEL, this.onAddSimulModel,
      constants.ADD_SIMUL_MODEL_SUCCESS, this.onAddSimulModelSuccess,
      constants.ADD_SIMUL_MODEL_FAIL, this.onAddSimulModelError,
      constants.LOAD_SIMUL_MODELS, this.onLoadSimulModels,
      constants.LOAD_SIMUL_MODELS_SUCCESS, this.onLoadSimulModelsSuccess,
      constants.LOAD_SIMUL_MODELS_FAIL, this.onLoadSimulModelsFail,
      constants.EDIT_SIMUL_MODEL, this.onEditSimulModel,
      constants.EDIT_SIMUL_MODEL_SUCCESS, this.onEditSimulModelSuccess,
      constants.EDIT_SIMUL_MODEL_FAIL, this.onEditSimulModelFail
    );
  },

  onAddRole: function(payload) {
    this.context = payload.simulContext;
    this.roles[payload.roleName] = payload.roleMessage;
    this.emit("change");
  },
  getRoles: function() {
    return this.roles;
  },
  onAddResource: function(payload) {
    var resource = {
      'higherValue': payload.resourceHigherValue,
      'lowerValue': payload.resourceLowerValue,
      'initialValue': payload.resourceInitialValue,
      'isShared': payload.resourceIsShared,
      'isCritical': payload.resourceIsCritical,
      'role': payload.resourceRole
    };
    this.resources[payload.resourceName] = resource;
    //console.log("resources: " + JSON.stringify(this.resources));
    this.emit("change");
  },
  onAddAction: function(payload) {
    //this.actions[payload.actionName] = action;
    this.actionName = payload.actionName;
    this.emit("change");
  },
  onAddActionAvailableIf: function(payload) {
    this.actionName = payload.actionName;
    var actionAvailableIf = {
      "resource": payload.actionAvailableIfResource,
      "operator": payload.actionAvailableIfOperator,
      "value": payload.actionAvailableIfValue
    }
    if (!this.actions[payload.actionName]) {
      this.actions[payload.actionName] = {};
      this.actions[payload.actionName].availableIf = [];
      this.actions[payload.actionName].availableIf.push(actionAvailableIf);
    }
    else {
      if (!this.actions[payload.actionName].availableIf) {
        this.actions[payload.actionName].availableIf = [];
        this.actions[payload.actionName].availableIf.push(actionAvailableIf);
      }
      else {
        var found = false;
        for (var i = 0; i < this.actions[payload.actionName].availableIf.length; i++) {
          if (this.actions[payload.actionName].availableIf[i].resource == actionAvailableIf.resource) {
            this.actions[payload.actionName].availableIf[i] = actionAvailableIf;
            found = true;
          }
        };
        if (!found) {
          this.actions[payload.actionName].availableIf.push(actionAvailableIf);
        }
      }
    }
    //console.log("availableIf: " + this.actions[payload.actionName].availableIf);  
    //console.log("actions: " + JSON.stringify(this.actions));
    this.emit("change");
  },
  onAddActionAvailableForRole: function(payload) {
    if (!this.actions[payload.actionName].availableFor)
      this.actions[payload.actionName].availableFor = [];
    this.actions[payload.actionName].availableFor.push(payload.actionAvailableForRole);
    this.emit("change");
  },
  onAddActionEffect: function(payload) {
    var actionEffect = {
      "resource": payload.actionEffectsResource,
      "operator": payload.actionEffectsOperator,
      "value": payload.actionEffectsValue == "constant" ? payload.actionEffectsValueInput : payload.actionEffectsValue
    };
    if (!this.actions[payload.actionName].effects) {
      this.actions[payload.actionName].effects = [];
      this.actions[payload.actionName].effects.push(actionEffect);
    }
    else {
      var found = false;
      for (var i = 0; i < this.actions[payload.actionName].effects.length; i++) {
        if (this.actions[payload.actionName].effects[i].resource == actionEffect.resource) {
          this.actions[payload.actionName].effects[i] = actionEffect;
          found = true;
        }
      };
      if (!found) {
        this.actions[payload.actionName].effects.push(actionEffect);
      }
    }
    
    
    this.emit("change");
  },
  onAddEndOfRoundCondition: function(payload) {
    var condition = {
      "resource1": payload.endOfRoundConditionResource1,
      "operator": payload.endOfRoundConditionOperator,
      "resource2": payload.endOfRoundConditionResource2
    };
    this.endOfRoundConditions.push(condition);
    //console.log("endOfRoundConditions: " + JSON.stringify(this.endOfRoundConditions));
    this.emit("change");
  },
  onAddSimulModel: function(payload) {
    this.name = payload.simulName;
    this.context = payload.simulContext;
    this.status = "ADDING";
    this.emit("change");
  },
  onAddSimulModelSuccess: function(payload) {
    this.status = "SUCCESS";
    this.emit("change");
  },
  onAddSimulModelError: function(payload) {
    this.status = "ERROR";
    this.emit("change");
  },
  onLoadSimulModels: function() {
    this.loadingSimulationModels = "LOADING";
    this.emit("change");
  },
  onLoadSimulModelsSuccess: function(payload) {
    this.loadingSimulationModels = "SUCCESS";
    this.existingSimulationModels = payload.simulationModels;
    this.emit("change");
  },
  onLoadSimulModelsFail: function(payload) {
    this.loadingSimulationModels = "FAIL";
    this.loadingError = payload.error;
    this.emit("change");
  },
  onEditSimulModel: function() {
    this.editing = "EDITING";
    this.emit("change");
  },
  onEditSimulModelSuccess: function(payload) {
    this.editing = "SUCCESS";
    this.name = payload.simulationModel.name;
    this.context = payload.simulationModel.context;
    this.roles = payload.simulationModel.roles;
    this.resources = payload.simulationModel.resources;
    this.actions = payload.simulationModel.actions;
    this.endOfRoundConditions = payload.simulationModel.endOfRoundConditions;
    this.actionName = Object.keys(payload.simulationModel.actions)[0];
    this.emit("change");
  },
  onEditSimulModelFail: function(payload) {
    this.editingError = "error";
    this.emit("change");
  }
});


module.exports = SimulModelStore;
