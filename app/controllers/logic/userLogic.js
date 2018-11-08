const userService = require('../../services/userService.js');
const orderService = require('../../services/orderService.js');

exports.createUser = async function (req, res, next) {
    try{
        console.log("Crear usuario");
        await userService.createUser(req.body);
        res.sendStatus(200);
    }catch (e) {
        if(e.name === 'ValidationError' || e.message === "400")
            res.status(400).send("user not valid or already exist (" + e.message + ")");
        next(e);
    }
};

exports.getUsers = async function (req, res, next) {
    try{
        console.log("Obtener usuarios");
        validateUserAdmin(req.headers['x-user'],res);
        const result= await userService.getUsers();
        res.send(result);
    }catch (e) {
        next(e);
    }
};

exports.getUser = async function (req, res, next) {
    try{
        console.log("Obtener usuario");
        const userId = req.params.userId;
        validateUser(userId,req.headers['x-user'],res);
        const result= await userService.getUser(userId);
        res.send(result);
    }catch (e) {
        next(e);
    }
};

exports.updateUser = async function (req, res, next) {
    try{
        console.log("Editar usuario");
        const userId = req.params.userId;
        validateUser(userId, req.headers['x-user'], res);
        const result= await userService.updateUser(userId, req.body);
        res.send(result);
    }catch (e) {
        next(e);
    }
};

exports.getOrdersByUser = async function(req, res, next){
    try{
        console.log("obteniendo ordenes para usuario");
        const userId = req.params.userId;

        validateUser(userId,req.headers['x-user'],res);

        const result = await orderService.getOrders(null,userId);
        res.send(result);
    }catch (e) {
        next();
    }
};

exports.loginUser = async function (req, res, next) {
         try{
             if(req.body.email === 'admin@admin.com'){
                 const admin = '"admin"';
                 res.send(admin);
             }
             const userId = await userService.loginUser(req.body);
             if(userId == null)
                 res.status(404).send("user not found");

             console.log("agregando session");
             req.session.userId = userId;
             res.send(userId);
         }catch (e) {
             next(e);
         }
 };

function validateUser(userId, header, res){
    if(header !== 'admin' && userId !== header){
        res.status(403).send("Permission Denied");
    }
}
function validateUserAdmin(header, res){
    console.log("HEADER " + header);
    if(header !== 'admin'){
        res.status(403).send("Permission Denied");
    }
}