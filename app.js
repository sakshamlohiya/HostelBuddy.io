var express = require("express");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var passport = require("passport")
var session = require('express-session')
var flash = require('connect-flash')
const passwordValidator = require('password-validator')
var bcrypt = require('bcrypt-nodejs')


var event = require('./models/event')
var User = require('./models/user')
var icomplaint = require('./models/complaint')
var achiev = require('./models/achievement')

var multer = require('multer');
var fs = require('fs');
var imgModel = require('./models/gallery')
var AimgModel = require('./models/achievement')

var bodyparser = require('body-parser')

var port = 4000;

var http = require('http').Server(app);

app.use(express.static(path.join(__dirname, '/public')));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())
require('./passport')
app.use(session({ secret: 'mysupersecret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
const url = 'mongodb+srv://saksham1234:saksham1234@cluster0.i1un0.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log('Connected');

    } else {
        console.log('error' + err);
    }
})

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

app.get('/', (req, res) => {
    req.logOut(function(err){
        if(err) return next(err)
    })
    res.render('login');
})

// app.post('/login', (req, res) => {
//     var email = req.body.email;
//     var password = req.body.password;
//     User.findOne({ CollegeEmail: email, Password: password }, function (err, k) {
//         if (err) return console.log(err);
//         else {
//             if (k) {
//                 console.log(k);
//                 res.redirect('/home');
//             }
//             else {
//                 res.redirect('/')
//             }
//         }
//     })
// })

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
}))

app.get('/signin', (req, res) => {
    res.render('signin')
})

const check = new passwordValidator();

app.post('/signin', (req, res) => {
    var collegeid = req.body.emailid;
    var name = req.body.name;
    var password = req.body.password;
    var connum = req.body.connum;
    var rollno = req.body.rollno;
    var degree = req.body.degree;
    var year = req.body.year;
    var floor = req.body.floor;
    var stutdes = req.body.stutdes;

    check.has().uppercase().has().lowercase().has().digits(2);
    let errors = [];

    if (!name || !collegeid || !password || !connum || !rollno) {
        errors.push({ msg: 'All fields are compulsory' });
    }
    if (connum.length != 10) {
        errors.push({ msg: 'Wrong Phone number' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Passwords too short' });
    }
    if (check.validate(password) == false) {
        errors.push({ msg: 'Password too weak' });
    }

    if (errors.length > 0) {
        res.render('signin', { errors })
    } else {
        User.findOne({ CollegeEmail: collegeid }).then((user) => {
            if (user) {
                res.render('login')
            }
            else {
                const newUser = new User({
                    CollegeEmail: collegeid,
                    Name: name,
                    Password: password,
                    ContactNumber: connum,
                    RollNo: rollno,
                    Degree: degree,
                    Year: year,
                    ResidenceFloor: floor,
                    Description: stutdes
                })

                bcrypt.genSalt(6, (err, salt) => {
                    bcrypt.hash(newUser.Password, salt, null, (err, hash) => {
                        if (err) {
                            console.log(err)
                        } else {
                            newUser.Password = hash;
                            console.log(newUser)
                            newUser.save(function (err, newUser) {
                                if (err) console.log(err)
                            })
                            res.redirect('/');

                        }
                    })
                })

            }
        }).catch((e) => console.log(e))
    }
})
app.get('/home', isLoggedin, (req, res) => {
    res.render('home')
})
app.get('/hmate', isLoggedin, (req, res) => {
    User.find({}, function (err, mlist) {
        if (err) console.log(err)
        else {
            // console.log(mlist)
            var mlistchunks = [];
            var chunksize = 3;
            for (var i = 0; i < mlist.length; i += chunksize) {
                mlistchunks.push(mlist.slice(i, i + chunksize))

            }
            res.render('hostelmate', { k: mlistchunks })
        }
    })
})

app.post('/search', (req, res) => {
    var SO = req.body.Searchoption
    var srch = req.body.search

    if (SO == 1) {
        User.find({ Name: srch }, function (err, nlist) {
            if (err) console.log(err)
            else {
                var nlistchunks = [];
                var chunksize = 3;
                for (var i = 0; i < nlist.length; i += chunksize) {
                    nlistchunks.push(nlist.slice(i, i + chunksize))

                }
                res.render('hostelmate', { k: nlistchunks })
            }
        })
    }
    else if (SO == 2) {
        User.find({ Year: srch }, function (err, ylist) {
            if (err) console.log(err)
            else {
                var ylistchunks = [];
                var chunksize = 3;
                for (var i = 0; i < ylist.length; i += chunksize) {
                    ylistchunks.push(ylist.slice(i, i + chunksize))

                }
                res.render('hostelmate', { k: ylistchunks })
            }
        })

    }
    else if (SO == 3) {
        User.find({ Degree: srch }, function (err, dlist) {
            if (err) console.log(err)
            else {
                var dlistchunks = [];
                var chunksize = 3;
                for (var i = 0; i < dlist.length; i += chunksize) {
                    dlistchunks.push(dlist.slice(i, i + chunksize))

                }
                res.render('hostelmate', { k: dlistchunks })
            }
        })

    }
    else if (SO == 4) {
        User.find({ ResidenceFloor: srch }, function (err, flist) {
            if (err) console.log(err)
            else {
                var flistchunks = [];
                var chunksize = 3;
                for (var i = 0; i < flist.length; i += chunksize) {
                    flistchunks.push(flist.slice(i, i + chunksize))

                }
                res.render('hostelmate', { k: flistchunks })
            }
        })
    }
    else {
        User.find({}, function (err, mlist) {
            if (err) console.log(err)
            else {
                console.log(mlist)
                var mlistchunks = [];
                var chunksize = 3;
                for (var i = 0; i < mlist.length; i += chunksize) {
                    mlistchunks.push(mlist.slice(i, i + chunksize))
                }
                res.render('hostelmate', { k: mlistchunks })
            }
        })
    }
})

app.get('/map', isLoggedin, (req, res) => {
    res.render('map')
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get('/achievement', (req, res) => {
    achiev.find({}, (err, aclist) => {
        if (err) console.log(err)
        else {
            res.render('achievement',{k:aclist})

        }

    })
})

app.get('/addA', isLoggedin, (req, res) => {
    res.render('Addachievement')
})

app.get('/slider',(req,res)=>{
    res.render('slider')
})

app.post('/addA', upload.single('image'), (req, res, next) => {
    if (req.file == undefined) {
        var obj = {
            Subject: req.body.heading,
            Participants: req.body.parti,
            Des: req.body.des
        }
    } else {
        var obj = {
            Subject: req.body.heading,
            Participants: req.body.parti,
            Des: req.body.des,
            Aimg: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }
    }
    AimgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.redirect('/achievement');
        }
    });
});

app.get('/events', isLoggedin, (req, res) => {
    event.find({}, (err, eventlist) => {
        if (err) console.log(err)
        else {
            res.render('events', { k: eventlist })
        }
    })

})

app.post('/addevents', function (req, res) {
    var eventname = req.body.eventname;
    var eventdate = req.body.eventdate;
    var eventtime = req.body.eventtime;
    var eventdes = req.body.eventdes;

    const newEvent = new event({
        Eventname: eventname,
        Eventdate: eventdate,
        Eventtime: eventtime,
        Eventdes: eventdes
    })
    res.redirect('events');
    console.log(newEvent)
    newEvent.save(function (err, newEvent) {
        if (err) console.log(err)
    })


})
app.get('/addevents', isLoggedin, (req, res) => {
    res.render('Addevents')
})


app.get('/gallery', isLoggedin, (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('gallery', { items: items });
        }
    });
})

app.get('/addimage', isLoggedin, (req, res) => {
    res.render('Addimage')
})

app.post('/Addimage', upload.single('image'), (req, res, next) => {
    var obj = {
        Imagename: req.body.name,
        ImageDes: req.body.desc,
        Img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.redirect('/gallery');
        }
    });
});

app.get('/profile', isLoggedin, (req, res) => [
    res.render('Myprofile')
])

app.get('/complaint', isLoggedin, (req, res) => {
    res.render('complaint')
})

app.post('/complaint', (req, res) => {
    var cemail = req.body.cemail
    var csubject = req.body.csubject
    var cauthority = req.body.cauthority
    var cdes = req.body.cdes

    const newCom = new icomplaint({
        Email: cemail,
        Subject: csubject,
        Authorities: cauthority,
        Des: cdes
    })
    res.redirect('home')
    newCom.save(function (err, newCom) {
        if (err) console.log(err)
    })


})

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) return next(err);
    });
    res.redirect("/");
});

http.listen(port, () => {
    console.log('server had started')
})