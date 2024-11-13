const Socket = require("socket.io");
const User = require("../Models/User");

const initializeSocket = (server) => {
  const io = Socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket initialization
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    // Update the socket id in the database
    if (userId) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { SocketId: socket.id }, // Update socket ID
          { new: true }
        );
        console.log(
          `User connected: ${updatedUser.firstName} with socket ID: ${socket.id}`
        );
      } catch (error) {
        console.error("Error updating SocketId:", error.message);
      }
    }

    // Listen for notification events
    socket.on("sendNotificationForConnection", async (data) => {
      const { ReceiverId, SenderId, Time } = data;

      try {
        const [Receiver, Sender] = await Promise.all([
          User.findById(ReceiverId),
          User.findById(SenderId),
        ]);

        if (Receiver) {
          Receiver.Notifications.push({
            NotificationType: "connection",
            NotificationText: `You are Connected With ${Sender.firstName} ${Sender.LastName}`,
            NotificationSender: SenderId,
            Time,
          });

          await Receiver.save();

          if (Receiver.SocketId) {
            io.to(Receiver.SocketId).emit("Noti-test", {
              text: `You are Connected With ${Sender.firstName}_${Sender.LastName}`,
            });
          }
        }
      } catch (error) {
        console.error("Error sending notification:", error.message);
      }
    });

    // Handle post notifications for user's connections
    socket.on("PostNotiToConnections", async (data) => {
      const { Time, postId } = data;
      try {
        const user = await User.findById(userId);
        const usersConnections = user.Connections.map(
          (conn) => conn.ConnectionsdId
        );
        // Send notifications to all connections in parallel
        await Promise.all(
          usersConnections.map(async (id) => {
            const connectionUser = await User.findById(id);
            if (connectionUser) {
              connectionUser.Notifications.push({
                NotificationType: "post",
                NotificationText: `${user.firstName} ${user.LastName} uploaded a post`,
                NotificationSender: user._id,
                Time,
                postId,
              });
              await connectionUser.save();
              if (connectionUser?.SocketId) {
                io.to(connectionUser?.SocketId).emit("Noti-test", {
                  text: `${user.firstName} ${user.LastName} uploaded a post`,
                });
              }
            }
          })
        );
      } catch (error) {
        console.error("Error notifying connections:", error.message);
      }
    });

    // Check notification
    socket.on("checkNotification", (data) => {
      if (data.socketId) {
        io.to(data.socketId).emit("updateNoti", { text: "success" });
      }
    });
    // send notificatio to receier for like post
    socket.on("LikeNotiToUploader", async (data) => {
      const { Time, postId,senderId } = data;
      try {
        const user = await User.findById(userId);
        const postSender = await User.findById(senderId);
        if (user && postSender) {
          postSender.Notifications.push({
            NotificationSender: user?._id,
            NotificationType: "post",
            NotificationText: `${user?.firstName} ${user?.LastName} Liked your post`,
            Time,
            postId
          })
          await postSender.save();
          if (postSender?.SocketId) {
            io.to(postSender?.SocketId).emit("Noti-test", {
                  text: `${user.firstName} ${user.LastName} Liked your post`,
                })
          }
        }
        // 
      } catch (err) {
        console.log(err);
        
      }
    })
      // send notificatio to receier for comment post
    socket.on("CommentNotiToUploader", async (data) => {
      const { Time, postId,senderId } = data;
      try {
        const user = await User.findById(userId);
        const postSender = await User.findById(senderId);
        if (user && postSender) {
          postSender.Notifications.push({
            NotificationSender: user?._id,
            NotificationType: "post",
            NotificationText: `${user?.firstName} ${user?.LastName} Commented to your post`,
            Time,
            postId
          })
          await postSender.save();
          if (postSender?.SocketId) {
            io.to(postSender?.SocketId).emit("Noti-test", {
                  text: `${user.firstName} ${user.LastName} Commented to your post`,
                })
          }
        }
        // 
      } catch (err) {
        console.log(err);
        
      }
    })
    // Handle socket disconnection
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);
      try {
        await User.findOneAndUpdate(
          { SocketId: socket.id },
          { SocketId: null } // Remove the SocketId on disconnect
        );
      } catch (error) {
        console.error("Error handling disconnect:", error.message);
      }
    });
  });
};

module.exports = initializeSocket;
