const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth') // bring in auth middleware

const bcrypt = require('bcryptjs')
const { check, valdiationResult, validationResult } = require("express-validator")
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

        res.json(user)

    } catch (error) {
        console.error( error.message )
        res.status(500).send("Server Error")
        // 500- server error
    }

    // TESTING-
        // test by making get req to /api/auth
        // add header "x-auth-token" : token
        // responds with user object
})

// @route:   POST api/auth bc getting new json webtoken
// @desc:    Log in and authenticate user
// @access:  Public
router.post( '/', [
    // dont ususally send to frontend.. dont send errors to front end

    check( 'email', 'Please include a valid email' ).isEmail(),
    check( 'password', 'Password Required' ).isLength( { min: 6 } ).not().isEmpty()

], async ( req, res ) => {

    const errors = validationResult( req ) // checking for validation errors

    //  if errors exist
    if ( !errors.isEmpty() ){
        return res.status(400).json( { msg: errors.array() } )
    }

    // test
    // return res.send( req.body )
        // TEST by 
            // post request to /api/auth headers: nothing extra
            //  body -> json { "email": "", "password", "" }
            // should return user from body ( only email and password)

    // desctruture
    const { email, password } = req.body
    try {
        // search database for user specific email
        let user = await User.findOne( { email } )

        // if user exists send error message
        if( !user ){
            res.status(400).json( { errors: [{ msg: "Invalid Credentials" }] } ) // dont tell front end any specifics
        }

        const isMatch = await bcrypt.compare( password, user.password )
        //  takes password we're given compared to user.password form datatbase... return boolean

        if( !isMatch ){
            return res.status(400).json( { errors: [{ msg: "Invalid Credentials" }] } ) // be generic with errors
        }

        // if gets pass everyting above lol, create webtoken, and payload
        //Create a JWT
      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
        
    } catch (error) {
        console.error( error.message )
        res.status(500).send( "Server Error" )
        //  500 - server error
    }
})

module.exports = router; //exports all router.'s