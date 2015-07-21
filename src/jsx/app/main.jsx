
var Fluxxor = require('../../../node_modules/fluxxor'),
    actions = require('./actions/actions');


// Load stores

var ClasseStore = require('./stores/classeStore'),
    SimulConfigStore = require('./stores/simulConfigStore'),
    LoginStore = require('./stores/loginStore'),
    UserStore = require('./stores/userStore'),
    StudentStore = require('./stores/studentStore');

var stores = {
  SimulConfigStore: new SimulConfigStore(),
  ClasseStore: new ClasseStore(),
  LoginStore: new LoginStore(),
  StudentStore: new StudentStore(),
  UserStore: new UserStore(),
  };

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;


flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

/* Initialize Locales */
l20n.initializeLocales('app', {
  'locales': ['en-US'],
  'default': 'en-US'
});

/* Initializing touch events */
React.initializeTouchEvents(true);

require('./preloader.jsx');

var routes = require('./routes.jsx');

Pace.once('hide', function() {
  $('#pace-loader').removeClass('pace-big').addClass('pace-small');
});

var InitializeRouter = function(View) {
  // cleanup
  if(window.Rubix) window.Rubix.Cleanup();
  Pace.restart();
  if(window.hasOwnProperty('ga') && typeof window.ga === 'function') {
    window.ga('send', 'pageview', {
     'page': window.location.pathname + window.location.search  + window.location.hash
    });
  }

  React.render(<View flux={flux} />, document.getElementById('app-container'), function() {
    // l20n initialized only after everything is rendered/updated

    l20n.ready();
    setTimeout(function() {
      $('body').removeClass('fade-out');
    }, 500);
  });
};

if(Modernizr.history)
  ReactRouter.run(routes, ReactRouter.HistoryLocation, InitializeRouter);
else
  ReactRouter.run(routes, InitializeRouter);
