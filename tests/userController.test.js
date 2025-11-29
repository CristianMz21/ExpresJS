const request = require("supertest");
const app = require("../src/app");

describe("User Controller", () => {
  let testUserId;
  const timestamp = Date.now();
  const testEmail = `test_${timestamp}@example.com`;

  it("GET /users - Retrieve all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  it("POST /users - Create user with valid data", async () => {
    const userData = { name: "Test User", email: testEmail };
    const res = await request(app).post("/users").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("id");
    testUserId = res.body.data.user.id;
  });

  it("POST /users - Invalid name format", async () => {
    const userData = { name: "Test123", email: "valid@example.com" };
    const res = await request(app).post("/users").send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("POST /users - Invalid email format", async () => {
    const userData = { name: "Valid Name", email: "invalid-email" };
    const res = await request(app).post("/users").send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("PUT /users/:id - Full replacement with valid data", async () => {
    const userData = { name: "Updated User", email: "updated@example.com" };
    const res = await request(app).put(`/users/${testUserId}`).send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.name).toBe("Updated User");
    expect(res.body.data.user.email).toBe("updated@example.com");
  });

  it("PUT /users/:id - Partial data should fail", async () => {
    const userData = { name: "Only Name" };
    const res = await request(app).put(`/users/${testUserId}`).send(userData);
    expect(res.statusCode).toBe(400);
  });

  it("PATCH /users/:id - Update only name", async () => {
    const userData = { name: "Patched Name" };
    const res = await request(app).patch(`/users/${testUserId}`).send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.name).toBe("Patched Name");
    expect(res.body.data.user.email).toBe("updated@example.com");
  });

  it("PATCH /users/:id - Update only email", async () => {
    const userData = { email: "patched@example.com" };
    const res = await request(app).patch(`/users/${testUserId}`).send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe("patched@example.com");
    expect(res.body.data.user.name).toBe("Patched Name");
  });

  it("PATCH /users/:id - No fields should fail", async () => {
    const res = await request(app).patch(`/users/${testUserId}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("DELETE /users/:id - Delete existing user", async () => {
    const res = await request(app).delete(`/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
  });

  it("PUT /users/:id - User should not exist after deletion", async () => {
    const userData = { name: "Should Fail", email: "fail@example.com" };
    const res = await request(app).put(`/users/${testUserId}`).send(userData);
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /users/:id - Delete non-existing user", async () => {
    const res = await request(app).delete("/users/99999");
    expect(res.statusCode).toBe(404);
  });
});
