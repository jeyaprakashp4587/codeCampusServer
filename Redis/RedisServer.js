const redisInit = require('redis');

const client = redisInit.createClient({
  url: 'redis://<host>:<port>',
});

client.connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

client.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = client;
