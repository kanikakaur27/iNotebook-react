const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchUser');
const JWT_SECRET = 'kkttyl'



// ROUTE 1: Create a User using: POST "/api/auth/createuser". Doesn't require Auth. No login required.
router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 })
    ],async(req, res)=>{
      let success=false;
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();

    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    try {
      // check whether user with the same email exists already
      
      let user = await User.findOne({email: req.body.email})
      if(user){
          return res.status(400).json({success,error: "Sorry a user with this email already exists"})
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create a new user
      user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass
        })
        
      //   .then(user => res.json(user))
      //   .catch(err=>{console.log(err)
      //   res.json({error: 'Please enter a unique value for email', message: err.message})});
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data,  JWT_SECRET);
      success=true;
      res.json({success,authtoken})
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required.
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
  ],async(req, res)=>{
    let success=false;

    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success,error: "Please enter valid credentials"})
      }

      const passwordCompare = await bcrypt.compare(password, user.password)

      if(!passwordCompare){
        return res.status(400).json({success,error: "Please enter valid credentials"})
      }

      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data,  JWT_SECRET);
      success=true;
      res.json({success,authtoken})
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error")
    }

  })

  // ROUTE 3: Get logged in User details using: POST "/api/auth/getuser". Login required.
  router.post('/getuser', fetchuser, async(req, res)=>{
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router