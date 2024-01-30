const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { MongoNetworkError } = require("mongodb");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;

    // let authHeader = req.headers.Authorization || req.headers.authorization;

    let authHeader;

    if (req.headers.Authorization) {
        authHeader = req.headers.Authorization;
    } else if(req.headers.authorization) {
        authHeader = req.headers.authorization;
    } else authHeader = "";

    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    } else {
        token = authHeader;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            res.status(401);
            throw new Error("User is not authorized");
        }

        req.user = decoded.user;
        next();
    });

    if(!token) {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }



    // if(authHeader && authHeader.startsWith("Bearer")) {
    //     token = authHeader.split(" ")[1];
    //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //         if(err) {
    //             res.status(401);
    //             throw new Error("User is not authorized");
    //         }

    //         req.user = decoded.user;
    //         next();
    //     });

    //     if(!token) {
    //         res.status(401);
    //         throw new Error("User is not authorized or token is missing");
    //     }
    // }
});

module.exports = validateToken;