const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { DB1 } = require("../Database/CCDB");

//
router.post("/addChallenge", async (req, res) => {
  const {
    userId,
    ChallengeName,
    ChallengeType,
    ChallengeImage,
    ChallengeLevel,
  } = req.body;
  // console.log(
  //   userId,
  //   ChallengeName,
  //   ChallengeType,
  //   ChallengeImage,
  //   ChallengeLevel
  // );
  // find th ChallengeType
  let ChType;
  switch (ChallengeType) {
    case "HTML":
      ChType = "Web Development";
      break;
    case "Swift":
      ChType = "App Development";
      break;
    case "React Native":
      ChType = "App Development";
      break;
    case "Kotlin":
      ChType = "App Development";
      break;
    default:
      break;
  }

  const user = await User.findById(userId);
  if (user) {
    // check exists challenge
    const existsChallenge = user.Challenges.some(
      (ch) => ch.ChallengeName === ChallengeName
    );
    if (!existsChallenge) {
      user.Challenges.push({
        ChallengeName: ChallengeName,
        status: "pending",
        ChallengeType: ChType,
        ChallengeImage: ChallengeImage,
        ChallengeLevel: ChallengeLevel,
      });
      // console.log(user);
      await user.save();
    }
  }
});
// submit the project
router.post("/uploadChallenge/:id", async (req, res) => {
  const { GitRepo, LiveLink, SnapImage, ChallengeName } = req.body;
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    const findChallenge = user.Challenges.find(
      (ch) => ch.ChallengeName == ChallengeName
    );
    if (findChallenge) {
      findChallenge.RepoLink = GitRepo;
      findChallenge.SnapImage = SnapImage;
      findChallenge.LiveLink = LiveLink;
      findChallenge.status = "completed";
    }
    await user.save();
    res.send("completed");
  }
  // console.log(GitRepo, LiveLink, SnapImage);
});
// get tha all chalenges from appDatabase
router.post("/getChallenges", async (req, res) => {
  const { ChallengeTopic } = req.body;
  // console.log(ChallengeTopic);
  const Collection = DB1.collection("Challenges");
  const findChallengeTopic = await Collection.findOne({ ChallengeTopic });
  // console.log(findChallengeTopic);
  if (findChallengeTopic) {
    res.send(findChallengeTopic.Challenges);
  }
});
// get the user challenges from DB
router.post("/getUserChallege/:id", async (req, res) => {
  const { id } = req.params;
  const { option } = req.body;
  console.log(option);
  // find user
  const user = await User.findById(id);
  if (user) {
    switch (option) {
      case "All":
        res.send(user.Challenges);
        break;
      case "Complete":
        const completed = user.Challenges.filter(
          (ch) => ch.status === "completed"
        );
        res.send(completed);
        break;
      case "Pending":
        const pending = user.Challenges.filter((ch) => ch.status === "pending");
        res.send(pending);
        break;
    }
  }
});
// check selected challenge is status
router.post("/checkChallengeStatus/:id", async (req, res) => {
  const { ChallengeName } = req.body;
  const { id } = req.params;
  // console.log(ChallengeName);
  // find user
  const user = await User.findById(id);

  if (user) {
    // console.log(user);
    const findChallenge = user.Challenges.find(
      (ch) => ch.ChallengeName === ChallengeName
    );
    // console.log(findChallenge);
    switch (findChallenge?.status) {
      case "pending":
        res.send("pending");
        break;
      case "completed":
        res.send("completed");
      default:
        break;
    }
  }
});
// get particular Challenge by its name when initially
router.post("/getParticularChallenge/:id", async (req, res) => {
  const { id } = req.params;
  const { ChallengeName, ChallengeType, ChallengeLevel } = req.body;
  // console.log(ChallengeName, ChallengeType, ChallengeLevel);
  const collection = DB1.collection("Challenges");
  const findTopic = await collection.findOne({ ChallengeTopic: ChallengeType });
  // console.log(findTopic);
  let findChallenge;
  switch (ChallengeLevel) {
    case "newbie":
      findChallenge = findTopic?.Challenges.newbieLevel.find(
        (ch) => ch.title == ChallengeName
      );
      res.send(findChallenge);
      // console.log(findChallenge);
      break;
    case "Junior":
      findChallenge = findTopic.Challenges.juniorLevel.find(
        (ch) => ch.title == ChallengeName
      );
      // console.log(findChallenge);
      res.send(findChallenge);
      break;

    case "Expert":
      findChallenge = findTopic.Challenges.expertLevel.find(
        (ch) => ch.title == ChallengeName
      );
      // console.log(findChallenge);
      res.send(findChallenge);
      break;

    case "Legend":
      findChallenge = findTopic.Challenges.legendLevel.find(
        (ch) => ch.title == ChallengeName
      );
      // console.log(findChallenge);
      res.send(findChallenge);
      break;

    default:
      break;
  }
});
module.exports = router;
