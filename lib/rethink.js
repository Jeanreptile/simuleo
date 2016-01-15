var dbConfig = require('../config/database');
var shortid = require('shortid');


var r = require('rethinkdbdash')({
  host: dbConfig.host,
  port: dbConfig.port,
  db: dbConfig.db
});

module.exports.findAllClassesByProf = function (emailProf) {
  return r.table('users').filter({email: emailProf}).then(function(result)
    {
      var idProf = result[0].id;
      return r.table('classes').filter({prof_id: idProf}).merge(function(classe){
        return {'students': classe.getField('students').map(function(idUser) {
          return r.db('simuleo_test').table('users').get(idUser)})}}).then(function (result)
            {
              return result;
            });
    });
  };

module.exports.createSimulNegociation = function(negoInfos) {
  var uniqueId = shortid.generate();
  return r.table('simulations').insert({uniqueId : uniqueId, acheteur : acheteur, vendeur: vendeur, contexte: contexte}).then(function (result){
    if (result.inserted = "1"){
      return {uniqueId: uniqueId};
    }
    else {
      return null;
    }
  });
};

module.exports.simulNegociationPostMontant = function(idBdd, prix_acheteur) {
  var uniqueId = idBdd;
  return r.table('simulations').filter({uniqueId : uniqueId}).update({proposition_acheteur: prix_acheteur }).then(function (result){
    if (result.replaced = "1"){
      return {uniqueId: uniqueId};
    }
    else {
      return null;
    }
  });
};

module.exports.simulNegociationGetInfo = function(idBdd) {
  var uniqueId = idBdd;
  return r.table('simulations').filter({uniqueId: uniqueId}).then(function (result){
    if (result != null){
      return result;
    }
    else {
      return null;
    }
  });
};

module.exports.createUser = function(email, firstname, lastname, type, password) {
  var uniqueId = shortid.generate();
  return r.table('users').insert({
      uniqueId : uniqueId,
      email : email,
      firstname: firstname,
      lastname: lastname,
      type: type,
      password: password
    }).then(function (result){
    if (result.inserted = "1"){
      return {uniqueId: uniqueId};
    }
    else {
      return null;
    }
  });
};

module.exports.createSimulModel = function(name, context, roles, resources, actions, endOfRoundConditions) {
  var uniqueId = shortid.generate();
  return r.table('simulationModels').insert({
    uniqueId: uniqueId,
    name: name,
    context: context,
    roles: roles,
    resources: resources,
    actions: actions,
    endOfRoundConditions: endOfRoundConditions
  }).then(function (result){
    if (result.inserted = "1"){
      return {uniqueId: uniqueId};
    }
    else {
      return null;
    }
  });
};

module.exports.findAllSimulationModels = function () {
  return r.table('simulationModels').without('id').then(function (result) {
    if (result != null) {
      //console.log("result:" + JSON.stringify(result));
      return result;
    }
    else {
      return null;
    }
  });
};

module.exports.findSimulationModelByUniqueId = function(idBdd) {
  var uniqueId = idBdd;
  return r.table('simulationModels').filter({uniqueId: uniqueId}).then(function (result){
    if (result != null && result[0] != null) {
      return result[0];
    }
    else {
      return null;
    }
  });
};

module.exports.findUserByEmail = function(email) {
  return r.table('users').filter({email: email}).without('id').then(function (result){
    if (result != null && result[0] != null){
      return result[0];
    }
    else {
      return null;
    }
  });
};

module.exports.findUserById = function(id) {
  return r.table('users').get(id).then(function (result){
    if (result != null && result[0] != null){
      return result[0];
    }
    else {
      return null;
    }
  });
};
