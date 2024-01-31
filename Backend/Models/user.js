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
  const schema = Joi.object({
    universityId: Joi.string().required(),
    universityPassword: Joi.string().required(),
    fullName: Joi.string().min(5).max(50).required(),
    fieldOfStudy: Joi.string().required(),
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(1024).required(),
    profilePicture: Joi.string().allow("", null), // Make profilePicture optional
  });

  return schema.validate(user);
}

module.exports.userValidator = userValidator;
module.exports.User = User;
