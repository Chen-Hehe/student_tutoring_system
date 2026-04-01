const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ 不再需要这些选项，但保留以供参考
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB 连接成功：${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB 连接失败：${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
