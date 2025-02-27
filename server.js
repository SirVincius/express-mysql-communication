require("dotenv").config();
const bcrypt = require("./bcrypt.js");
const {
  body,
  ValidationChain,
  validationResult,
} = require("express-validator");

const express = require("express");
const app = express();
const path = require("path");
const db = require("./db.js");

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
    return res.render("pages/login", {
      errors: [],
      formData: {},
    });
  })
  .post(
    [
      body("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .matches(/^[a-zA-ZÀ-ÿ\s'\-~]+$/)
        .withMessage("Invalid characters"),
      body("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .matches(/^[a-zA-ZÀ-ÿ\s'\-~]+$/)
        .withMessage("Invalid characters"),
      body("email").isEmail().withMessage("Email adress is not valid"),
      body("birthDate").isDate().withMessage("Date is not valid"),
      body("password")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lower case letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one capital letter")
        .matches(/[!@#$%^&*]/)
        .withMessage(
          "Password must contain at least one of these symbols : !@#$%^&*"
        ),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        console.log(req.body);
        return res.render("pages/login", {
          errors: errors.array(),
          formData: req.body,
        });
      }
      const first_name = req.body.firstName;
      const last_name = req.body.lastName;
      const email = req.body.email;
      const birth_date = new Date(req.body.birthDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const password = req.body.password;
      const password_confirmation = req.body.passwordConfirmation;
      const salt = await bcrypt.generateSalt();
      const hashed_password = await bcrypt.hashPassword(salt, password);
      db.insertNewUser(
        first_name,
        last_name,
        email,
        birth_date,
        salt,
        hashed_password
      );
      /**
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
      **/
      return res.render("pages/login", {
        errors: [],
        formData: {},
      });
    }
  );

app.get("/gallery(.html)?", (req, res) => {
  res.render("pages/gallery");
});

app.listen(5500, (req, res) => {
  console.log(`Server running!`);
});
