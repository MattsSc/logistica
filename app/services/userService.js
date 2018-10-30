const User = require('../models/user');

exports.createUser = async (user) => {
    const userM = new User(user);
    const userExist = await User.findOne({email: userM.email});
    if(userExist === null)
        return await userM.save();
    else
        throw new Error("400");
};

exports.loginUser = async (loginCred) => {
    const userLogin = User.findOne(loginCred);
    return userLogin ? userLogin._id : userLogin;
};

