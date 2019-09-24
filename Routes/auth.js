const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .custom((value, { req }) => {
                return User
                    .findOne({ where: { email: value } })
                        .then(user => {
                            if (user) {
                                return Promise.reject('Email already registered');
                            }
                        });
            }),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Please enter a password at least 5 characters long')
            .isAlphanumeric()
            .withMessage('The password can only contain letters and numbers'),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            })
    ],
    authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;