const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment');
const _ = require('lodash');

// Connection URL
const mongoUrl = 'mongodb://mongo:pass123@ds151602.mlab.com:51602/logistica';
// Database Name
const dbName = 'logistica';
let db;

const ordersCollection = 'orders';
const movilesCollection = 'moviles';
const users = 'users';


exports.connectDb = function(){
    mongoClient.connect(mongoUrl, function(err, client) {
        if (err) throw err;
        console.log("Connected successfully to DB");
        db = client.db(dbName);
    });
};

//ORDERS
exports.saveOrder = function(ord){
    ord.fecha_recibido = ord.fecha_recibido || moment().format("YYYY-MM-DD HH:mm");
    ord.queja = ord.queja || false;
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.save(ord);
};

exports.findOrder = function(id) {
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.findOne({"orden_id": parseInt(id)});
};

exports.getByStatus = function(status) {
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.find({estado: status}).toArray();
};

exports.patchOrder = function(id, query) {
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.findOneAndUpdate({"orden_id": parseInt(id)}, {$set: query});
};

exports.getAllOrders = function(query) {
    const dbCollection = db.collection(ordersCollection);
    if(!_.isEmpty(query))
        return dbCollection.find(query).toArray();
    else{
        return dbCollection.find().toArray();
    }

};

//MOVILES
exports.getAllMoviles = function() {
    const dbCollection = db.collection(movilesCollection);
    return dbCollection.find().toArray();
};

//USERS
exports.createUser = function(user) {
    const dbCollection = db.collection(users);
    return dbCollection.save(user);
};

exports.findUser = function(user) {
    const dbCollection = db.collection(users);
    return dbCollection.findOne(user);
};
