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

const query = {
  getTheLastThree: true,
};

describe("GET /dossiers/all", () => {
  it("return status code 201 if have dossiers saved", async () => {
    try {
      return request(serverApp)
        .get(`/api/dossiers/all?getTheLastThree=${query.getTheLastThree}`)
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
