const dbUtils = require('../../utils/dbUtils.js');

exports.createUser = async (user) => {
    const userExist = await dbUtils.findUser(user);
    if(userExist == null)
        return await dbUtils.createUser(user);
    else
        throw new Error("400");
};

exports.loginUser = async (loginCred) => {
    const userLogin = await dbUtils.findUser(loginCred);
    if(userLogin == null)
        return userLogin;
    return userLogin._id;
};

