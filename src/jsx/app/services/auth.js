var auth = {
  signup: function (email, pass, firstname, lastname, type, cb) {
    cb = arguments[arguments.length - 1];
    $.post('api/signup', {email: email, password: pass, firstname: firstname, lastname: lastname, typeUser:type}, function (result){
    }.bind(this))
    .done(function (result) {
      if (result.error != undefined)
      {
        if (cb) cb(false, result.error);
      }
      else {
          localStorage.token = result.token;
          localStorage.user = JSON.stringify(result.user);
          if (cb) cb(true, {});
          this.onChange(true);
        }
      }.bind(this))
      .fail(function(error) {
           if (cb) cb(false, error);
           this.onChange(false);
        }.bind(this));
  },
  login: function (email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true, {});
      this.onChange(true);
      return;
    }
    $.post( "/api/login/", {email: email, password: pass}, function(result) {
     }.bind(this))
     .done(function(result) {
       if (result.error != undefined)
       {
         if (cb) cb(false, result.error);
       }
       else
       {
        localStorage.token = result.token;
        localStorage.user = JSON.stringify(result.user);
        if (cb) cb(true, {});
        this.onChange(true);
      }
     }.bind(this))
     .fail(function(error) {
        if (cb) cb(false, error);
        this.onChange(false);
     }.bind(this));
  },
  getUser: function () {
    return JSON.parse(localStorage.user);
  },
  getToken: function () {
    return localStorage.token;
  },
  logout: function (cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },
  loggedIn: function () {
    return !!localStorage.token;
  },
  onChange: function () {}
};

module.exports = auth;
