const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Database User Controller", () => {
  let testUserId;
  let authToken;

  // Optional: Clean up database before/after tests
  // beforeAll(async () => { ... });
  // afterAll(async () => { await prisma.$disconnect(); });

  it("POST /db-users - Create user with valid data", async () => {
    const userData = {
      email: "testdb_jest@example.com",
      username: "testdbuser_jest",
      password: "SecurePass123",
      role: "USER",
    };
    
    // Clean up if exists
    try {
        const existing = await prisma.user.findFirst({ where: { email: userData.email } });
        if (existing) await prisma.user.delete({ where: { id: existing.id } });
    } catch (e) {
        // Ignore
    }

    const res = await request(app).post("/db-users").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("id");
    testUserId = res.body.data.user.id;
  });

  it("POST /db-users - Missing required fields", async () => {
    const userData = { email: "incomplete@example.com" };
    const res = await request(app).post("/db-users").send(userData);
    expect(res.statusCode).toBe(400);
  });

  it("POST /db-users - Invalid email format", async () => {
    const userData = {
      email: "invalid-email",
      username: "testuser2",
      password: "password123",
    };
    const res = await request(app).post("/db-users").send(userData);
    expect(res.statusCode).toBe(400);
  });

  it("POST /db-users - Password too short", async () => {
    const userData = {
      email: "test2@example.com",
      username: "testuser3",
      password: "123",
    };
    const res = await request(app).post("/db-users").send(userData);
    expect(res.statusCode).toBe(400);
  });

  it("POST /db-users - Duplicate email", async () => {
    const userData = {
      email: "testdb_jest@example.com",
      username: "anotheruser",
      password: "SecurePass123",
    };
    const res = await request(app).post("/db-users").send(userData);
    expect(res.statusCode).toBe(409);
  });

  it("POST /db-users/login - Successful login", async () => {
    const credentials = {
      email: "testdb_jest@example.com",
      password: "SecurePass123",
    };
    const res = await request(app).post("/db-users/login").send(credentials);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body).toHaveProperty("token");
    authToken = res.body.token;
  });

  it("POST /db-users/login - Invalid credentials", async () => {
    const credentials = {
      email: "testdb_jest@example.com",
      password: "WrongPassword",
    };
    const res = await request(app).post("/db-users/login").send(credentials);
    expect(res.statusCode).toBe(401);
  });

  it("GET /db-users - Get all users (with auth)", async () => {
    const res = await request(app)
      .get("/db-users")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  it("GET /db-users/:id - Get user by ID", async () => {
    const res = await request(app).get(`/db-users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.id).toBe(testUserId);
  });

  it("GET /db-users/:id - Invalid ID format", async () => {
    const res = await request(app).get("/db-users/invalid-id");
    expect(res.statusCode).toBe(400);
  });
  

  it("PATCH /db-users/:id - Update username", async () => {
    const updates = { username: "updateddbuser_jest" };
    const res = await request(app).patch(`/db-users/${testUserId}`).send(updates); 

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.username).toBe("updateddbuser_jest");
  });

  it("PATCH /db-users/:id - Empty update should fail", async () => {
    const res = await request(app).patch(`/db-users/${testUserId}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("PATCH /db-users/:id/password - Update password", async () => {
    const passwordUpdate = {
      currentPassword: "SecurePass123",
      newPassword: "NewSecurePass456",
    };
    const res = await request(app)
      .patch(`/db-users/${testUserId}/password`)
      .send(passwordUpdate);
    expect(res.statusCode).toBe(200);
    
    // Re-authenticate with new password to get fresh token
    const loginRes = await request(app).post("/db-users/login").send({
      email: "testdb_jest@example.com",
      password: "NewSecurePass456",
    });
    authToken = loginRes.body.token;
  });

  it("PATCH /db-users/:id/password - Wrong current password", async () => {
    const passwordUpdate = {
      currentPassword: "WrongPassword",
      newPassword: "AnotherNewPass789",
    };
    const res = await request(app)
      .patch(`/db-users/${testUserId}/password`)
      .send(passwordUpdate);
    expect(res.statusCode).toBe(401);
  });

  it("POST /db-users/login - Login with new password", async () => {
    const credentials = {
      email: "testdb_jest@example.com",
      password: "NewSecurePass456",
    };
    const res = await request(app).post("/db-users/login").send(credentials);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("DELETE /db-users/:id - Delete user", async () => {
    const res = await request(app).delete(`/db-users/${testUserId}`);
    expect(res.statusCode).toBe(204);
  });

  it("GET /db-users/:id - Verify deletion", async () => {
    const res = await request(app).get(`/db-users/${testUserId}`);
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /db-users/:id - Delete non-existing user", async () => {
    // Use a valid UUID format that doesn't exist
    const res = await request(app).delete("/db-users/00000000-0000-0000-0000-000000000000");
    expect(res.statusCode).toBe(404);
  });
});
