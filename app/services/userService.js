const dbUtils = require('../../utils/dbUtils.js');


exports.loginUser = async (user) => {
    const userLogin = await dbUtils.findUser(user);
    return userLogin._id;
};

