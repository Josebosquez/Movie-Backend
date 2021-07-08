const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // rate limit doesnt allow the user to make a certain amount of api requests after the limit has been reached.

const app = express();

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass"); // this is our basic error handling class. makes it look pretty for us so we know what we are receiving if theres an error.
const errorController = require("./routes/utils/errorController"); // handles how we are setting up our errs.
const userRouter = require("./routes/user/userRouter");
const twilioRouter = require("./routes/twilio/twilioRouter"); // for the phone msg set up
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

const limiter = rateLimit({ // this limits our api requests if there are issues with paths or just wrong info being submitted.
  max: 20, // 20 max attempts
  windowMs: 1 * 60 * 1000, //this is in millie second -- this is the math to determine how long of a wait you have to have in order to try again.
  message:
    "Too many requests from this IP, please try again or contact support", // err msg when you keep fucking up
});

app.use("/api", limiter); // uses limiter from above.

app.use(express.json());
//parsing form data/incoming data
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/twilio", twilioRouter);

app.all("*", function (req, res, next) { // a safety net that catches any url errs if the path doesnt exist.
  next(
    new ErrorMessageHandlerClass(
      `Cannot find ${req.originalUrl} on this server! Check your URL`,
      404
    )
  );
});

app.use(errorController); // catches errs if the path does exist. this goes after the safety net.

module.exports = app;
