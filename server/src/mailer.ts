import { config } from "./config";
import nodemailer from "nodemailer";


//function to send email to the user
export const sendEmail = async({from, to, subject, text}) =>{
    try {
      let mailOptions = ({
        from,
        to,
        subject,
        text
    })
    //asign createTransport method in nodemailer to a variable
    //service: to determine which email platform to use
    //auth contains the senders email and password which are all saved in the .env
    const Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.APP_EMAILL_ADDRESS,
          pass: config.APP_EMAILL_PASSWORD
        },
      });
        //return the Transporter variable which has the sendMail method to send the mail
        //which is within the mailOptions
      return await Transporter.sendMail(mailOptions); 
    } catch (error) {
        console.error("Failed to send a email: ", error);
    }
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: config.APP_EMAILL_ADDRESS,
    //       pass: config.APP_EMAILL_PASSWORD
    //     }
    //   });
      
    //   let mailOptions = {
    //     from: 'elspero.project@gmail.com',
    //     to: 'darkhobbycom@gmail.com',
    //     subject: 'Cyberlive Test Mail',
    //     text: 'That was easy!'
    //   };
      
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response + ' To:' + mailOptions.to);
    //     }
    //   });
  };
  