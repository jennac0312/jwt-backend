const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth') // bring in auth middleware

// @route:   GET api/auth
// @desc:    Test route
// @access:  Public
router.get('/', (req, res) => res.send('Auth Route'));

// @route:   GET api/auth
// @desc:    Get User data
// @access:  Public
router.get('/', async ( req, res ) => {

})

module.exports = router;
