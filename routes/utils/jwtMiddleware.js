const jwt = require("jsonwebtoken"); // brings in our webtoken npm 

async function checkJwtToken(req, res, next) {
  try {
    if (req.headers && req.headers.authorization) { 
      // console.log(req.headers);
      // console.log(req.headers.authorization);
      let jwtToken = req.headers.authorization.slice(7); // bearer_ (7 char) in our req.headers.auth we have returned our token. So we slice the first 7 letters to get only our jwttoken.

      let decodedJwt = jwt.verify(jwtToken, process.env.PRIVATE_JWT_KEY); // now for the private jwt key, we are matching our private key to the webbrowser if we are logged in.
      console.log(decodedJwt);

      next(); // if there is no error, we go to the twilioRouter and create the post request.

      //console.log(decodedJwt);
      //console.log(decodedJwt.message);
      //console.log(decodedJwt.status);
    } else {
      throw { message: "You Don't have permission! ", statusCode: 500 }; // if you have a throw, it will automatically jump to the catch block below. This is if you are not logged in and dont have a jwtToken.
    }
  } catch (e) {
    return next(e); // we can use our next(e) function to avoid using all the code below. 
    console.log(e.message);
    console.log(e.code);
    res.status(e.statusCode).json({ message: e.message, error: e });
  }
}

module.exports = checkJwtToken;
