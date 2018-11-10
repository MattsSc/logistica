const ftp = require("basic-ftp");
const fs = require("fs");
const Readable = require('stream').Readable;


const ftpHost = "ftp.drivehq.com";
const ftpUser= "sgesnouin";
const ftpPassword="Martes38*t";


exports.saveFile = async (body) => {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    const date = new Date();
    const fileName = 'delivered-' + date.toISOString().slice(0,10)  + '.json';
    try {
        await client.access({
            host: ftpHost,
            user: ftpUser,
            password: ftpPassword,
            secure: true
        });
        await client.upload(createStreamToSave(body), '/ftpseba/' + fileName)
    }
    catch(err) {
        console.log(err)
    }
    client.close()
};


function createStreamToSave(body) {
    const streamToSave = new Readable();
    streamToSave.push(JSON.stringify(body));
    streamToSave.push(null);
    return streamToSave;
}