var express = require('express');
var router = express.Router();
const cors = require("../settings/cors");
const nodemailer = require('nodemailer');
const {GMAIL_USER,GMAIL_PASS } = require('../../config/mail');


router.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
  console.log("may br ptrcheck");
});

router.post('/send',cors.corsWithOptions, async (req, res, next) => {

  console.log("GMAIL_USER ", GMAIL_USER)

  console.log("req send ", req.body)

    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      }
    })
  
    // Specify what the email will look like
    const mailOpts = {
      from: 'Your sender info here', // This is ignored by Gmail
      to: GMAIL_USER,
      subject: `${req.body.object} about WS1 UTILS`,
      text: `${req.body.name} (${req.body.email}) says: ${req.body.feedback}`
    }
  
    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        res.send("Your message has not been sent")
         // Show a page indicating failure
         console.log("error " ,error)
      }
      else {
        res.send('your message has been sent') // Show a page indicating success
      }
    })
  })

  module.exports = router;