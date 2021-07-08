const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");
 // bring in the middle ware for our jwttoken function

const accountSid = process.env.TWILIO_ACCOUNT_SID;
// our env acct number
const authToken = process.env.TWILIO_AUTH_TOKEN;
// our api key in our env file
const client = require("twilio")(accountSid, authToken);
// brings in twilio, but also verifys our acct # and api key

router.post("/send-sms", jwtMiddleware, function (req, res) {
  // a post request, we are bringing in our middleware function to verify if our token matches in order to make the request. If there is no err in jwtmiddleware, the next () will run the below code.
  client.messages // idk hehehe
    .create({
      body: req.body.message,
      from: "+12402215541", //if you paid for the api service it will be your real number
      to: "+19176261808", //and you can send real text message to your friends, family, and strangers... but dont do that
    })
    .then((message) => res.json(message))
    .catch((error) => {
      console.log(error.message);

      res.status(error.status).json({ message: error.message, error });
    });
});

module.exports = router;
