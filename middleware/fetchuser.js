const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ThisisSecretKey";

const fetchuser = async (req, res, next) => {
    // console.log("jaoge kaise");
    let success = false;
    try {
        let token = req.header('authtoken');
        let data = jwt.decode(JSON.parse(token));
        // console.log(data.email);
        // console.log(data);
        // console.log(data);        // console.log(user);
        req.user=data.user;
        next();
        if (!token) {
            return res.status(401).send({ success, error: "Authentication denied" });
        }

    } catch (error) {
        // console.log(error.message);
        // console.log("Comes Here");
        res.status(500).send({ error, success });
    }
}

module.exports = fetchuser;