/* ERROR PAGES */
var notfound = require('./routes/notfound.jsx');

/* APP PAGES */
var blank = require('./routes/app/blank.jsx');
var classes = require('./routes/app/classes.jsx');
var simul_negociation = require('./routes/app/simul_negociation.jsx');
var simul_negociation_config = require('./routes/app/simul_negociation_config.jsx');
var simulations = require('./routes/app/simulations.jsx');
var signup = require('./routes/app/signup.jsx');
var login = require('./routes/app/login.jsx');
var logout = require('./routes/app/logout.jsx');


/* ROUTES */
module.exports = (
  <Route handler={ReactRouter.RouteHandler}>
    <DefaultRoute handler={blank} />
    <Route path='/' handler={blank} />
    <Route path='/classes' handler={classes} />
    <Route path='/simul_negociation/config' handler={simul_negociation_config} />
    <Route path='/simul_negociation/*/*' handler={simul_negociation} />
    <Route path='/simulations' handler={simulations} />
    <Route path='/signup' handler={signup} />
    <Route path='/login' handler={login} />
    <Route path='/logout' handler={logout} />
    <NotFoundRoute handler={notfound} />
  </Route>
);
