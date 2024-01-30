const express = require("express");
const router = express.Router();
const { 
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact 
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

// router.route("/").get(getContacts);
// router.route("/").post(createContact);
// router.route("/:id").get(getContact);
// router.route("/:id").put(updateContact);
// router.route("/:id").delete(deleteContact);

router.use(validateToken);
// il middleware validateToken si applica così a tutte le rotte,
// altrimenti va usata singolarmente per ciascuna rotta privata
// come visto per GET currentUser in routes/userRoutes

router.route("/").get(getContacts).post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);


module.exports = router;