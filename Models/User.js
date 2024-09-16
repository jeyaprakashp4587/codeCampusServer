const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DB2 } = require("../Database/DB");

const UserSchema = new Schema({
  firstName: String,
  LastName: String,
  Email: String,
  Password: String,
  Gender: String,
  DateOfBirth: String,
  Degreename: String,
  InstitudeName: String,
  State: String,
  District: String,
  Nationality: String,
  Bio: String,
  Images: {
    profile: String,
    coverImg: String,
  },
  Posts: [],
  Followers: [],
  Following: [],
  Courses: [{ Course_Name: String, Technologies: [] }],
  Reawards: [],
  Challenges: [
    {
      ChallengeName: String,
      ChallengeImage: String,
      ChallengeLevel: String,
      status: String,
      RepoLink: String,
      LiveLink: String,
      SnapImage: String,
      ChallengeType: String,
    },
  ],
  Activities: [{}],
});

module.exports = DB2.model("user", UserSchema);
