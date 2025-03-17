// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const server = express();
dotenv.config();

//Connexion à la base de données -- Permet de passer de la donnée json dans le body
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true })); //Permet de passer de la donnée avec formulaire dans le body

// Importations des routes
const userRoutes = require("./routes/userRoutes");
const soundtracksRoutes = require("./routes/soundtracksRoutes");

server.use("/users", userRoutes);
server.use("/soundtracks", soundtracksRoutes);

//Permettre l'accès au dossier
const dossierPublic = path.join(__dirname, "public");
server.use(express.static(dossierPublic));

//Middleware

function authentifier(req, res, next) {
    console.log("Authentification en cours");
    next();
}

//Ressources 404
server.use((req, res) => {
    res.statusCode = 404;
    return res.status(404).json({ msg: "Ressource non trouvée" });
});

server.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
});
