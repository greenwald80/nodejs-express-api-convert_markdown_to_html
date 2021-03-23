const express = require("express");
const showdown = require("showdown");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jwt-simple");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const converter = new showdown.Converter();

const ADMIN = "user";
const ADMIN_PASSWORD = "pass";
const SECRET = "secret#4456";

passport.use(
  new LocalStrategy(function (username, password, done) {
    if (username === ADMIN && password === ADMIN_PASSWORD) {
      done(null, jwt.encode({ username }, SECRET));
      return;
    }
    done(null, false);
  })
);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  function (req, res) {
    // Если эта функция вызвана, аутентификация прошла успешно.
    // Отправить строку 'Authenticated'.
    res.send("Authenticated");
  }
);

app.post(
  "/convert",
  passport.authenticate("local", { session: false, failWithError: true }),
  function (req, res, next) {
    // Если эта функция вызвана, аутентификация прошла успешно.
    // Также проверяем, на существование «content»
    if (typeof req.body.content == "undefined" || req.body.content == null) {
      res.json(["error", "No data found"]);
    } else {
      text = req.body.content;
      html = converter.makeHtml(text);
      res.json(["markdown", html]);
    }
  },
  function (err, req, res, next) {
    // Возвращаем сообщение «Unauthorized» обратно, если аутентификация не удалась.
    return res.status(401).send({ success: false, message: err });
  }
);

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
