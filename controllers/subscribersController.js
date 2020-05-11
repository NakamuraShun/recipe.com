const
    mongoose = require("mongoose"),
    Subscriber = require("../models/subscriber");


module.exports = {
    getAll: (req, res, next) =>
    {
        Subscriber.find({})
            .then(subscribers =>
            {
                res.render("dashboard/subscribers", { "subscribers": subscribers });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    create: (req, res, next) =>
    {
        let newSubscriberData = {
            name: req.body.name,
            email: req.body.email
        };

        Subscriber.create(newSubscriberData)
            .then((subscriber) =>
            {
                req.flash("success", `${subscriber.name} 様のメルマガ登録が完了しました。`);
                res.locals.redirect = "/";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "メルマガ登録ができませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/newsubscriber";
                next();
            })
    },

    show: (req, res, next) =>
    {
        let subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then(subscriber =>
            {
                res.render("dashboard/show-subscriber", { "subscriber": subscriber });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    edit: (req, res) =>
    {
        let subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then(subscriber =>
            {
                res.render("dashboard/edit-subscriber", { "subscriber": subscriber });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    update: (req, res, next) =>
    {
        let updateSubscriberData = {
            name: req.body.name,
            email: req.body.email
        };

        let subscriberId = req.params.id;
        Subscriber.findByIdAndUpdate(subscriberId, { $set: updateSubscriberData })
            .then(subscriber =>
            {
                req.flash("success", `${subscriber._id} の情報が更新されました。`);
                res.locals.redirect = "/dashboard/subscribers";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "アカウント情報更を更新できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/subscribers";
                next();
            })
    },

    delete: (req, res, next) =>
    {
        let subscriberId = req.params.id;
        Subscriber.findByIdAndRemove(subscriberId)
            .then(subscriber =>
            {
                req.flash("success", `${subscriber._id} の情報を削除しました。`);
                res.locals.redirect = "/dashboard/subscribers";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "アカウント情報を削除できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/subscribers";
                next();
            })
    },


    redirectView: (req, res, next) =>
    {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }

}

