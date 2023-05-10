export const buildUserResponseDTO = (user) => ({
  id: user._id,
  firstName: user.fname,
  lastName: user.lname,
  email: user.email,
  emailVerified: Boolean(user.isVerified),
  phone: user.phone,
  picture: user.picture,
  address: user.address,
  isAdmin: Boolean(user.isAdmin),
});
