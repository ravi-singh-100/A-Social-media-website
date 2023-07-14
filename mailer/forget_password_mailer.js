const nodeMailer=require('../config/nodemailer');
const jwt=require('jsonwebtoken');

exports.forgetEmail=(email)=>{
  let htmlString=nodeMailer.renderTemplate({email:email},'/password/reset_password.ejs')
    console.log('inside forget password mailer',email.email);
  nodeMailer.transporter.sendMail({
    from:'ravibajethapractice@gmail.com',
    to:email.email,
    // to:'singhravi.rs11@gmail.com',

    subject:'password reset',
    html:htmlString
  },(error,info)=>{
    if(error){console.log('Error in sending the mail',error);return;}
    // console.log('mail deliverd',info);
    console.log('mail delivered')
    return;
  })
}