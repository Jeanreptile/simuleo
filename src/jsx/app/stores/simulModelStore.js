var Fluxxor = require('../../../../node_modules/fluxxor');
    constants = require('../constants/constants');

var SimulModelStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = true;
    this.roles = {};

    this.bindActions(
      constants.ADD_SIMUL_ROLE, this.onAddRole
    );
  },

  onAddRole: function(payload) {
    this.roles[payload.roleName] = payload.roleMessage;
    this.emit("change");
  },
  getRoles: function() {
    return this.roles;
  },
});


module.exports = SimulModelStore;
