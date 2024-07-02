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

const docId = "65a45dae5ab1aaa37f6f73a5";

describe("POST /logs/delete", () => {
  it("return status code 201 if log is deleted", async () => {
    try {
      return request(serverApp)
        .delete(`/api/logs/delete/${docId}`)
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
