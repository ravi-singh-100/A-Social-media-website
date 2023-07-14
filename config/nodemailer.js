const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')


//transporter defines how the email communication is going to take place
 //transporter is an object that is attachedd to the nodemailer
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ravibajethapractice',
        pass: 'llwmvdtblwcqhbsp'
    }
});

//realtivePaht is the path from where this fucntion is being called
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
         if (err){console.log('error in rendering template'); return}
         
         mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}