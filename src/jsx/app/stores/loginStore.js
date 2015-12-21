var Fluxxor = require('../../../../node_modules/fluxxor'),
    constants = require('../constants/constants'),
    jwt = require('jsonwebtoken');

var LoginStore = Fluxxor.createStore({
  initialize: function() {
    this.user = null;
    this.jwt = null;

    this.bindActions(
      constants.LOGIN_USER, this.onLoginUser,
      constants.LOGOUT_USER, this.onLogoutUser
    );
  },

  onLoginUser: function() {
    this.jwt = action.jwt;
    this.user = jwt.decode(this.jwt);
    this.emit("change");
  },


  test2: function(){
    return "LALALAALAAA";
  },

  onLogoutUser: function() {
    this.user = null;
    this.emit("change");
  },
  user: function() {
    return this.user;
  },

  jwt: function() {
    return this.jwt;
  },

  isLoggedIn: function() {
    return !!this.user;
  }
});

module.exports = LoginStore;
