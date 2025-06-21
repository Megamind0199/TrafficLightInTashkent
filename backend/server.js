require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const cors = require("cors");
const path = require("path");

const trafficRoutes = require("./routes/trafficRoute");
const switchTrafficLights = require("./services/cronService");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

global.io = io;

app.use(express.json());
app.use(cors());

app.use("/api", trafficRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });


app.all('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


setInterval(switchTrafficLights, 60000);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
  });
});

io.on("connection", (socket) => {
  console.log("🔌 Yangi client ulandi:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client uzildi:", socket.id);
  });
});
