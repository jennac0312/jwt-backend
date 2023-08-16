// check if there is a token then verify said token

const jwt = require("jsonwebtoken")

// middleware funciton is a function that has access to the req, res cycle object. next is used to pass on to the next portion of middleware

module.exports = function( req, res, next ){
    // get token from header
    const token = req.header( 'x-auth-token' ) // header is an object so have to specify what part to get

    // check if no token
    if( !token ){
        return res.status(401).json( { msg: "No token, Auth denied" } )
        // 401 - authorization denied
        // when using this middleware we are checking whether or not someone has authorizaiton
    }

    //  verify token is exists
    try {
        // decode our json web token so can read the data inside it (inside the payload)
        const decoded = jwt.verify( token, process.env.jwtSecret )
        // decode, using token and out secret password, going to verify the token

        req.user = decoded.user

        next() // to move to next step of middleware and/or route

    } catch (error) {
        res.stats(401).json( { msg: "Token is not valid" } )
    }
}

