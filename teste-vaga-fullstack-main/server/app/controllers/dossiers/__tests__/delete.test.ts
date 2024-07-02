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

const docId = "65a68b5c2fea02c4f7e07cf1";

describe("POST /dossiers/delete", () => {
  it("return status code 201 if dossier is deleted", async () => {
    try {
      return request(serverApp)
        .delete(`/api/dossiers/delete/${docId}`)
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
