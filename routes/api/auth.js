const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth') // bring in auth middleware

const bcrypt = require('bcryptjs')
const { check, valdiationResult } = require("express-validator")
const jwt = require("jsonwebtoken");
const User = require('../../models/User');

// @route:   GET api/auth
// @desc:    Test route
// @access:  Public
// router.get('/', (req, res) => res.send('Auth Route'));

// @route:   GET api/auth
// @desc:    Get User data
// @access:  Public
router.get('/', auth, async ( req, res ) => {
    // every time this route is run it'll run auth as middleware

    try {
        const user = await User.findById( req.user.id ) // in our middleware we set the req.user to our decoded.user... our decoded payload has a uder id and a user name
    } catch (error) {
        console.error( error.message )
        res.status(500).send("Server Error")
        // 500- server error
    }

})

module.exports = router;
