const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("userIDfromMongoDb")
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id); //drag user from database and replace req user
      next();
    })
    .catch(err => console.log(err));
});

app.use("/", shopRoutes);

app.use("/admin", adminRoutes); //set all routes from admin.js in sub folder /admin
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
