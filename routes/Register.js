const express = require('express')
const router = express.Router();
const User = require('../modules/userSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const crypto = require('crypto')

// function generateKey() {
//     const secretKey = crypto.randomBytes(32).toString('hex'); // 256-bit in hex format (64 chars)
//     return secretKey;
// }

// // const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' })
// const SECRET_KEY = generateKey()
const SALT_ROUND = 10
router.post('/register', async (req, res) => {



    try {

        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) { return res.status(400).json({ message: err.message }); }
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUND)

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        // const newUser = await user.save();
        res.status(201).json(newUser)
        console.log(newUser)

    } catch (err) {
        console.error("Error occurred:", err.message); // Logs detailed error to the server
        res.status(500).json({ message: 'Server error' });


    }

});


module.exports = router;