import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Thank you for registering.</p>
          <p>Please click the button below to verify your email address:</p>

          <a href="${verificationLink}"
             style="
               display:inline-block;
               padding:12px 24px;
               background:#007bff;
               color:#fff;
               text-decoration:none;
               border-radius:5px;
             ">
             Verify Email
          </a>

          <p style="margin-top:20px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>

          <p>${verificationLink}</p>

          <p>Thanks,<br/>Support Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("Email Sent Successfully");
    console.log(info.response);

    return true;
  } catch (error) {
    console.error("Email Sending Error:", error);
    return false;
  }
};

//wrking fine as on 13.06.2026 --- rollback to below version of entire code if required

{
  /*
import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
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
    subject: "Email Verification",

    //This should be the text of email body
    text: `Hi! There you have recently visited
   our website and entered your email.
   Please follow the given link to verify your email
   ${process.env.CLIENT_URL}/verify/${token}
   Thanks`,
  };
  //    http://localhost:5173/verify/${token}

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("Email Sent Successfully");
    console.log(info);
  });
};
*/
}
