require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connnectTOMongo = require("./server/config/connectdb");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const flashMessages = require("./server/middleWare/flashMessages");
const connect = require("connect-mongo");

const app = express();

const PORT = process.env.PORT || 4000;
const mongoUrl = process.env.MONGO_URI;

// middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayout);
app.use(methodOverride("_method"));
app.use(cookieParser("CookingBlogSecure"));
app.use(
  session({
    secret: "CookingBlogSecritSession",
    saveUninitialized: false,
    resave: true,
    store: connect.create({ mongoUrl: mongoUrl }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());
app.use(fileUpload());
app.use(flashMessages);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

// routes
const routes = require("./server/routes/routes");
app.use("/", routes);

connnectTOMongo();
app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `);
});
