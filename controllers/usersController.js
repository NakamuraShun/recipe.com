const
    mongoose = require("mongoose"),
    passport = require("passport"),
    User = require("../models/user");


module.exports = {
    getAll: (req, res, next) =>
    {
        User.find({})
            .then(users =>
            {
                res.render("dashboard/users", { "users": users });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    create: (req, res, next) =>
    {
        let newUserData = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email
        };
        User.register(newUserData, req.body.password, (error, user) =>
        {
            if (user)
            {
                req.flash("success", `${user.name.first}${user.name.last} 様のアカウントが作成されました。`);
                res.locals.redirect = "/";
                next();
            } else
            {
                req.flash("error", "アカウントの作成ができませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/newregister";
                next();
            }
        })
    },


    show: (req, res) =>
    {
        let userId = req.params.id;
        User.findById(userId)
            .then(user =>
            {
                res.render("dashboard/show-user", { "user": user });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    edit: (req, res) =>
    {
        let userId = req.params.id;
        User.findById(userId)
            .then(user =>
            {
                res.render("dashboard/edit-user", { "user": user });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    update: (req, res, next) =>
    {
        let updateUserData = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email
        };

        let userId = req.params.id;
        User.findByIdAndUpdate(userId, { $set: updateUserData })
            .then(user =>
            {
                req.flash("success", `${user._id} の情報が更新されました。`);
                res.locals.redirect = "/dashboard/users";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "アカウント情報更を更新できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/users";
                next();
            })
    },

    delete: (req, res, next) =>
    {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(user =>
            {
                req.flash("success", `${user._id} の情報を削除しました。`);
                res.locals.redirect = "/dashboard/users";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "アカウント情報を削除できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/users";
                next();
            })
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "ログインできませんでした。メールアドレスかパスワードをご確認ください。",
        successRedirect: "/",
        successFlash: "ログインしました。"
    }),

    logout: (req, res, next) =>
    {
        req.logout();
        req.flash("success", "ログアウトしました。またのご利用お待ちしております。");
        res.locals.redirect = "/";
        next();
    },


    redirectView: (req, res, next) =>
    {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }

}