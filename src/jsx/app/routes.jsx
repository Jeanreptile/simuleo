/* ERROR PAGES */
var notfound = require('./routes/notfound.jsx');

/* APP PAGES */
var blank = require('./routes/app/blank.jsx');
var classes = require('./routes/app/classes.jsx');
var simul_negociation = require('./routes/app/simul_negociation.jsx');
var simul_negociation_config = require('./routes/app/simul_negociation_config.jsx');
var simul_create = require('./routes/app/simul_create.jsx');
var simul_model = require('./routes/app/simul_model.jsx');
var simul_instance = require('./routes/app/simul_instance.jsx');
var simul_instance_groups = require('./routes/app/simul_instance_groups.jsx');
var simul_instance_dashboard = require('./routes/app/simul_instance_dashboard.jsx');
var simul_instance_dashboard_end = require('./routes/app/simul_instance_dashboard_end.jsx');
var simul_instance_student_dashboard = require('./routes/app/simul_instance_student_dashboard.jsx');
var simul_instance_student_dashboard_end = require('./routes/app/simul_instance_student_dashboard_end.jsx');
var signup = require('./routes/app/signup.jsx');
var login = require('./routes/app/login.jsx');
var logout = require('./routes/app/logout.jsx');
var classe = require('./routes/app/class.jsx');
var simul_setup = require('./routes/app/simul_setup.jsx');


/* ROUTES */
module.exports = (
  <Route handler={ReactRouter.RouteHandler}>
    <DefaultRoute handler={blank} />
    <Route path='/' handler={blank} />
    <Route name="totoClass" path='/class/:test' handler={classe} />
    <Route path='/classes' handler={classes} />
    <Route path='/simul_negociation/config' handler={simul_negociation_config} />
    <Route path='/simul_negociation/*/*' handler={simul_negociation} />
    <Route path='/simul/create' handler={simul_create} />
    <Route path='/simul_model' handler={simul_model} />
    <Route path='/simul/setup' handler={simul_setup} />
    <Route path='/simul_instance' handler={simul_instance} />
    <Route path='/simul_instance/groups' handler={simul_instance_groups} />
    <Route path='/simul_instance/dashboard' handler={simul_instance_dashboard} />
    <Route path='/simul_instance/dashboard_end' handler={simul_instance_dashboard_end} />
    <Route path='/simul_instance/student_dashboard' handler={simul_instance_student_dashboard} />
    <Route path='/simul_instance/student_dashboard_end' handler={simul_instance_student_dashboard_end} />
    <Route path='/signup' handler={signup} />
    <Route path='/login' handler={login} />
    <Route path='/logout' handler={logout} />

    <NotFoundRoute handler={notfound} />
  </Route>
);
