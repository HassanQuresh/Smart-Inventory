import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
dotenv.config();
const PORT = 5000;
async function startServer(){
  await connectDB();
  app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};
startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
})