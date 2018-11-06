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

exports.getUsers = async () => {
    return await User.find();
};

exports.updateUser = async (userId, user) => {
    console.log(JSON.stringify(user));
    console.log("Usuario a editar " + userId);
    delete user._id;
    return await User.findByIdAndUpdate(userId, user,{new: true});
};

exports.loginUser = async (loginCred) => {
    const userLogin =  await User.findOne(loginCred);
    return userLogin ? userLogin._id : userLogin;
};

