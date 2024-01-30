const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rappresenta il 'work factor' dell'hashing
    console.log("Hashed password: ", hashedPassword); // se vogliamo vedere a console la pwd criptata
        const user  = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log("User created ", user);
    if(user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    // confronta password con hashed password
    if(user && (await bcrypt.compare(password, user.password))) {
        // la response conterrà il token di accesso generato dal server
        const accessToken = jwt.sign(
            {
            // payload
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
           },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

//@desc Current user information
//@route GET /api/users/register
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
