const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Subscriber = require("./subscriber"),
    { Schema } = mongoose,
    userSchema = new Schema({
        name: {
            first: {
                type: String,
                required: true
            },
            last: {
                type: String,
                required: true
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }],
        subscribedAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscriber"
        }
    }, {
        timestamps: true //createAtとupdateAtの日時を記録
    }
    );

//passportがパスワードの自動保存を行う
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

//pre(既存購読者との一致確認)
userSchema.pre("save", function (next)
{
    let newUser = this;
    if (newUser.subscribedAccount === undefined)
    {
        Subscriber.findOne({ email: newUser.email })
            .then(subscriber =>
            {
                newUser.subscribedAccount = subscriber;
                next();
            })
            .catch(error =>
            {
                console.log("一致するsubscriberアカウントなしで新規登録");
                next(error);
            });
    } else
    {
        next();
    };
});




//SchemaModelの作成
module.exports = mongoose.model("User", userSchema);