const mongoose = require("mongoose"),
    { Schema } = mongoose,
    contactSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        title: {
            type: String,
            required: true,
            required: true
        },
        coment: {
            type: String,
            required: true
        }
    }, {
        timestamps: true //createAtとupdateAtの日時を記録
    }
    );



//SchemaModelの作成
module.exports = mongoose.model("Contact", contactSchema);