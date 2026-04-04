const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected".green))
    .catch((err) => console.log(err))
}

module.exports = connectDB
