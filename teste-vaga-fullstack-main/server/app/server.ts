import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import * as useragent from "express-useragent";
import cors from "cors";

// routes
import { routes } from "./routes/all";

// database
import serverDb from "./services/db";

dotenv.config(); // try load environment variables
const serverApp: Application = express();

// services
if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  serverDb();
}

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
};
serverApp.use(cors());
serverApp.use(useragent.express());

// middlewares
serverApp.use(express.json({ limit: "33gb" }));
serverApp.use(express.urlencoded({ extended: true }));

// routes
serverApp.get("/", (req: Request, res: Response) => {
  res.send("Welcome to File Import!");
});
serverApp.use("/api", routes);
serverApp.use(express.urlencoded({ limit: "33gb", extended: true }));

const httpServer = createServer(serverApp);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
serverApp.set('io', io);

io.on("connection", (socket) => {
  console.log("User connected.");
  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

export { serverApp, httpServer };
