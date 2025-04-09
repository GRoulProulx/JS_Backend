const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Accès refusé, jeton manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ msg: "Accès refusé." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Jeton invalide ou expiré." });
    }
}

module.exports = auth;
