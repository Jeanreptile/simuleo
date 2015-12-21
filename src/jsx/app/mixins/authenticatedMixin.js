var LoginStore = require('../stores/loginStore');

var AuthenticatedMixin = {
  statics: {
  willTransitionTo: function(transition) {
    if (!LoginStore.isLoggedIn()) {
      transition.redirect('/login', {}, {'nextPath' : transition.path});
    }
  }},
  _getLoginState: function() {
     return {
       userLoggedIn: LoginStore.isLoggedIn(),
       user: LoginStore.user,
       jwt: LoginStore.jwt
     };
   },

   componentDidMount: function() {
     this.changeListener = this._onChange.bind(this);
     LoginStore.addChangeListener(this.changeListener);
   },

   _onChange: function() {
     this.setState(this._getLoginState());
   },

   componentWillUnmount: function() {
     LoginStore.removeChangeListener(this.changeListener);
   },

   getDefaultProps: function() {
    return { user: "Toto !" };
    }
};

module.exports = AuthenticatedMixin;
