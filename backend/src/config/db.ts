import mongoose from "mongoose";
import dns from "node:dns";
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
    if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()));
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("querySrv")) {
      console.error(
        "MongoDB Atlas DNS SRV lookup failed. Check your network, or try adding DNS_SERVERS=8.8.8.8 to your .env file.",
      );
    }

    throw error;
  }

  console.log("🍃 MongoDB Connected Successfully");
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
