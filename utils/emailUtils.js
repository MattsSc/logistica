const nodemailer = require('nodemailer');

const localEmail ='mscandroglio@uade.edu.ar';
exports.transporter = nodemailer.createTransport({
    host: 'mail.uade.edu.ar',
    port: 25,
    auth: {
        user: localEmail,
        pass: 'Ausonia0205'
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