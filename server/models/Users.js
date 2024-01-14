import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true},
    password: {type: String, required: true},
    cartData: {type: Object},
    date: {type: Date, default: Date.now},
})

const Users = mongoose.model("Users", UserSchema);

export default Users;