
const jwksRsa = require("jwks-rsa");
const jwt = require("express-jwt");
const authConfig = require("../../config/auth_config");


if (!authConfig.domain || !authConfig.audience) {
    throw new Error(
      "Please make sure that auth_config.json is in place and populated"
    );
  }



const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),
  
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithm: ["RS256"]
  });


  module.exports = checkJwt;