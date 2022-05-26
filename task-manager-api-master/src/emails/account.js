const sgMail = require('@sendgrid/mail')

const sendGridAPI = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPI)

const from='task.manager.utkarsh@gmail.com'



const sendWelcomeEmail=(email, name)=>{ 
      sgMail.send({
        to : email,
        from,
        subject : 'Thanks for joining!',
        text : `Welcome to the app, ${name}. Let me know how you get along or if you need any help.`
      })
}

const sendCancelationEmail=(email, name)=>{ 
  sgMail.send({
    to : email,
    from,
    subject : 'Cancelation Email: Sorry to hear you go.',
    text : `We respect your choice, ${name}. Let me know the reason for your cancelation so that we can improve when you return back.`
  })
}

module.exports={
  sendWelcomeEmail,
  sendCancelationEmail

}