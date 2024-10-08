const express = require('express');
const router = express.Router();
const User = require('../modules/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
StatusCodes = require('http-status-codes')

const REFRESH_TOKEN_SECRET = '123456789'
const ACCESS_TOKEN_SECRET = '1234567890';
const refreshTokens = [];

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }


        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        refreshTokens.push(refreshToken);

        console.log(refreshTokens)
        res.status(StatusCodes.OK).json({
            message: "User logged in successfully",
            RefreshToken: `Bearer ${refreshToken}`
        });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/token', (req, res) => {
    try {
        const { authorization } = req.headers
        console.log(authorization)
        if (!authorization) {
            return res.status(401).json({ message: "Authorization header is required" });
        }

        const refreshToken = authorization.split('Bearer ')[1]
        console.log(refreshToken, 'Refresh Token');
        refreshTokens.push(refreshToken);
        console.log(refreshTokens)
        console.log(refreshTokens.includes(refreshToken))
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
            console.log('I am here')
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }


            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );

            res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
