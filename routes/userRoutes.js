const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
 * Route servant d'inscription, pour nouveau utilisateurs
 */
router.post(
    "/register",
    [
        check("email").escape().trim().notEmpty().isEmail().normalizeEmail(),
        check("password").escape().trim().notEmpty(),
    ],
    async (req, res) => {
        
        const { email, password } = req.body;

        const userRefs = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        const hash = await bcrypt.hash(password, 10);
        const user = { ...req.body, password: hash };
        
        if (userRefs.docs.length > 0) {
            return res.status(400).json({ msg: "Utilisateur existant" });
        }
        await db.collection("users").add(user);

        return res.status(201).json({ msg: "L'utilisateur a été créé" });
    }
);

/*
 * Route servant à la connexion d'un utilisateur
 */
router.post(
    "/login",
    [
        check("email").escape().trim().notEmpty().isEmail().normalizeEmail(),
        check("password").escape().trim().notEmpty(),
    ],
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const userRefs = await db
                .collection("users")
                .where("email", "==", email)
                .get();
            
            if (userRefs.docs.length == 0) {
                return res.status(400).json({ msg: "Mauvais courriel" });
            }

            const user = userRefs.docs[0].data();
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                delete user.password;
                const option = {
                    expiresIn: "1d",
                };
                const token = jwt.sign(user, process.env.JWT_SECRET, option);
                return res
                    .status(200)
                    .json({ msg: "Connexion réussie", token });
            } else {
                return res.status(400).json({ msg: "Mot de passe incorrect" });
            }
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
                msg: "Erreur lors de la connexion",
                error: error.message,
            });
        }
    }
);

// Les routes pour les utilisateurs, la modification et la suppression
// sont définies ici. PAS TESTER ---> le id n'est pas présent dans la requête
// marche pas avec emails

// TODO : le ID de l'utilisateur doit être ajouté à la requête, comme les soundtracks!



/*
 * Route servant à la modification d'un utilisateur
 */
/* router.put(
    "/update/:email",
    [check("email").escape().trim().notEmpty().isEmail().normalizeEmail()],
    async (req, res) => {
        try {
            const { email } = req.params.email;
            const updates = req.body;

            const userRef = db.collection("users").doc(email);
            const user = await userRef.get();

            if (!user.exists) {
                return res.status(404).json({ msg: "Utilisateur non trouvé" });
            }

            await userRef.update(updates);
            return res.status(200).json({ msg: "Utilisateur mis à jour" });
        } catch (error) {
            return res.status(500).json({
                msg: "Erreur lors de la mise à jour",
                error: error.message,
            });
        }
    }
); */

/*
 * Route servant à la suppression d'un utilisateur
 */
/* router.delete(
    "/delete/:email",
    [check("email").escape().trim().notEmpty().isEmail().normalizeEmail()],
    async (req, res) => {
        try {
            const { email } = req.params.email;
            const userRef = db.collection("users").doc(email);
            const user = await userRef.get();

            if (!user.exists) {
                return res.status(404).json({ msg: "Utilisateur non trouvé" });
            }

            await userRef.delete();
            return res.status(200).json({ msg: "Utilisateur supprimé" });
        } catch (error) {
            return res.status(500).json({
                msg: "Erreur lors de la suppression",
                error: error.message,
            });
        }
    }
);
 */
module.exports = router;
