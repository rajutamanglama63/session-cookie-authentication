const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const User = require("../model/User");


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    let user = await User.findOne({email});

    if(user) {
        return res.redirect('/login');
    }

    const hassedPassword = await bycrypt.hash(password, 12);

    user = new User({
        username,
        email,
        password: hassedPassword
    })

    await user.save();

    res.redirect('/login');
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(!user) {
        return res.redirect('/login');
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if(!isMatch) {
        return res.redirect('/login');
    }

    req.session.isAuth = true;

    res.redirect('/dashbord');
})


module.exports = router;