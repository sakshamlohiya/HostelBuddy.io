var passport = require('passport');
var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});

// passport.use('local.signup',new LocalStrategy({
//     usernameField:'email',
//     passwordField:'password',
//     passReqToCallback:true
// },function(req,email,password,done){
//     User.findOne({'CollegeEmail':email},function(err,user){
//         if(err){
//             return done(err)
//         }
//         if(user){
//             return done(null,false,{'message':'Email already in use'})
//         }
//         var newUser = new User();
//         newUser.CollegeEmail = email;
//         newUser.Password = newUser.encryptPassword(password);
//         newUser.save(function(err,result){
//             if(err){
//                 return done(err)
//             }
//             return done(null,newUser)
//         })
//     })

// }))

passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    User.findOne({CollegeEmail:email},function(err,user){
        if(err){
            return done(err)
            console.log(1)
        }
        if(!user){
            return done(null,false,{'message':'No user found'})
            console.log(2)
        }
        if(!user.validPassword(password)){
            console.log(3)
            return done(null,false,{'message':"Wrong Password "})
        }
        return done(null,user)
    })

}))