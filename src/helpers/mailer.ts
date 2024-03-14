import nodemailer from 'nodemailer'
import User from '@/models/userModel'
import bcrypt from 'bcryptjs'

export const sendEmail = async({email , emailType , userId} : any) => {
  try {
    // CREATING HASHED TOKEN
    const hashedToken = await bcrypt.hash(userId.toString() ,10)
    if(emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId , 
        {verifyToken : hashedToken , verifyTokenExpiry : Date.now() + 3600000} ,
        {new : true , runValidators : true})
      } else if (emailType === 'RESET') {
        await User.findByIdAndUpdate(userId , 
          {forgotPasswordToken : hashedToken , forgotPasswordTokenExpiry : Date.now() + 3600000} ,
          {new : true , runValidators : true})
    }
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "86fc3cab2616db",
        pass: "7c6b3e2bdce0c5"
      }
    });

    const mailOption = {
      from : 'backend@gmail.com',
      to : email,
      subject : emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${process.env.DOMAIN}/${emailType === 'VERIFY'? 'verifyemail' : 'resetpassword'}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/${emailType === 'VERIFY'? 'verifyemail' : 'resetpassword'}?token=${hashedToken}
            </p>`
    }
    const mailresponse = await transport.sendMail(mailOption);
    return mailresponse
  } catch (error :any) {
    throw new Error(error.message)
  }
}