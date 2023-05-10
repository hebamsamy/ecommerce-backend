import User from "./user.model.js";

async function addUser(data) {
  let res = await User.create(data);
  return res;
}

async function editUser(data) {
  let res = await User.updateOne({ _id: data.userId }, data);
  return res;
}

async function deleteUser(id) {
  let res = await User.findByIdAndDelete(id);
  return res;
}

async function getAllUsers() {
  let res = await User.find();
  return res;
}

async function getUser(email) {
  const res = await User.findOne({ email });
  return res;
}

async function getUserById(id) {
  const res = await User.findById(id);
  return res;
}

async function getUserByCode(verificationCode) {
  const res = await User.findOne({ verificationCode });
  return res;
}

const verify = async (userId) => {
  const user = await User.updateOne({ _id: userId }, { isVerified: true });
  return user;
};

export { addUser, editUser, deleteUser, getAllUsers, getUser, getUserById, getUserByCode, verify };
