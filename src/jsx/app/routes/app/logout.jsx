var auth = require('../../services/auth');

var React = require('react'),
    Router = require('react-router'),
    { Route, RouteHandler, Link } = Router;

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
    window.location.href = '/login'; //relative to domain
  },
  render: function () {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout;
