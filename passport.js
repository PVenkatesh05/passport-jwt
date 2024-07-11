const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('./database')
const passport = require('passport')

const opts ={}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "hdagf";

passport.use(new JwtStrategy(opts,function(jwt_payload, done) {
    console.log(jwt_payload)
    userModel.findOne({"_id": jwt_payload.id}).then((user)=>{
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
    .catch(error =>{return error});
}));