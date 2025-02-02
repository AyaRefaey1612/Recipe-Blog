const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const isAuthenticated = require("../middleWare/isAuthenticated");

router.get("/", controller.homePage);
router.get("/login-signUp", isAuthenticated, controller.loginOrSignUp);
router.post("/sign-up", controller.signUp);
router.get("/login", controller.login);
router.post("/login", controller.loginIfExist);
router.get("/categories", controller.getAllCategories);
router.get("/categories/:id", controller.countryRecipes);
router.get("/latest-recipes", controller.getAllRecipes);
router.get("/recipes/:id", controller.getARecipe);
router.post("/search", controller.search);
router.get("/show-random", controller.randomRecipe);
router.get("/submit-recipe", isAuthenticated, controller.submitRecipe);
router.post("/submit-recipe", isAuthenticated, controller.submitAddRecipe);
router.get("/profile", isAuthenticated, controller.profile);
router.delete("/delete/:id", isAuthenticated, controller.deleteRecipe);
router.get("/edit/:id", isAuthenticated, controller.editRecipe);
router.put("/savechanges/:id", isAuthenticated, controller.saveChanges);

router.get("/logout", controller.logout);

module.exports = router;
