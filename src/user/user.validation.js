const signUp = {
  type: "object",
  required: ["fname", "lname", "email", "password", "nId", "picture", "address", "phone"],
  properties: {
    fname: { type: "string" },
    lname: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
    nId: { type: "string" },
    picture: { type: "string" },
    address: {
      type: "object",
      properties: {
        city: { type: "string" },
        street: { type: "string" },
      },
    },
    phone: { type: "string" },
  },
  additionalProperties: false,
};
const signIn = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
};

const editUser = {
  type: "object",
  required: ["userId"],
  properties: {
    userId: { type: "string" },
    fname: { type: "string" },
    lname: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
    picture: { type: "string" },
    address: {
      type: "object",
      properties: {
        city: { type: "string" },
        street: { type: "string" },
      },
    },
    phone: { type: "string" },
  },
};

const deleteUser = {
  type: "object",
  properties: {
    userId: { type: "string" },
  },
};

const verifyUser = {
  type: "object",
  required: ["verificationCode"],
  properties: {
    verificationCode: { type: "string" },
  },
};

export { signUp, signIn, editUser, deleteUser, verifyUser };
