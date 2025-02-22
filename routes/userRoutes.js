const express = require('express');
const router = express.Router();
const db = require("../config/db");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Route servant d'inscription, pour nouveau utilisateurs
 */
router.post(
    "/register",
    [
        check("email").escape().trim().notEmpty().isEmail().normalizeEmail(),
        check("password").escape().trim().notEmpty(),
    ],
    async (req, res) => {
        
        // recupération des infos du body avec id et password
        const { email, password } = req.body;
        // vérification de l'existence de l'utilisateur
        const userRefs = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        // Encryption du password
        const hash = await bcrypt.hash(password, 10);
        const user = { ...req.body, password: hash };
        if (userRefs.docs.length > 0) {
            return res.status(400).json({ msg: "Utilisateur existant" });
        }
        // Ajout de l'utilisateur
        await db.collection("users").add(user);

        return res.status(201).json({ msg: "L'utilisateur a été créé" });
    }
);

/**
 * Route servant à la connexion d'un utilisateur
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userRefs = await db
        .collection("users")
        .where("email", "==", email)
        .get();

    if (userRefs.docs.length == 0) {
        return res.status(400).json({ msg: "Cet utilisateur existe déjà" });
    }
    const user = userRefs.docs[0].data();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        delete user.password;
        const option = {
            expiresIn: "1d",
        };
        const token = jwt.sign(user, process.env.JWT_SECRET, option);
        return res.status(200).json({ msg: "Connexion réussie", token });
    } else {
        return res.status(400).json({ msg: "Mot de passe incorrect" });
    }
});


module.exports = router;