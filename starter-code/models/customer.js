const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema ({
    username : String,
    password : String
}, {
    timeStamps : {
        createdAt : "created_at",
        updatedAt : "updated_at"
    }
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;