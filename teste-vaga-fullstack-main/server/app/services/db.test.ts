import mongoose from "mongoose";

// services
import serverDb from "./db";

// models
import { Log } from "../models/log";
import { Import } from "../models/form/imports";

beforeAll(async () => {
  await serverDb();
});

afterAll(async () => {
  await mongoose.connection.close();
});

it("should create logs collection if they do not exist", async () => {
  const logsCollection = mongoose.connection.collections["logs"];

  if (!logsCollection) {
    Log.createCollection().then(() => console.log("Logs collection created."));
  }
  expect(logsCollection).toBeDefined();
});

it("should create collections if they do not exist", async () => {
  const importsCollection = mongoose.connection.collections["imports"];

  if (!importsCollection) {
    Import.createCollection().then(() =>
      console.log("Imports collection created.")
    );
  }
  expect(importsCollection).toBeDefined();
});
