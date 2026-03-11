// config/db.js
import { connect } from 'mongoose';
import { app } from './app.js';
import {connection} from './bullmq/redisdb.js'
import { worker} from "./bullmq/worker.js"
import { emailqueue } from "./bullmq/producer.js"
const connectDB = async () => {
  try {
    const conn = await connect("mongodb+srv://luckyali7666_db_user:bwr2ocmPVUaJ0ihf@cluster0.ar6iazd.mongodb.net/project222");
    app.listen(8000,()=>{
      console.log("server is listening on port 8000")
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
connection.on("connect", () => {
  console.log("✅ Redis connected");
});
connection.on("error", (err) => {
  console.error("❌ Redis error:", err);
});
connectDB();
export default connectDB;