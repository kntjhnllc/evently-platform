import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false, default: ""},
    photo: {type: String, required: true},
})


// Middleware to handle null lastName before saving
UserSchema.pre('save', function (next) {
    if (this.lastName === null) {
        this.lastName = "";
    }
    next();
});

const User = models.User || model('User', UserSchema)

export default User;