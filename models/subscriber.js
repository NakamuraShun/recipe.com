const mongoose = require("mongoose"),
    { Schema } = mongoose,
    subscriberSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        }
    });


//SchemaModelの作成
module.exports = mongoose.model("Subscriber", subscriberSchema);