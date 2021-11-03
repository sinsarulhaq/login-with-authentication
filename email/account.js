const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SEND_GRID)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'sinsarulhaq.pro@gmail.com',
        subject:'Happy to see you',
        text: `Welcome to the app ${name} Let me know how you get a long with the app.`
    })
}
    
const sendCancelEmail=(email,name) =>{
    sgMail.send({
        to:email,
        from:'sinsarulhaq.pro@gmail.com',
        subject:'sad to see this',
        text:`Goodbey, ${name}. I hope to see you back sometime soon.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}