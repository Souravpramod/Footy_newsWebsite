const express = require("express");
const session = require("express-session");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

// ---------------- SESSION SETUP ----------------
app.use(
  session({
    secret: "footyNewsSecret",
    resave: false,
    saveUninitialized: false
  })
);

// ---------------- PREDEFINED CREDENTIALS ----------------
const USERNAME = "admin";
const PASSWORD = "1234";

// ---------------- ROUTES ----------------

// Login page
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  res.render("login", { error: null });
});

// Login handler
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    req.session.user = username;
    res.redirect("/home");
  } else {
    res.render("login", {
      error: "Incorrect username or password"
    });
  }
});

// AUTH MIDDLEWARE (protect pages)
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
}

// Home (Latest)
app.get("/home", isAuthenticated, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("home", { user: req.session.user, active: "home" });
});

// Premier League
app.get("/premier-league", isAuthenticated, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("premier", { user: req.session.user, active: "premier" });
});

// Champions League
app.get("/champions-league", isAuthenticated, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("champions", { user: req.session.user, active: "champions" });
});

// Transfers
app.get("/transfers", isAuthenticated, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("transfers", { user: req.session.user, active: "transfers" });
});

// Signout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
