var auth = require('../services/auth'),
    Login = require('../routes/app/login.jsx');

var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      if (!auth.loggedIn()) {
        Login.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }
};

module.exports = Authentication;
