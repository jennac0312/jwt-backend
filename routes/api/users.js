const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs") // password encryption
const jwt = require("jsonwebtoken") // create, sign and send webtokens
const { check, validationResult } = require("express-validator") //express validator allows us to create custom eorror messages to display to user


// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.get('/', (req, res) => res.send('User Route'));

// @route:   POST api/users
// @desc:    Register User
// @access:  Public

// runs when someone hits enter on the form
router.post('/', [
    // validation happens after route, before callback
        // array thats hold express validation "middleware"
    check( 'name', 'Name is required' ).not().isEmpty(), // checks before gets to database.. wont save if invalid
    // we are creating custom error responses

    check( 'email', 'Please include a valid email' ).isEmail(), // checks for @ and .com 

    check( 'passowrd', 'Please enter a password with 6 or more characters' ).isLength( { min: 6 } )
] , async ( req, res ) => {
    // all data manipulation and db access happens

})

module.exports = router;
