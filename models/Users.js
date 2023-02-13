import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
  roles: {
    type: Array,
    required: false,
  },
  basket: {
    type: Object,
    required: false,
  },
});

export default mongoose.model("Users", UsersSchema);
