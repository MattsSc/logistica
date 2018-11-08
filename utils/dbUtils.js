const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

// Connection URL
const mongoUrl = 'mongodb://mongo:pass123@ds151602.mlab.com:51602/logistica';

exports.connectDb = function(){
    const connection = mongoose.createConnection(mongoUrl);
    mongoose.connect(mongoUrl, function(err) {
        if (err) throw err;
        console.log("Connected successfully to DB");
    });
    autoIncrement.initialize(connection);
};
