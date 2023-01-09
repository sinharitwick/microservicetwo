const userModel = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const register = async (req, res) => {
    try{
        const {username, email, password} = req.body;
    
        if(!(username && email && password)){
          res.status(400).send("Enter all fields");
        }
        
        //Existing User Check
        const oldUser = await userModel.findOne({ email : email });
        
        if(oldUser){
          return res.status(409).json("User already exists");
        }
        
        //Hashed Password
        const encryptedPassword = await bcrypt.hash(password, 10);
        
        //User Creation
        const result = await userModel.create({
          email: email.toLowerCase(),
          password: encryptedPassword,
          username: username
        });
        
        //Token Generation
        const token = jwt.sign({email: result.email, id: result._id}, process.env.TOKEN_KEY);
    
        res.status(201).json({user: result, token: token});
      } catch(error){
        console.log(error);
        res.status(500).json({message: "Oops! Something went wrong"});
      }
}

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        
        const oldUser = await userModel.findOne({ email : email });
        
        if(!oldUser){
          return res.status(404).json({message: "User not found"});
        }

        const matchPassword = await bcrypt.compare(password, oldUser.password);

        if(!matchPassword){
            return res.status(400).json({message: "Invalid credentials"})
        }
        
        const token = jwt.sign({email: oldUser.email, id: oldUser._id}, process.env.TOKEN_KEY);
        res.status(201).json({user: oldUser, token: token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Oops! Something went wrong"});
    }
}

module.exports = { register, login };