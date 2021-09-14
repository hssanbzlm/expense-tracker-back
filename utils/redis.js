const redis = require("redis");

const client = redis.createClient({});
client.connect().catch((err) => console.log(err));
module.exports.redisClient = client;
