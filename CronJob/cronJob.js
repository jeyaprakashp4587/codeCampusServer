const cron = require('node-cron');
const User = require('../Models/User');  // Adjust path if needed

// Function to delete old notes
async function deleteOldNotes() {
  try {
    const now = new Date();
    const expiryTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Remove old notes from all users' ConnectionsNotes
    const result = await User.updateMany(
      {},
      {
        $pull: {
          ConnectionsNotes: {
            createdAt: { $lt: expiryTime },
          },
        },
      }
    );

    console.log(`Deleted notes for ${result.nModified} users.`);
  } catch (error) {
    console.error('Error during scheduled note deletion:', error);
  }
}

// Function to schedule the cron job
function scheduleCronJob() {
  cron.schedule('0 * * * *', deleteOldNotes); // Run every hour
  console.log("Cron job for deleting notes scheduled.");
}

// Export the function
module.exports = { scheduleCronJob };
