require('./globals');

var fs = require('fs');
var path = require('path');
var express = require('express');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var expressBeautify = require('express-beautify')();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs')

require('dotenv').load();
var rdb = require('./lib/rethink');

var app = express();
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(expressBeautify);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var http = require('http').Server(app);



var package = require('./package.json');

var defaultAppName = process.env.APP ? process.env.APP : 'app';

var routes = require('./src/jsx/'+defaultAppName+'/routes.jsx');

var webpack_host = process.env.WHOST ? process.env.WHOST : 'localhost';
var webpack_dev_server_port = process.env.WPORT ? process.env.WPORT : 8079;

var html = fs.readFileSync(path.join(process.cwd(), 'src', 'jsx', defaultAppName, 'index.html'), {
  encoding: 'utf8'
});

var createStyleTag = function(file, media) {
  media = media || 'screen';
  return "    <link media='"+media+"' rel='stylesheet' type='text/css' href='"+file+"'>\n";
};

var stylesheets = '';
if(process.env.NODE_ENV === 'development') {
  stylesheets += createStyleTag('/css/'+defaultAppName+'/raw/{dir}/main.css', 'screen,print');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/raw/{dir}/theme.css');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/raw/{dir}/colors.css');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/raw/{dir}/font-faces.css');
  html = html.replace(new RegExp('{appscript}', 'g'), 'http://'+webpack_host+':'+webpack_dev_server_port+'/scripts/bundle.js');
} else {
  stylesheets += createStyleTag('/css/'+defaultAppName+'/blessed/{dir}/main-blessed1.css', 'screen,print');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/blessed/{dir}/main.css', 'screen,print');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/blessed/{dir}/theme.css');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/blessed/{dir}/colors-blessed1.css');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/blessed/{dir}/colors.css');
  stylesheets += createStyleTag('/css/'+defaultAppName+'/blessed/{dir}/font-faces.css');
  html = html.replace(new RegExp('{appscript}', 'g'), '/js/'+defaultAppName+'/'+defaultAppName+'.js');
}

html = html.replace(new RegExp('{app}', 'g'), defaultAppName);
html = html.replace(new RegExp('{stylesheets}', 'g'), stylesheets);
html = html.replace(new RegExp('{version}', 'g'), package.version);

var ltr = html.replace(new RegExp('{dir}', 'g'), 'ltr');
var rtl = html.replace(new RegExp('{dir}', 'g'), 'rtl');

var renderApp = function(req, res, cb) {
  var router = ReactRouter.create({
    routes: routes,
    location: req.url,
    onAbort: function(redirect) {
      cb({redirect: redirect});
    },
    onError: function(err) {
      console.log(err);
    }
  });

  router.run(function(Handler, state) {
    if(state.routes[0].name === 'not-found') {
      cb({notFound: true}, React.renderToStaticMarkup(<Handler />));
      return;
    }

    cb(null, React.renderToStaticMarkup(<Handler />));
  });
};


/** BEGIN X-EDITABLE ROUTES */

app.get('/xeditable/groups', function(req, res) {
  res.send([
    {value: 0, text: 'Guest'},
    {value: 1, text: 'Service'},
    {value: 2, text: 'Customer'},
    {value: 3, text: 'Operator'},
    {value: 4, text: 'Support'},
    {value: 5, text: 'Admin'}
  ]);
});

app.get('/xeditable/status', function(req, res) {
  res.status(500).end();
});

app.post('/xeditable/address', function(req, res) {
  res.status(200).end();
});

app.post('/dropzone/file-upload', function(req, res) {
  res.status(200).end();
});

/** END X-EDITABLE ROUTES */

app.get('/ltr', function(req, res, next) {
  res.redirect('/');
});

app.get('/rtl', function(req, res, next) {
  res.redirect('/');
});

app.get('/api/simul_negociation/:uniqueId', function(req, res, next) {
  console.log('yes !');
  rdb.simulNegociationGetInfo(req.params.uniqueId).then(function (response) {
      if(!response) {
          return res.json("nope");
      }
      return res.json(response);
  });
});

app.post('/api/simul_negociation/:uniqueId', function(req, res, next) {
  console.log("body is " + req.body.prix_acheteur);
  rdb.simulNegociationPostMontant(req.params.uniqueId, req.body.prix_acheteur).then(function (response) {
      if(!response) {
          return res.json("nope");
      }
      return res.json(response);
  });
});

app.post('/api/simul_negociation', function(req, res, next) {
  rdb.createSimulNegociation(req.body.contexte, req.body.acheteur, req.body.vendeur).then(function (response) {
      if(!response) {
          return res.json("nope");
      }
      return res.json(response);
  });
});

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isValidPassword = function(pass1, pass2){
    return bCrypt.compareSync(pass1, pass2);
}


app.post('/api/signup', function(req, res, next) {
  rdb.findUserByEmail(req.body.email).then(function (response) {
      if(response) {
          return res.json({error: "Un utilisateur existe déjà avec cet email"});
      }
      else {
        hashPass = createHash(req.body.password)
        console.log("ueaj " + req.body.typeUser)
        rdb.createUser(req.body.email, req.body.firstname, req.body.lastname, req.body.typeUser, hashPass).then(function (response)
        {
          if (!response)
          {
            return res.json({error: "Erreur en créant l'utilisateur"});
          }
          else{
            var token = jwt.sign({ email: response.email }, 'secretkeey', {expiresInMinutes: 60*12});
            return res.json({token: token, user: response});
          }
        })
      }

  });
});

app.post('/api/login', function(req, res, next) {
  var emailuser = req.body.email
  rdb.findUserByEmail(emailuser).then(function (response) {
      if(!response) {
          return res.json({error: "Aucun utilisateur avec cet email"});
      }
      if (!(isValidPassword(req.body.password, response.password)))
      {
        return res.json({error: "Mauvais mot de passe"});
      }
      var token = jwt.sign({ email: response.email }, 'secretkeey', {expiresInMinutes: 60*12});
      return res.json({token: token, user: response});
  }).catch(function (err) {
    console.log(err);
});
});


app.get('/classess/:emailProf', function(req, res, next) {
  rdb.findAllClassesByProf(req.params.emailProf).then(function (classes) {
      if(!classes) {
          var userNotFoundError = new Error('Not any classes found !');
          userNotFoundError.status = 404;
          //return next(userNotFoundError);
          return res.json("nope");
      }

      return res.json(classes);
  });
});

app.post('/api/user', function(req, res, next) {
  console.log("body is " + req.body);
  rdb.createUser(
    req.body.email,
    req.body.firstname,
    req.body.lastname,
    req.body.type,
    req.body.password)
  .then(function (response) {
    if(!response)
      return res.json("nope");
    return res.json(response);
  });
});

//app.get('/simul_negociation/:generated', function(req, res, next) {
//  return
  //return res.json({"text" : "All right, all right, we are in " + req.params.generated});
//});

/** CATCH-ALL ROUTE **/
app.get('*', function(req, res, next) {
  if(req.url === '/favicon.ico') return next();
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  var isRTL = req.cookies.rubix_dir === 'rtl' ? true : false;
  try {
    renderApp(req, res, function(err, h, token) {
      if(isRTL)
        h = rtl.replace(new RegExp('{container}', 'g'), h || '');
      else
        h = ltr.replace(new RegExp('{container}', 'g'), h || '');

      if (!err) {
        res.sendHTML(h);
      } else if (error.redirect) {
        res.redirect(error.redirect.to);
      } else if (error.notFound) {
        res.status(404).sendHTML(h);
      }
    });
  } catch(e) {
    if(isRTL)
      res.sendHTML(rtl);
    else
      res.sendHTML(ltr);
  }
});

var io = socketio.listen(http);
var server = http.listen(process.env.PORT, function() {
  try {
    process.send('CONNECTED');
  } catch(e) {}
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

process.on('uncaughtException', function(err) {
  console.log(arguments);
  process.exit(-1);
});
