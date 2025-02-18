// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");

//Importation de la librairie de date
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
//On charge le module pour la langue
require("dayjs/locale/fr");
dayjs.locale("fr"); //On change la langue
//On importe le module pour la date universelle
dayjs.extend(utc);

const { check, validationResult } = require("express-validator");
const serveur = express();
dotenv.config();

serveur.use(express.json()); //Permet de passer de la donnée json dans le body
serveur.use(express.urlencoded({ extended: true })); //Permet de passer de la donnée avec formulaire dans le body

//Permettre l'accès au dossier
const dossierPublic = path.join(__dirname, "public");
serveur.use(express.static(dossierPublic));

//Middleware
function authentifier(req, res, next) {
    console.log("Authentification en cours");
    next();
}

//Routes
/**
 * Route servant à récuperer tous les bandes sonores de la base de données
 */



serveur.get(
    "/soundtracks",
    [
        check("order").escape().trim().optional().isLength({ max: 100 }),
        check("direction").escape().trim().optional().isIn(["asc", "desc"]),
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                console.log(validationErrors);

                return res.status(400).json({ msg: "Données invalides" });
            }

            //TEST de date
            // const date = dayjs("2025-02-17T15:30:03Z");
            // console.log(date.format("Jour:dddd le DD MM YYYY"));

            const { order = "title", direction = "asc", limit = 100, start = 0 } = req.query;

            const soundtracks = [];
            const docRefs = await db
                .collection("soundtracks")
                .orderBy(order, direction)
                .limit(Number(limit))
                .offset(Number(start))
                .get();

            docRefs.forEach((doc) => {
                const soundtrack = { id: doc.id, ...doc.data() };
                soundtracks.push(soundtrack);
            });

            if (soundtracks.length == 0) {
                return res.status(404).json({ msg: "Aucune bande sonore trouvé" });
            }

            return res.status(200).json(soundtracks);
        } catch (erreur) {
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

serveur.get("/soundtracks/categories/:categorie", async (req, res) => {
    const { categorie } = req.params;
    const soundtracks = [];
    console.log(categorie);

    const docRefs = await db.collection("soundtracks").where("genre", "array-contains", categorie).get();

    docRefs.forEach((doc) => {
        const soundtrack = { id: doc.id, ...doc.data() };
        soundtracks.push(soundtrack);
    });

    if (soundtracks.length == 0) {
        return res.status(404).json({ msg: "Aucune bande sonore trouvé" });
    }
    return res.status(200).json(soundtracks);
});

serveur.get("/soundtracks/composer/:composer", async (req, res) => {
    let { composer } = req.params;

    composer = composer.split("-");
    composer.forEach((piece, index) => {
        composer[index] = piece[0].toUpperCase() + piece.slice(1);
    });
    composer = composer.join(" ");

    const soundtracks = [];

    const docRefs = await db.collection("soundtracks").where("composer", "==", composer).orderBy("composer").get();

    docRefs.forEach((doc) => {
        const soundtrack = { id: doc.id, ...doc.data() };
        soundtracks.push(soundtrack);
    });

    if (soundtracks.length == 0) {
        return res.status(404).json({ msg: "Aucune bande sonore trouvé" });
    }
    return res.status(200).json(soundtracks);
});

serveur.get(
    "/soundtracks/:id",
    [
        check("id")
            .escape()
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 20, max: 20 })
            .matches(/([A-z0-9\-\_]){20}/),
    ],
    async (req, res) => {
        //Destructuration
        const { id } = req.params;
        const docRef = await db.collection("soundtracks").doc(id).get();
        const soundtrack = { id: docRef.id, ...docRef.data() };

        return res.json(soundtrack);
    }
);

serveur.post(
    "/soundtracks",
    [
        check("title").escape().trim().notEmpty().isLength({ max: 300 }).withMessage("Le titre est obligatoire"),
        check("genre").escape().trim().exists().isArray(),
        check("year").escape().trim().notEmpty().isLength({ max: 2000 }),
    ],
    async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log(validationErrors);

            return res.status(400).json({ msg: "Données invalides", validationErrors });
        }
        // const body = req.body;
        const { body } = req;

        //On récupère la date de la requête
        let dateModif = dayjs();
        //On enregistre au format universel et on l'ajoute au corps de la requête
        body.dateModif = dateModif.utc().format();
        // console.log(dateModif);
        await db.collection("soundtracks").add(body);

        return res.status(201).json({ msg: "La bande sonore a été ajouté" });
    }
);

serveur.post("/soundtracks/initialiser", (req, res) => {
    try {
        const soundtracks = require("./data/soundtracks");

        //TODO: Vérifier si le soundtrack est déjà dans la base de données

        soundtracks.forEach(async (soundtrack) => {
            await db.collection("soundtracks").add(soundtrack);
        });

        return res.status(201).json({ msg: "Base de données initialisée" });
    } catch (erreur) {
        console.log(erreur);

        return res.status(500).json({ msg: "Une erreur est survenue" });
    }
});

serveur.put("/soundtracks/:id", async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    await db.collection("soundtracks").doc(id).update(body);
    return res.status(201).json({ msg: "La bande sonore a été modifié", soundtrack: body });
});

serveur.delete("/soundtracks/:id", async (req, res) => {
    const { id } = req.params;

    await db.collection("soundtracks").doc(id).delete();
    return res.status(204).json({ msg: "La bande sonore a été supprimé" });
});

//Ressources 404
serveur.use((req, res) => {
    res.statusCode = 404;
    return res.status(404).json({ msg: "Ressource non trouvée" });
});

serveur.listen(process.env.PORT, () => {
    console.log(`le serveur est démarré sur le port ${process.env.PORT}`);
});
