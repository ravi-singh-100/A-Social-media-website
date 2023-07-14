const nodeMailer=require('../config/nodemailer');
//this is another way of exporting a method
exports.newComment=(comment)=>{
// console.log('inside new comment -mailer ',comment.user.email)
console.log('Inside new comment mailer')
let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
nodeMailer.transporter.sendMail({
    from:'ravibajethapractice@gmail.com',
    to:comment.user.email,
  
    subject:'new comment published',
    html:htmlString
},(error,info)=>{
if(error){console.log('error in sending mail',error);return;}
// console.log('mail delivered',info)
console.log('mail delivered')
return;

}
    )
}
