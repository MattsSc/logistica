const dbUtils = require('../../utils/dbUtils.js');


exports.loginUser = async (user) => {
    const userLogin = await dbUtils.findUser(user);
    if(userLogin == null)
        return userLogin;
    return userLogin._id;
};

