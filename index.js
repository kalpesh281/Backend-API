const express = require('express');
const mongoose=require('mongoose')
require('dotenv').config()


const registerRoute=require('./routes/Register')

const app=express()

const port=process.env.PORT || 8080

app.use(express.json());



app.use('/api/v1',registerRoute)

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);  // Exit process on failure
    }
};

connectDB();


app.listen(port,()=>{
    console.log(`server is running  on port ${port}`)
})