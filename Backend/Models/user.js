const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    universityId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    fieldOfStudy: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    clubAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    profilePicture: {
      type: String,
      required: false,
      default: "https://source.unsplash.com/random/200x200?sig=1",
    },
    activities: {
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Announcement",
        },
      ],
    },
    clubMemberships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
    pendingClubRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

userSchema.statics.updateLikes = async function (announcementId) {
  return this.updateMany(
    { "activities.likes": { $in: [announcementId] } },
    { $pull: { "activities.likes": announcementId } }
  );
};

function userValidator(user) {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const schema = Joi.object({
    universityId: Joi.string().required().messages({
      "any.required": "University ID is required.",
    }),
    universityPassword: Joi.string().required().messages({
      "any.required": "University password is required.",
    }),
    fullName: Joi.string()
      .min(5)
      .max(50)
      .pattern(/^[a-zA-Z\s]*$/)
      .required()
      .messages({
        "string.min": "Full name must be at least {#limit} characters long.",
        "string.max": "Full name must not exceed {#limit} characters.",
        "string.pattern.base":
          "Full name must contain only letters and spaces, without numbers or special characters.",
        "any.required": "Full name is required.",
      }),
    fieldOfStudy: Joi.string().required().messages({
      "any.required": "Field of study is required.",
    }),
    username: Joi.string().min(5).max(255).required().messages({
      "string.min": "Username must be at least {#limit} characters long.",
      "string.max": "Username must not exceed {#limit} characters.",
      "any.required": "Username is required.",
    }),
    password: Joi.string().pattern(passwordPattern).required().messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.",
      "any.required": "Password is required.",
    }),
    profilePicture: Joi.string().allow("", null).messages({
      "string.allowOnly": "Profile picture must be a valid URL or left empty.",
    }),
  });

  return schema.validate(user, { abortEarly: false }); // Return all validation errors at once
}

module.exports.userValidator = userValidator;
module.exports.User = User;
