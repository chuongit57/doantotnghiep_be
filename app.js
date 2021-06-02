const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { ValidationError } = require('express-validation');
const cors = require('cors')

const productRouter = require("./api/routes/product.router.js")();
const categoryRouter = require("./api/routes/category.router.js")();
const adminRouter = require("./api/routes/admin.router.js")();
const userRouter = require("./api/routes/user.router.js")();

mongoose.connect(
    "mongodb://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-shard-00-00-wovcj.mongodb.net:27017,node-rest-shop-shard-00-01-wovcj.mongodb.net:27017,node-rest-shop-shard-00-02-wovcj.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin", {
        useMongoClient: true
    }
);
mongoose.Promise = global.Promise;
app.use(cors());
app.use(morgan("dev"));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// app.post('/create', function(req, res) {
//     console.log(req.body)
// })

// Routes which should handle requests
app.use("/api/admin", adminRouter);
app.use("/api", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);


app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
})

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;