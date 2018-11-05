const User = require('../models/user');

exports.createUser = async (user) => {
    const userM = new User(user);
    const userExist = await User.findOne({email: userM.email});
    if (userExist === null) {
        console.log("Usuario creado");
        return await userM.save();
    }else
        throw new Error("400");
};

exports.getUser = async (userId) => {
    return await User.findById(userId);
};

exports.updateUser = async (user) => {
    console.log(JSON.stringify(user));
    const id = user._id;
    console.log("Usuario a editar " + id);
    return await User.findOneAndUpdate(id, user,{new: true});
};

exports.loginUser = async (loginCred) => {
    const userLogin =  await User.findOne(loginCred);
    return userLogin ? userLogin._id : userLogin;
};

