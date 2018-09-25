const nodemailer = require('nodemailer');

const localEmail ='logis-uade@outlook.com.ar';
exports.transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: localEmail,
        pass: 'logistica123'
    }
});


exports.createEmail = (email,status) => {
    return  {
        from: localEmail,
        to: email,
        subject: 'Logistica - Sobre su pedido',
        text: 'Nos informan que su pedido esta ' + (status === 'ON_WAY' ? 'en camino' : 'entregado') + '. Que tenga un buen dia y gracias por confiar en nosotros'
    };
};