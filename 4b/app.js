require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const path = require("path");
const hbs = require("hbs");
var session = require("express-session");
var flash = require("express-flash");
var methodOverride = require("method-override");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(flash());
app.use(
	session({
		name: "my-session",
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: true,
	})
);

const port = process.env.SERVER_PORT || 3000;

// View engine setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/layouts"));

app.use(express.json());
app.use("/src/assets", express.static(path.join(__dirname, "src/assets")));
app.use("/src/bootstrap/css", express.static(path.join(__dirname, "src/bootstrap/css")));
app.use("/src/bootstrap/js", express.static(path.join(__dirname, "src/bootstrap/js")));
app.use("/src/css", express.static(path.join(__dirname, "src/css")));
app.use("/src/js", express.static(path.join(__dirname, "src/js")));

// Helpers
hbs.registerHelper("equal", function (a, b) {
	return a === b;
});
hbs.registerHelper("eq", function (a, b) {
	return a === b;
});
hbs.registerHelper("ifEqualAndUserExist", function (user, userId, options) {
	if (user.id && user.id === userId) {
		return options.fn(this);
	} else {
		options.inverse(this);
	}
});

// Middlewares

// Routes
app.use("/", routes);
app.use("/", authRoutes);
app.use("/", itemRoutes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
