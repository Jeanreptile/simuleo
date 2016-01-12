var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');

var SimulModelStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = true;
    this.roles = {};
    this.resources = {};
    this.actions = {};
    this.endOfRoundConditions = [];

    this.bindActions(
      constants.ADD_SIMUL_ROLE, this.onAddRole,
      constants.ADD_SIMUL_MODEL_RESOURCE, this.onAddResource,
      constants.ADD_SIMUL_MODEL_ACTION, this.onAddAction,
      constants.ADD_SIMUL_MODEL_ACTION_AVAILABLEIF, this.onAddActionAvailableIf,
      constants.ADD_SIMUL_MODEL_ACTION_AVAILABLEFOR, this.onAddActionAvailableForRole,
      constants.ADD_SIMUL_MODEL_ACTION_EFFECT, this.onAddActionEffect,
      constants.ADD_SIMUL_MODEL_ACTION_END_OF_ROUND_CONDITION, this.onAddEndOfRoundCondition
    );
  },

  onAddRole: function(payload) {
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
    console.log("resources: " + JSON.stringify(this.resources));
    this.emit("change");
  },
  onAddAction: function(payload) {
    //this.actions[payload.actionName] = action;
    this.emit("change");
  },
  onAddActionAvailableIf: function(payload) {
    var actionAvailableIf = {
      "resource": payload.actionAvailableIfResource,
      "operator": payload.actionAvailableIfOperator,
      "value": payload.actionAvailableIfValue
    }
    if (!this.actions[payload.actionName])
      this.actions[payload.actionName] = {};
    console.log("availableIf: " + this.actions[payload.actionName].availableIf);
    if (!this.actions[payload.actionName].availableIf)
      this.actions[payload.actionName].availableIf = [];
    this.actions[payload.actionName].availableIf.push(actionAvailableIf);
    console.log("actions: " + JSON.stringify(this.actions));
    this.emit("change");
  },
  onAddActionAvailableForRole: function(payload) {
    if (!this.actions[payload.actionName].availableFor)
      this.actions[payload.actionName].availableFor = [];
    this.actions[payload.actionName].availableFor.push(payload.actionAvailableForRole);
    this.emit("change");
  },
  onAddActionEffect: function(payload) {
    if (!this.actions[payload.actionName].effects)
      this.actions[payload.actionName].effects = [];
    var actionEffect = {
      "resource": payload.actionEffectsResource,
      "operator": payload.actionEffectsOperator,
      "value": payload.actionEffectsValue == "constant" ? payload.actionEffectsValueInput : payload.actionEffectsValue
    };
    this.actions[payload.actionName].effects.push(actionEffect);
    this.emit("change");
  },
  onAddEndOfRoundCondition: function(payload) {
    var condition = {
      "resource1": payload.endOfRoundConditionResource1,
      "operator": payload.endOfRoundConditionOperator,
      "resource2": payload.endOfRoundConditionResource2
    };
    this.endOfRoundConditions.push(condition);
    console.log("endOfRoundConditions: " + JSON.stringify(this.endOfRoundConditions));
    this.emit("change");
  }
});


module.exports = SimulModelStore;
