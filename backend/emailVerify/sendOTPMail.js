// sendOTPMail.js

import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h3>Password Reset OTP</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("Mail error:", error);
    throw error;
  }
};

// This code is fully okay and functional ----- replace with it whenever reqd and it will again work fine

{
  /*
import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    //it should be a string of sender/server email
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Your OTP for password reset is:<b>${otp}</b></p>`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("OTP Sent Successfully");
    console.log(info);
  });
};
*/
}
