const ftp = require("basic-ftp");
const fs = require("fs");
const Readable = require('stream').Readable;
const moment = require('moment-timezone');


const ftpHost = "ftp.drivehq.com";
const ftpUser= "sgesnouin";
const ftpPassword="Martes38*t";

const ftpHostDelivered5 = "ftp.drivehq.com";
const ftpUserDelivered5 = "sgesnouin";
const ftpPasswordDelivered5 ="Martes38*t";


exports.saveFile = async (body) => {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    const fileName = 'delivered-' + moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD')  + '.json';
    try {
        await client.access({
            host: ftpHostDelivered5,
            user: ftpUserDelivered5,
            password: ftpPasswordDelivered5,
            secure: true
        });
        await client.upload(createStreamToSave(body), '/' + fileName)
    }
    catch(err) {
        console.log(err)
    }
    client.close()
};


exports.getFile = async (prefix) => {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    const fileName = prefix + '-' + moment().tz('America/Argentina/Buenos_Aires').format('DDMMYYYY')  + '.json';
    console.log('getting file ' + fileName);
    try {
        await client.access({
            host: ftpHost,
            user: ftpUser,
            password: ftpPassword,
            secure: true
        });
        await client.download(await fs.createWriteStream('files/' + prefix + '.json',{flags: 'w'}), '/tpo/' + fileName,0)
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