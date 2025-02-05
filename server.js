require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("^/$|/index(.html)?", (req, res) => {
  res.render("pages/index");
});

app
  .route("/login(.html)?")
  .get((req, res) => {
    res.render("pages/login");
  })
  .post((req, res) => {
    let first_name = req.body.firstName;
    let last_name = req.body.lastName;
    let email = req.body.email;
    let birth_date = new Date(req.body.birthDate);
    let password = req.body.password;
    let password_confirmation = req.body.passwordConfirmation;
    console.log(
      JSON.stringify(
        {
          first_name,
          last_name,
          email,
          birth_date,
          password,
          password_confirmation,
        },
        null,
        2
      )
    );
    res.render("pages/login");
  });

app.listen(5500, (req, res) => {
  console.log(`Server running!`);
});
