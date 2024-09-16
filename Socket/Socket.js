const Socket = require("socket.io");
const User = require("../Models/User");

const initializeSocket = (server) => {
  const io = Socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  // socket initialize
  io.on("connection", async (socket) => {
    // user Id
    const userId = socket.handshake.query.userId;
    // update the socket id
    if (userId) {
      // console.log("one user Connected", socket.id);
      await User.findByIdAndUpdate(
        userId,
        { SocketId: socket.id },
        { new: true }
      );
      const user = await User.findById(userId);
      if (!user.SocketId) {
        user.SocketId = socket.id;
        await user.save();
      }
    }
    socket.on("test", (data) => {
      // console.log(data);
    });

    //  send notification when sender make a friend request

    socket.on("sendNotificationToUser", async (data) => {
      const { ReceiverId, SenderId, Time } = data;
      // find sender
      // console.log(Time);
      const Receiver = await User.findById(ReceiverId);
      const sender = await User.findById(SenderId);
      if (Receiver) {
        Receiver.Notifications.push({
          NotificationType: "connection",
          NotificationText: `You are Connected With ${
            sender.firstName + sender.LastName
          }`,
          NotificationSender: SenderId,
          NotificationSenderProfile: sender.Images.profile,
          Time: Time,
        });
        await Receiver.save();
        io.to(Receiver.SocketId).emit("Noti-test", {
          text: `You are Connected With ${
            sender.firstName + "_" + sender.LastName
          }`,
        });
      }
    });

    //socket disconnect
    socket.on("disconnect", () => {
      // console.log("one user leave", socket.id);
    });
  });
  // return io;
};

module.exports = initializeSocket;
