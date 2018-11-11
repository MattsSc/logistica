const userService = require('../app/services/userService.js');
const User = require('../app/models/user');

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const expect = require('chai').expect;
const mock = require('simple-mock');
const fs = require('fs');

let mongoServer;

async function asyncForEach(array, callback) {
    for(let index = 0; index < array.length; index ++){
        await callback(array[index], index, array);
    }
}

async function saveUsers(){
    let users = JSON.parse(fs.readFileSync('./test/resources/users.json', 'utf8'));
    await asyncForEach(users, async (user) => {
        const us = new User(user);
        await us.save();
    });
}


describe('Orders', function() {
    this.timeout(60000);

    before((done) => {
        mongoServer = new MongoMemoryServer();
        mongoServer.getConnectionString().then((mongoUri) => {
            return mongoose.connect(mongoUri, {}, (err) => {
                if (err) done(err);
            });
        }).then(() => {
            saveUsers().then(() => done());
            //done();
        });
    });

    after(() => {
        User.remove({}, function (err) {
            console.log('collection removed');
            mongoose.disconnect();
            mongoServer.stop();
        });
    });

    describe('Login user', function() {
        it('Login user exists', async function() {

            const loginCred = {
                email: 'mati@gmail.com',
                password: '12345'
            };

            const result = await userService.loginUser(loginCred);

            expect(result).to.be.not.null;

        });

        it('Login user doesnt exist', async function() {

            const loginCred = {
                email: 'falso@gmail.com',
                password: 'aaa'
            };

            const result = await userService.loginUser(loginCred);

            expect(result).to.be.null;

        });
    });

});
