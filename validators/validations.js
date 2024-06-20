const Joi = require("joi");

// const usersSchema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(50).required(),
//   email: Joi.string()
//     .email({ tlds: { allow: false } })
//     .required(),
//   password: Joi.string().min(6).max(100).required(),
// });

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const changepassSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = { signupSchema, signinSchema, changepassSchema };
