const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('./../models/user');
const Key = require('../util/api key');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: Key
    }
}));

exports.getLogin = (req, res, next) => {
    let msg = req.flash('error');
    if (msg.length > 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: msg
    });
};

exports.getSignup = (req, res, next) => {
    let msg = req.flash('error');
    if (msg.length > 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: msg
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User
        .findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        req.flash('error', 'Invalid email or password');
                        return res.redirect('/login');
                    }
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.userId = user.id;
                    req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    });
                })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg
        });
    }
    return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
            });
            return user.save();
        })
        .then(() => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'shop@nodejs.com',
                subject: 'Signup Successful',
                html: '<h1>You have signed up successfully</h1>'
            })
                .catch(err => console.log(err));
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let msg = req.flash('error');
    if (msg.length > 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: msg
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (!user) {
                    req.flash('error', 'Email not registered');
                    res.redirect('/reset');
                }
                user.resetToken = token;
                return user.save();
            })
            .then(() => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@nodejs.com',
                    subject: 'Password reset link',
                    html: `
                        <p>A password reset link was requested for this email</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to continue</p>
                        <p>This link is only valid for one hour</p>
                    `
                })
            })
            .catch(err => console.log(err));
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ where: { resetToken: token } })
        .then(user => {
            let msg = req.flash('error');
            if (msg.length > 0) {
                msg = msg[0];
            }
            else {
                msg = null;
            }
            res.render('auth/reset-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: msg,
                userId: user.id,
                token: token
            });
        })
        .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userID;
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
        req.flash('error', 'Password do not match');
        return res.redirect(`/reset/${token}`);
    }
    console.log(userId);
    User.findOne({ where: { resetToken: token, id: userId } })
        .then(user => {
            bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = null;
                    return user.save();
                })
                .then(() => {
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};