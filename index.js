const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');

const sess = {
    secret: 'work hard',
    saveUninitialized: false,
    maxAge: 1800000
};


const dbUtils = require('./utils/dbUtils.js');

let port = process.env.PORT || 3000;
const basePath = '/logistica';

const fs = require('fs'),
    path = require('path');

// swaggerRouter configuration
const options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
});


const orderCtrl = require('./app/controllers/orderCtrl.js');
const deliveryCtrl = require('./app/controllers/deliveryCtrl.js');
const userCtrl = require('./app/controllers/userCtrl.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(session(sess));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(function errorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
});

app.use(basePath + '/order', orderCtrl);
app.use(basePath + '/delivery', deliveryCtrl);
app.use(basePath + '/user', userCtrl);
app.use('/', express.static(__dirname + '/'));


app.listen(port, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
    dbUtils.connectDb();
});
