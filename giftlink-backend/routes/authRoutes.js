const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');


const logger = pino();

const JWT_SECRET = process.env.JWT_SECRET;


router.post('/login', async(req, res) =>{

    console.log('\n\n Insidee Login')
    try{
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const theUser = await collection.findOne({email: req.body.email})
        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password)
            if (!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({error: 'Wrong password'});
            }
            const userName = theUser.firstName;
            const userEmail = theUser.email;
            let payload = {
                user : { id: theUser._id.toString(),
                }
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in succesfully');
            return res.status(200).json({authtoken, userName, userEmail});
        } else {
            logger.error('User not found');
            return res.status(404).json({error: 'User not found'});
        }
    } catch (error){
        logger.error(error)
        return res.status(500).json({error: 'Internal server Error', details: error.message});
    }
});

router.post('/register', async (req, res) => {
    try {
      //Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
      const db = await connectToDatabase();
      //Access the `users` collection
      const collection = db.collection("users");
      //Check for existing email in DB
      const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email=req.body.email;
        //Save user details
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };
        //Create JWT
        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

router.put('/update', async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({errors: errors.array})
    }
    try {
        const email = req.headers.email;

        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({error: 'Email not found in the request headers'});
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({email});
        
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({error: 'User not found'});
        }

        user.firstName = req.body.name;
        user.updatedAt = new Date();

        const updatedUser = await collection.findOneAndUpdate(
            {email},
            {$set: user},
            {returnDocument: 'after'}
        );

        const payload = {
            user: {id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');
        res.json({authtoken});
    }  catch(error) {
        return res.status(500).send('Internal server error');
    }
});


module.exports = router;