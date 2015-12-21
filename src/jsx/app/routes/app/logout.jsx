var auth = require('../../services/auth');

window.React = React

var Logout = React.createClass({

  statics: {
    willTransitionTo: function (transition) {
      if ( !auth.loggedIn()) {
        transition.redirect('/');
      }
    }
  },

  componentDidMount: function () {
    console.log("React in Logout");
    auth.logout();
  },
  render: function () {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout;
