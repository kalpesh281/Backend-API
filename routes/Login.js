const express = require('express')
const router = express.Router();
const User = require('../modules/userSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const SECRET_KEY = crypto.randomBytes(32).toString('hex')

router.post('/login', async (req, res) => {

const {email,password}=req.body

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" })
        }


        const token = jwt.sign(
            { id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' }
        )

        res.status(200).json({
            message: "Login User Successfully",
            token: `Bearer ${token}`
        })
    } catch (error) {
        console.error("Error occurred:", error.message); // Log detailed error
        res.status(500).json({ message: 'Server error' });
    }
})



module.exports = router;