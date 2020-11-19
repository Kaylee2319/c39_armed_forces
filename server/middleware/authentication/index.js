const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../../db/models/user');
const ExtractJwt = require('passport-jwt').ExtractJwt;

let jwtOptions = {
  jwtFromRequest: (req) => {
    return req?.cookies?.jwt || ExtractJwt.fromAuthHeaderWithScheme('jwt')(req);
  },
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done(null, false, { message: 'jwt expired' });
    }
    let { iat, exp, ...userData } = jwtPayload;
    userData = await User.findById(userData.user_id);
    return done(null, userData);
  })
);

module.exports = passport;