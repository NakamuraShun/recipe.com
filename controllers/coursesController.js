const
    mongoose = require("mongoose"),
    Course = require("../models/course");


module.exports = {
    getAll: (req, res, next) =>
    {
        Course.find({})
            .then(courses =>
            {
                res.render("dashboard/courses", { "courses": courses });

            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },


    showList: (req, res, next) =>
    {
        Course.find({})
            .then(courses =>
            {
                res.render("courses", { "courses": courses });

            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },



    getAllByJson: (req, res, next) =>
    {
        Course.find({})
            .then(courses =>
            {
                res.json(courses);

            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },



    create: (req, res, next) =>
    {
        let newCourseData = {
            title: req.body.title,
            description: req.body.description,
            items: req.body.items
        };

        Course.create(newCourseData)
            .then((course) =>
            {
                req.flash("success", `ありがとうございます。コース名「${course.title}」を新規登録しました。`);
                res.locals.redirect = "/newcourse";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "コース情報の作成ができませんでした。全ての項目を入力して再度お試しください。");
                res.locals.redirect = "/newcourse";
                next();
            })
    },

    show: (req, res, next) =>
    {
        let courseId = req.params.id;
        Course.findById(courseId)
            .then(course =>
            {
                res.render("dashboard/show-course", { "course": course });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    edit: (req, res) =>
    {
        let courseId = req.params.id;
        Course.findById(courseId)
            .then(course =>
            {
                res.render("dashboard/edit-course", { "course": course });
            })
            .catch(error =>
            {
                console.log("error.message");
                return [];
            })
    },

    update: (req, res, next) =>
    {
        let updateCourseData = {
            title: req.body.title,
            description: req.body.description,
            items: req.body.items
        };

        let courseId = req.params.id;
        Course.findByIdAndUpdate(courseId, { $set: updateCourseData })
            .then(course =>
            {
                req.flash("success", `${course._id} の情報が更新されました。`);
                res.locals.redirect = "/dashboard/courses";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "コース情報更を更新できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/courses";
                next();
            })
    },

    delete: (req, res, next) =>
    {
        let courseId = req.params.id;
        Course.findByIdAndRemove(courseId)
            .then(course =>
            {
                req.flash("success", `${course._id} の情報を削除しました。`);
                res.locals.redirect = "/dashboard/courses";
                next();
            })
            .catch(error =>
            {
                req.flash("error", "コース情報を削除できませんでした。お手数おかけしますが再度お試しください。");
                res.locals.redirect = "/dashboard/courses";
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
