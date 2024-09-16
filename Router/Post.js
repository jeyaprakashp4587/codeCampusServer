const express = require("express");
const router = express.Router();
const { DB2 } = require("../Database/DB");
const User = require("../Models/User");
const { mongoose } = require("mongoose");

// upload the post

router.post("/uploadPost", async (req, res) => {
  const { userId, Images, postText, postLink, Time } = req.body;
  // console.log(Images);
  // find the user
  const user = await User.findById(userId);
  const newPost = {
    PostText: postText,
    PostLink: postLink,
    Images: Images,
    Time: Time,
    Like: 0,
    SenderName: user.firstName + user.LastName,
    SenderProfile: user.Images.profile,
    SenderInstitute: user.InstitudeName,
  };
  if (user) {
    user.Posts.push(newPost);
    await user.save();
    // save the post to connections
    const postId = user.Posts[user.Posts.length - 1]._id;
    user.Connections.forEach(async (connectionid) => {
      // console.log(connectionid.ConnectionsdId);
      const connection = await User.findById(connectionid.ConnectionsdId);
      if (connection) {
        connection.ConnectionsPost.push({ postId: postId });
        await connection.save();
      }
    });
    res.send("Uploaded");
  }
});
// delete post
router.post("/deletePost/:id", async (req, res) => {
  const { postId } = req.body;
  const { id } = req.params;
  console.log(postId, id);
  // find user
  const user = await User.findById(id);
  if (user) {
    user.Posts = user.Posts.filter((post) => post._id.toString() !== postId);
    await user.save();
    res.send(user);
  }
});
// get connections post
router.get("/getConnectionPosts/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Find the user by userId
    const user = await User.findById(userId).exec();
    if (user) {
      // Get the post IDs from ConnectionsPost
      const postIds = user.ConnectionsPost.map((post) => post.postId);
      // Fetch all the posts that match the IDs from all users
      const posts = await User.aggregate([
        { $unwind: "$Posts" },
        {
          $match: {
            "Posts._id": {
              $in: postIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        { $project: { Posts: 1, _id: 0 } },
      ]);
      // Extract Posts from the aggregation result
      const extractedPosts = posts.map((post) => post.Posts);
      res.status(200).send(extractedPosts);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    console.log("small Update");
    res.status(500).send("An error occurred while fetching connection posts.");
  }
});
// like post
router.post("/likePost/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // Increment the Like count for the post with the given postId
    const post = await User.findOneAndUpdate(
      { "Posts._id": postId },
      { $inc: { "Posts.$.Like": 1 } }, // Increment Like field by 1
      { new: true } // Return the updated document
    );

    if (post) {
      res.status(200).json({ message: "Post liked successfully", post });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post." });
  }
});

module.exports = router;
