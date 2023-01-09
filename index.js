const express = require('express')
const userRouter = require('./Routes/userRoutes')
const visitCounter = require('./Routes/VisitCount')
const app = express()
require('dotenv').config();
const port = 3000 || process.env.PORT
const mongoose = require('mongoose');

app.get('/', async (req, res, next) => {
    res.send(`<h2> Micro-Task #2`);
})

//MIDDLEWARES
app.use(express.json())
app.use("/users", userRouter)
app.use("/api", visitCounter)

//AUTHENTICATION
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to database")
})
.catch((error)=>{
    console.log(error)
})

//ERROR HANDLER
app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: "404",
        error: "Not found"
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })

module.exports = app;