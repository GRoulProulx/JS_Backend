const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { check, validationResult } = require("express-validator");
const auth = require("../middlewares/auth");


/*
 * Route servant à récuperer tous les bandes sonores de la base de données.
 * On peut ajouter des paramètres de requête pour filtrer les données, pour avoir les filtres désirés.
 */
router.get(
    "/",
    [
        check("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        check("start").optional().isInt({ min: 0 }).toInt(),
        check("order")
            .escape()
            .trim()
            .optional()
            .isIn(["title", "year", "composer"]),
        check("direction").escape().trim().optional().isIn(["asc", "desc"]),
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                console.log(validationErrors);

                return res.status(400).json({ msg: "Données invalides" });
            }

            let {
                order = "title",
                direction = "asc",
                limit = 30,
                start = 0,
                /* filterCategory = "year",
                filterSymbol = ">",
                filterValue = "1990", */
            } = req.query;

            const soundtracks = [];
            const docRefs = await db
                .collection("soundtracks")
                /* .where(filterCategory, filterSymbol, filterValue) */
                .orderBy(order, direction)
                .limit(Number(limit))
                .offset(Number(start))
                .get();

            docRefs.forEach((doc) => {
                const soundtrack = { id: doc.id, ...doc.data() };
                soundtracks.push(soundtrack);
            });

            if (soundtracks.length == 0) {
                return res
                    .status(404)
                    .json({ msg: "Aucune bande sonore trouvé" });
            }

            return res.status(200).json(soundtracks);
        } catch (erreur) {
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

/*
 * Route pour récupérer les bandes sonores par leur genre
 */
router.get(
    "/genre/:genre",
    [check("genre").trim().notEmpty().isLength({ min: 2, max: 50 })],
    async (req, res) => {
        try {
            const { genre } = req.params;
            const soundtracks = [];
            console.log(genre);

            const docRefs = await db
                .collection("soundtracks")
                .where("genre", "array-contains", genre)
                .get();

            docRefs.forEach((doc) => {
                const soundtrack = { id: doc.id, ...doc.data() };
                soundtracks.push(soundtrack);
            });

            if (soundtracks.length == 0) {
                return res
                    .status(404)
                    .json({ msg: "Aucune bande sonore trouvé" });
            }
            return res.status(200).json(soundtracks);
        } catch (erreur) {
            console.log(erreur);
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

/*
 * Route pour récupérer les bandes sonores par leur compositeur
 */
router.get(
    "/composer/:composer",
    [check("composer").trim().notEmpty().isLength({ min: 2, max: 100 })],
    async (req, res) => {
        try {
            let { composer } = req.params;

            composer = composer.split("-");
            composer.forEach((piece, index) => {
                composer[index] = piece[0].toUpperCase() + piece.slice(1);
            });
            composer = composer.join(" ");

            const soundtracks = [];

            const docRefs = await db
                .collection("soundtracks")
                .where("composer", "==", composer)
                .orderBy("composer")
                .get();
            console.log(composer);
            docRefs.forEach((doc) => {
                const soundtrack = { id: doc.id, ...doc.data() };
                soundtracks.push(soundtrack);
            });

            if (soundtracks.length == 0) {
                return res
                    .status(404)
                    .json({ msg: "Aucune bande sonore trouvé" });
            }
            return res.status(200).json(soundtracks);
        } catch (erreur) {
            console.log(erreur);
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

router.get(
    "/:id",
    [
        check("id")
            .escape()
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 20, max: 20 }),
    ],
    async (req, res) => {
        try {
            //Destructuration
            const { id } = req.params;
            const docRef = await db.collection("soundtracks").doc(id).get();
            const soundtrack = { id: docRef.id, ...docRef.data() };

            return res.json(soundtrack);
        } catch (erreur) {
            console.log(erreur);
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);
/*
 * Création d'une bande sonore
 */
router.post(
    "/",
    auth,
    [
        check("title")
            .escape()
            .trim()
            .notEmpty()
            .isLength({ max: 300 })
            .withMessage("Le titre est obligatoire"),
        check("genre").escape().trim().exists().isArray(),
        check("year").escape().trim().notEmpty().isLength({ max: 2000 }),
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                console.log(validationErrors);

                return res
                    .status(400)
                    .json({ msg: "Données invalides", validationErrors });
            }
            // const body = req.body;
            const { body } = req;

            await db.collection("soundtracks").add(body);

            return res
                .status(201)
                .json({ msg: "La bande sonore a été ajouté" });
        } catch (erreur) {
            console.log(erreur);
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

/*
 * Route servant à initialiser la base de données
 */

router.post("/init", auth, (req, res) => {
    try {
        const soundtracks = require("../data/soundtracks");

        soundtracks.forEach(async (soundtrack) => {
            await db.collection("soundtracks").add(soundtrack);
        });

        return res.status(201).json({ msg: "Base de données initialisée" });
    } catch (erreur) {
        console.log(erreur);

        return res.status(500).json({ msg: "Une erreur est survenue" });
    }
});

/*
 * Route servant à modifier une bande sonore
 */
router.put(
    "/:id",
    [check("id").trim().notEmpty().isString().isLength({ min: 20, max: 30 })],

    async (req, res) => {
        try {
            const { id } = req.params;
            const { body } = req;

            await db.collection("soundtracks").doc(id).update(body);
            return res
                .status(201)
                .json({
                    msg: "La bande sonore a été modifié",
                    soundtrack: body,
                });
        } catch (erreur) {
            console.log(erreur);
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

/*
 * Route servant à supprimer une bande sonore.
 */
router.delete(
    "/:id",
    [check("id").trim().notEmpty().isString().isLength({ min: 20, max: 20 })],

    async (req, res) => {
        try {
            const { id } = req.params;

            await db.collection("soundtracks").doc(id).delete();

            return res
                .status(204)
                .json({ msg: "La bande sonore a été supprimé" });
        } catch (erreur) {
            console.log(erreur);
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

module.exports = router;
