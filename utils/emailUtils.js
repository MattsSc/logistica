const nodemailer = require('nodemailer');

const localEmail ='mscandroglio@uade.edu.ar';
exports.transporter = nodemailer.createTransport({
    host: 'mail.uade.edu.ar',
    port: 25,
    auth: {
        user: localEmail,
        pass: 'Ausonia0911'
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

exports.mandarMail = (order, estado) => {
    console.log("Se notifica al cliente " + order.cliente.email);
    this.transporter.sendMail(this.createEmail(order.cliente.email, estado), function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}