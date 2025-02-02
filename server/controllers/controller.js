const session = require("express-session");
const category = require("../models/Categories");
const recipe = require("../models/recipe");
const user = require("../models/user.js");
const bcrypt = require("bcrypt");
const nationality = require("i18n-nationality");
const fs = require("fs");
const { now } = require("lodash");
// Register the desired locale (e.g., English)
nationality.registerLocale(require("i18n-nationality/langs/en.json"));

// fetches all the country names
const allNationalities = nationality.getNames("en");

// get
// homePage
const homePage = async (req, res) => {
  try {
    const limit = 5;
    const categories = await category.find({}).limit(limit);
    const latest = await recipe.find({}).sort({ _id: -1 }).limit(limit);
    const egyption = await recipe
      .find({ categoryName: "Egyptian" })
      .sort({ _id: -1 })
      .limit(limit);
    const chinese = await recipe
      .find({ categoryName: "Chinese" })
      .sort({ _id: -1 })
      .limit(limit);
    const thai = await recipe
      .find({ categoryName: "Thai" })
      .sort({ _id: -1 })
      .limit(limit);

    const food = { latest, egyption, chinese, thai };
    res.status(200).render("index", {
      title: "food blog - Home Page",
      food,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//get
//login or signup
const loginOrSignUp = async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(200).render("loginOrSignUp");
    } else {
      res.redirect("/submit-recipe");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//get
//signUp
const signUp = async (req, res) => {
  try {
    const email = await user.find({ email: req.body.userEmail });
    if (email != "") {
      req.flash("SignUpError", "This Email Is Exist");
      res.redirect("/login-signUp");
    } else {
      if (req.body.userPass.length < 8) {
        req.body.title = "the password is too short ,please try again";
        req.flash("SignUpError", "the password is too short ,please try again");
        res.redirect("/login-signUp");
      } else {
        const hashedPass = await bcrypt.hash(req.body.userPass, 10);
        const newUser = await user.create({
          name: req.body.userName,
          email: req.body.userEmail,
          pass: hashedPass,
        });
        req.flash("flashSignUp", "sign-up successfuly");
        req.session.user = {
          id: newUser._id,
          email: newUser.email,
        };
        res.redirect("/submit-recipe");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//get
//login
const login = async (req, res) => {
  try {
    res.status(200).render("login");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

//post
//login
const loginIfExist = async (req, res) => {
  try {
    const users = await user.find({
      email: new RegExp(`^${req.body.email}$`, "i"),
    });
    if (users.length > 0) {
      const inputPass = req.body.pass;
      const emailPass = users[0].pass;

      const machedPass = await bcrypt.compare(inputPass, emailPass);

      if (machedPass) {
        req.session.user = {
          id: users[0]._id || users._id,
          email: users[0].email || users.email,
        };
        req.flash("flashSignUp", "Logged in successfully");
        res.redirect("/submit-recipe");
      } else {
        req.flash("flashError", "Incorrect password. Please try againt");
        res.redirect("/login");
      }
    } else {
      res.status(404).send("not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// get
// All categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find({});
    res.status(200).render("categories", {
      categories,
      title: "food blog - All Categories",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// get
//All recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await recipe.find({});
    res.status(200).render("recipes", {
      recipes,
      title: "food blog - All Recipes",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// get
//recipes/:id
//one recipe
const getARecipe = async (req, res) => {
  try {
    const oneRecipe = await recipe.find({ _id: req.params.id });
    const user = req.session.user;
    const recipeEmail = oneRecipe[0].email;
    res.status(200).render("Arecipe", {
      oneRecipe,
      user,
      recipeEmail,
      title: "food blog - " + oneRecipe[0].name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// get
//categories/:id
//one category
const countryRecipes = async (req, res) => {
  try {
    const categoryy = await category.find({ _id: req.params.id });
    if (categoryy.length > 0) {
      const recipes = await recipe.find({ categoryName: categoryy[0].name });
      res.status(200).render("recipes-counrty.ejs", {
        recipes,
        title: "food blog -" + categoryy[0].name,
      });
    } else {
      res.status(404).send("not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// item search
// post
const search = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const searchTermNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const result = await recipe.find({
      $or: [
        { name: { $regex: new RegExp(searchTermNoSpecialChars, "i") } },
        { description: { $regex: new RegExp(searchTermNoSpecialChars, "i") } },
        { ingredients: { $regex: new RegExp(searchTermNoSpecialChars, "i") } },
        { categoryName: { $regex: new RegExp(searchTermNoSpecialChars, "i") } },
      ],
    });

    res.status(200).render("search", {
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//get
//recipes randomly
const randomRecipe = async (req, res) => {
  try {
    let count = await recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let randomRecipe = await recipe.findOne().skip(random).exec();
    res.status(200).render("randomRecipes", {
      randomRecipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// get
// submit-recipe
const submitRecipe = async (req, res) => {
  try {
    const user = req.session.user;
    const countries = Object.values(allNationalities);

    res.status(200).render("submitRecipe", { countries });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

// post
// submit-recipe
const submitAddRecipe = async (req, res) => {
  try {
    let uploadedImage;
    let imagePath;
    let imageName;
    if (!req.files || Object.keys(req.files).lenght === 0) {
      res.status(404).send("please upload the image");
    } else {
      (uploadedImage = req.files.image),
        (imageName = Date.now() + uploadedImage.name),
        (imagePath =
          require("path").resolve("./") + "/public/uploads/" + imageName);
      uploadedImage.mv(imagePath, function (error) {
        if (error) return res.status(500).send(error);
      });
    }
    const nationality = await category.find({ name: req.body.category });
    let categoryImagePath =
      require("path").resolve("./") + "/public/images/" + imageName;
    fs.copyFileSync(imagePath, categoryImagePath);
    if (!nationality.length > 0) {
      await category.create({ name: req.body.category, image: imageName });
    }
    const newRecipe = await recipe.create({
      name: req.body.recipeName,
      email: req.body.email,
      image: imageName,
      description: req.body.description,
      ingredients: req.body.ingredients,
      categoryName: req.body.category,
    });
    req.flash("flashInfo", "The recipe has been added");
    res.redirect("/submit-recipe");
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//get
//profile
const profile = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const email = await recipe.find({ email: userEmail });
    res.status(200).render("profile", { email });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//delete
//recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipes = await recipe.deleteOne({ _id: req.params.id });
    const userEmail = req.session.user.email;
    const email = await recipe.find({ email: userEmail });
    req.flash("flashInfo", "done");
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};
//get
//edit recipe
const editRecipe = async (req, res) => {
  try {
    const aRecipe = await recipe.find({ _id: req.params.id });
    const categories = Object.values(allNationalities);
    res.status(200).render("editRecipe", { aRecipe, categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//put
// edit recipe
const saveChanges = async (req, res) => {
  let changedUploadedImage;
  let changedUploadedImageName;
  let changedUploadedpath;
  try {
    if (req.files) {
      if (req.files.changedImage) {
        changedUploadedImage = req.files.changedImage;
        changedUploadedImageName = Date.now() + changedUploadedImage.name;
        changedUploadedpath =
          require("path").resolve("./") +
          "/public/uploads/" +
          changedUploadedImageName;

        changedUploadedImage.mv(changedUploadedpath, function (error) {
          if (error) return res.status(500).send(error);
        });
      } else {
        console.log("no files");
      }
    }
    const theRecipe = await recipe.find({ _id: req.params.id });
    if (theRecipe.length > 0) {
      const recipee = await recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.recipeName || theRecipe[0].name,
          image: changedUploadedImageName || theRecipe[0].image,
          description: req.body.description || theRecipe[0].description,
          ingredients: req.body.ingredients || theRecipe[0].ingredients,
          categoryName: req.body.category || theRecipe[0].categoryName,
        }
      );
      res.redirect("/profile");
    } else {
      res.status(404).send("not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

//get
//logout
const logout = async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("error during logout");
      } else {
        res.redirect("/login-signUp");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  homePage,
  loginOrSignUp,
  signUp,
  login,
  loginIfExist,
  getAllCategories,
  getAllRecipes,
  getARecipe,
  countryRecipes,
  search,
  randomRecipe,
  submitRecipe,
  submitAddRecipe,
  profile,
  deleteRecipe,
  editRecipe,
  saveChanges,
  logout,
};
