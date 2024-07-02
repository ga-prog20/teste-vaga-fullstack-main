import mongoose from "mongoose";
import request from "supertest";

// services
import { serverApp } from "../../../server";
import serverDb from "../../../services/db";

beforeAll(async () => {
  await serverDb();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /logs/create", () => {
  it("return status code 201 if new log is saved", async () => {
    try {
      return request(serverApp)
        .post("/api/logs/create")
        .send({
          message: "iniciou uma nova sessão",
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((res) => {
          expect(res.body.success).toEqual(true);
        });
    } catch (err) {
      console.error("Failed to execute operation:", err);
    }
  });
});
