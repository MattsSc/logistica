const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const mongoUrl = 'mongodb://mongo:pass123@ds151602.mlab.com:51602/logistica';
// Database Name
const dbName = 'logistica';
let db;

const ordersCollection = 'orders';
const movilesCollection = 'moviles';


exports.connectDb = function(){
    mongoClient.connect(mongoUrl, function(err, client) {
        if (err) throw err;
        console.log("Connected successfully to DB");
        db = client.db(dbName);
    });
};
//ORDERS
exports.findOrder = function(id) {
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.findOne({"orderId": parseInt(id)});
};

exports.getByStatus = function(status) {
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.findOne({estado: status}).toArray();
};

exports.patchOrder = function(id, query) {
    const dbCollection = db.collection(ordersCollection);
    return dbCollection.findOneAndUpdate({"orderId": parseInt(id)}, {$set: query});
};

//MOVILES
exports.getAllMoviles = function() {
    const dbCollection = db.collection(movilesCollection);
    return dbCollection.find().toArray();
};