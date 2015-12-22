var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');

var SimulModelStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = true;
    this.roles = {};
    this.resources = [];

    this.bindActions(
      constants.ADD_SIMUL_ROLE, this.onAddRole,
      constants.ADD_SIMUL_MODEL_RESOURCE, this.onAddResource
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
      'name': payload.resourceName,
      'higherValue': payload.resourceHigherValue,
      'lowerValue': payload.resourceLowerValue,
      'initialValue': payload.resourceInitialValue,
      'isShared': payload.resourceIsShared,
      'isCritical': payload.resourceIsCritical,
      'role': payload.resourceRole
    };
    this.resources.push(resource);
    this.emit("change");
  }
});


module.exports = SimulModelStore;
