const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: String,
    email: String,
    cpf: Number,
    birthday: Date,
    callNumber: String
}, {
    timestamps: true
});

module.exports = model("user", schema, "users");
