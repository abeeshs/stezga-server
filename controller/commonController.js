import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import urid from 'urid';

export const emailOtpSender = async (email) => {
  try {
    //Creating random otp number
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();

    //configuring nodemailer sender data
    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(config);

    // Using mailgen creating a better mail format
    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Stezga',
        link: 'https://mailgen.js/',
      },
    });

    const response = {
      body: {
        intro: `Enter ${OTP} to varify your email address and sign in to your account`,
      },
    };

    const mail = MailGenerator.generate(response);

    const message = {
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: 'OTP for login', // Subject line
      html: mail,
    };

    // sending mail
    const result = await transporter.sendMail(message);
    console.log({ result });
    return { OTP, result };
  } catch (err) {
    console.log(err);
  }
};

export const emailInviteSender = async (email) => {
  try {
    //Creating random otp number
    const refId = urid(10, 'ALPHANUM');

    //configuring nodemailer sender data
    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(config);

    // Using mailgen creating a better mail format
    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Stezga',
        link: 'https://mailgen.js/',
      },
    });

    const response = {
      body: {
        intro: `Enter ${refId} to varify your email address and sign in to your account`,
		action: {
            instructions: 'To get started with Stezga, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: 'http://localhost:3000/users/user-login'
            }
        },
      },
    };

    const mail = MailGenerator.generate(response);

    const message = {
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: 'Welcome to Stezga', // Subject line
      html: mail,
    };

    // sending mail
    const result = await transporter.sendMail(message);
    console.log({ result });
    return { refId, result };
  } catch (err) {
    console.log(err);
  }
};
