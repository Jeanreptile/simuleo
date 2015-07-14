/* ERROR PAGES */
var notfound = require('./routes/notfound.jsx');

/* APP PAGES */
var blank = require('./routes/app/blank.jsx');
var classes = require('./routes/app/classes.jsx');
var simul_negociation = require('./routes/app/simul_negociation.jsx');
var simul_negociation_config = require('./routes/app/simul_negociation_config.jsx');
var simulations = require('./routes/app/simulations.jsx');
var test = require('./routes/app/gallery.jsx');
var signup = require('./routes/app/signup.jsx');


/* ROUTES */
module.exports = (
  <Route handler={ReactRouter.RouteHandler}>
    <DefaultRoute handler={blank} />
    <Route path='/' handler={blank} />
    <Route path='/classes' handler={classes} />
    <Route path='/simul_negociation/config' handler={simul_negociation_config} />
    <Route path='/simul_negociation/*/*' handler={simul_negociation} />
    <Route path='/simulations' handler={simulations} />
    <Route path='/test' handler={test} />
    <Route path='/signup' handler={signup} />
    <NotFoundRoute handler={notfound} />
  </Route>
);
