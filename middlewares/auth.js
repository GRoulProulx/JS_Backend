const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    

    const jeton =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];

    if (!jeton) {
        return res.status(401).json({ msg: "Token expired!" });
    }

    const decode = await jwt.decode(jeton, process.env.JWT_SECRET);

    if (!decode || decode.role > 0) {
        return res.status(401).json({ msg: "Access Denied" });
    }

    req.utilisateur = decode;
    next();
}

module.exports = auth;
