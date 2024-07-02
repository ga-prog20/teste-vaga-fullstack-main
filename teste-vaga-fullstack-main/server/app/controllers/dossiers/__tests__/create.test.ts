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

describe("POST /dossiers/create", () => {
  it("return status code 201 if new dossier is saved", async () => {
    try {
      return request(serverApp)
        .post("/api/dossiers/create")
        .send({
          slug: "a627bb3d-6ce8-4bbb-be9f-d5a622828836",
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
