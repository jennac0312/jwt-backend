const express = require('express');
const router = express.Router();

const User = require('../../models/User')

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
router.post( '/', [
    // validation happens after route, before callback
        // array thats hold express validation "middleware"
    check( 'name', 'Name is required' ).not().isEmpty(), // checks before gets to database.. wont save if invalid
    // we are creating custom error responses

    check( 'email', 'Please include a valid email' ).isEmail(), // checks for @ and .com

    check( 'password', 'Please enter a password with 6 or more characters' ).isLength( { min: 6 } )
] , async ( req, res ) => {
    // all data manipulation and db access happens

    // check if there are validation errors ( using validaitonResult )
        // if errors occur... returns array[] of errors
    const errors = validationResult( req ) // look at request and give valdiation results

    // check if errors exist
    if( !errors.isEmpty() ){
        // if opposite of isEmpty
        return res.status(400).json( { errors: errors.array() } ) // returns status 400 and json with errors array in an object
        // 400 = bad request
    }

    // testing info being sent
    // return res.send( req.body ) // if no errors :P return data from body
    // TO TEST - 
        // POST request.. 
        // HEADERS - content-type: applicaiton/json
        // BODY - json {  }


    //  destructure needed information so its easier to work with

    const { name, email, password } = req.body

    try {
        // check to see if the email exists
        let user = await User.findOne( { email } )
        if( user ){
            res.status(400).json( { error: [ { msg: 'User Already Exists' } ] } )
        }

        // creating new user from User schema
        user = new User({
            name,
            email,
            password
        })

        // create a salt to salt our password
            // tell how many times to "salt" > more secure(and longer it takes)
                // recommended 10
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt) //taking our password, encypting it with 10 rounds of general salt and assigning it as the user.password
        // changed password, have new user object

        // save user to DB
        await user.save() // takes user we just created and saves to database with encrypted password

        // we want user to register and be signed in automatically

        // creat JWT payload ( {} bc we can store more info than any other datatype )
        const payload = {
            user: {
                id: user.id, // using id that database generates
                // name: user.name
                // this is what shows up in jwt.io token payload
                email: user.email
            }
        }
        // create and sign JWT token to send back to front end ( create, sign and send )
        jwt.sign(
            payload, // payload
            process.env.jwtSecret, //jwt secret from env ( can be whatver i want )
            { expiresIn: 3600 }, // timeout... in seconds (can also be a string '10h' shoutout sola)

            ( err, token ) => { //callback
                if(err) throw err; // trigger and it'll be sent (?)

                res.json({ token }) // send back to frontend can be ran thru the token debugger to see the information ?? cool jwt.io gives us content from user object 
            }

        )

    } catch (error) {
        // catch first bc its shorter
        console.error(error.message)
        res.status(500).send( "Server Error" )
        //  500 = server side error
    }
})

module.exports = router;
