const mongoose = require("mongoose"),
    { Schema } = mongoose,
    courseSchema = new Schema({
        title: {
            type: String,
            required: true,
            unique: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        items: [],
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    });


//SchemaModelの作成
module.exports = mongoose.model("Course", courseSchema);