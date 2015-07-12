var dbConfig = require('../config/database');
var shortid = require('shortid');


var r = require('rethinkdbdash')({
  host: dbConfig.host,
  port: dbConfig.port,
  db: dbConfig.db
});

module.exports.findAllClasses = function (tableName, id) {
       return r.table('classes').then(function (result) {
           return result;
       });
   };

module.exports.createSimulNegociation = function(contexte, acheteur, vendeur) {
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
