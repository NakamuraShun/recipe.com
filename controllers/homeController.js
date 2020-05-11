const
    mongoose = require("mongoose"),
    Contact = require("../models/contact");


module.exports = {
    getAll: (req, res, next) =>
    {
        Contact.find({})
            .then(contacts =>
            {
                res.render("dashboard/contacts", { "contacts": contacts });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    create: (req, res, next) =>
    {
        let newContactData = {
            name: req.body.name,
            email: req.body.email,
            title: req.body.title,
            coment: req.body.coment
        };
        Contact.create(newContactData)
            .then(contact =>
            {
                req.flash("success", `お問い合わせありがとうございます。タイトル「${contact.title}」を送信しました。`);
                res.locals.redirect = "/contact";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "送信できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/contact";
                next();
            })
    },


    show: (req, res) =>
    {
        let contactId = req.params.id;
        Contact.findById(contactId)
            .then(contact =>
            {
                res.render("dashboard/show-contact", { "contact": contact });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },


    delete: (req, res, next) =>
    {
        let contactId = req.params.id;
        Contact.findByIdAndRemove(contactId)
            .then(contact =>
            {
                req.flash("success", `${contact._id} のお問い合わせ情報を削除しました。`);
                res.locals.redirect = "/dashboard/contacts";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "お問い合わせ情報を削除できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/contacts";
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