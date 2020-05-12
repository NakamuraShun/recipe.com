const
    port = 3000,
    express = require("express"),
    app = express(),
    router = express.Router(),
    partials = require('express-partials'),
    methodOverride = require("method-override"),
    connectFlash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    passport = require('passport'),
    dotenv = require('dotenv'),
    //Controller
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
    usersController = require("./controllers/usersController"),
    coursesController = require("./controllers/coursesController"),
    //models
    User = require("./models/user")
    ;

dotenv.config();


//【db】
//local用(back)
// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/recipe_db", { useNewUrlParser: true });
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.once("open", () => { console.log("MongoDBに接続完了") });

//heroku用
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/recipe_db",
    { useNewUrlParser: true, useUnifiedTopology: true },
    error =>
    {
        if (error)
        {
            console.log(error);
        } else
        {
            console.log("DB接続不可")
        }
    });

const db = mongoose.connection;
db.once("open", () => { console.log("MongoDBに接続完了") });



//express.json,expressurlencoded(リクエスト本体を解析するの必要)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ejs
app.set("view engine", "ejs");
app.use(partials());
app.use(express.static('views'));


//appと経路を分けるため(ここから下router→app)
app.use("/", router);

//methodOverride
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//cookie,Session,flash
router.use(cookieParser("secret_passcode"));

router.use(expressSession({
    secret: "secret_passcode",
    // cookie: {
    //     maxAge: 4000000
    // },
    resave: false,
    saveUninitialized: false
}));
router.use(connectFlash());

//passportの初期化、セッション使用とシリアライズ,デシリアライズ設定
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy()); //大事！！
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ローカルオブジェクト
router.use((req, res, next) =>
{
    res.locals.flashMsg = req.flash();
    //ログイン状態のBool値を確認してloggedInに代入
    res.locals.loggedIn = req.isAuthenticated();
    //ログインしたユーザーをcurrentUserに設定
    res.locals.currentUser = req.user;
    next();
});

//front
router.get("/", (req, res) => { res.render("index") });
router.get("/contact", (req, res) => { res.render("contact") });
router.get("/dashboard", (req, res) => { res.render("dashboard/index") });
router.get("/newregistr", (req, res) => { res.render("newregistr") });
router.get("/login", (req, res) => { res.render("login") });
router.get("/logout", usersController.logout, usersController.redirectView);
router.get("/newsubscriber", (req, res) => { res.render("newsubscriber") });
router.get("/newcourse", (req, res) => { res.render("newcourse") });
router.get("/courses/json", coursesController.getAllByJson);

//-- post
router.post("/newregister", usersController.create, usersController.redirectView);
router.post("/login", usersController.authenticate);
router.post("/newsubscriber", subscribersController.create, subscribersController.redirectView);
router.post("/newcourse", coursesController.create, coursesController.redirectView);
router.post("/contact", homeController.create, homeController.redirectView);

//-- dashboard/
router.get("/dashboard/users", usersController.getAll);
router.get("/dashboard/users/:id", usersController.show);
router.get("/dashboard/users/:id/edit", usersController.edit);
router.put("/dashboard/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/dashboard/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/dashboard/subscribers", subscribersController.getAll);
router.get("/dashboard/subscribers/:id", subscribersController.show);
router.get("/dashboard/subscribers/:id/edit", subscribersController.edit);
router.put("/dashboard/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/dashboard/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/dashboard/courses", coursesController.getAll);
router.get("/dashboard/courses/:id", coursesController.show);
router.get("/dashboard/courses/:id/edit", coursesController.edit);
router.put("/dashboard/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/dashboard/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.get("/dashboard/contacts", homeController.getAll);
router.get("/dashboard/contacts/:id", homeController.show);
router.delete("/dashboard/contacts/:id/delete", homeController.delete, homeController.redirectView);

//error（経路の最後！）
router.get("/404", (req, res) => { res.render("404") });
router.get("/500", (req, res) => { res.render("500") });
router.use(errorController.respond404);
router.use(errorController.respond500);



//【接続】

//local用(back)
// app.listen(port, () => { console.log(`${port}で接続中…`); });

//heroku用
app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () =>
{
    console.log(`Saever running at http://localhost:${app.get("port")}`)
});