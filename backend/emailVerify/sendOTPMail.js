// sendOTPMail.js

import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div>
          <h3>Password Reset OTP</h3>
          <p>Your OTP for password reset is:</p>
          <h2>${otp}</h2>
          <p>This OTP will expire shortly.</p>
        </div>
      `,
    });

    console.log("OTP Sent Successfully");
    console.log(info.messageId);

    return true;
  } catch (error) {
    console.error("OTP Email Error:", error);
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
