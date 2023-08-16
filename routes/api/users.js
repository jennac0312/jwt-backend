const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs") // password encryption
const jwt = require("jsonwebtoken") // create, sign and send webtokens
const { check, validationResult } = require("express-validator")


// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.get('/', (req, res) => res.send('User Route'));

// @route:   POST api/users
// @desc:    Register User
// @access:  Public
router.post('/', [] , async ( req, res ) => {
    // validation happens after route, before callback
        // array thats hold express validation "middleware"

})

module.exports = router;
