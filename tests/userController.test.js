const http = require("http");
const assert = require("assert");

const BASE_URL = "http://localhost:3000";
let testUserId = null;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsedBody = body ? JSON.parse(body) : null;
          resolve({ statusCode: res.statusCode, body: parsedBody });
        } catch {
          resolve({ statusCode: res.statusCode, body: body });
        }
      });
    });

    req.on("error", (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test suite
async function runTests() {
  console.log("🚀 Starting User Controller Test Suite\n");
  let passedTests = 0;
  let failedTests = 0;

  // Test 1: GET /users - Retrieve all users
  try {
    console.log("📝 Test 1: GET /users - Retrieve all users");
    const res = await makeRequest("GET", "/users");
    assert.strictEqual(res.statusCode, 200, "Should return 200 status");
    assert.ok(Array.isArray(res.body), "Should return an array");
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 2: POST /users - Create user with valid data
  try {
    console.log("📝 Test 2: POST /users - Create user with valid data");
    const userData = { name: "Test User", email: "test@example.com" };
    const res = await makeRequest("POST", "/users", userData);
    assert.strictEqual(res.statusCode, 201, "Should return 201 status");
    assert.ok(res.body.user, "Should return user object");
    assert.ok(res.body.user.id, "User should have an ID");
    testUserId = res.body.user.id; // Save for later tests
    console.log(`✅ PASSED (Created user ID: ${testUserId})\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 3: POST /users - Invalid name format
  try {
    console.log("📝 Test 3: POST /users - Invalid name format (with numbers)");
    const userData = { name: "Test123", email: "valid@example.com" };
    const res = await makeRequest("POST", "/users", userData);
    assert.strictEqual(res.statusCode, 400, "Should return 400 status");
    assert.ok(
      res.body.includes("Invalid name format"),
      "Should return validation error"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 4: POST /users - Invalid email format
  try {
    console.log("📝 Test 4: POST /users - Invalid email format");
    const userData = { name: "Valid Name", email: "invalid-email" };
    const res = await makeRequest("POST", "/users", userData);
    assert.strictEqual(res.statusCode, 400, "Should return 400 status");
    assert.ok(
      res.body.includes("Invalid email format"),
      "Should return validation error"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 5: PUT /users/:id - Full replacement with valid data
  try {
    console.log("📝 Test 5: PUT /users/:id - Full replacement with valid data");
    const userData = { name: "Updated User", email: "updated@example.com" };
    const res = await makeRequest("PUT", `/users/${testUserId}`, userData);
    assert.strictEqual(res.statusCode, 200, "Should return 200 status");
    assert.strictEqual(
      res.body.user.name,
      "Updated User",
      "Name should be updated"
    );
    assert.strictEqual(
      res.body.user.email,
      "updated@example.com",
      "Email should be updated"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 6: PUT /users/:id - Partial data should fail
  try {
    console.log("📝 Test 6: PUT /users/:id - Partial data should fail");
    const userData = { name: "Only Name" };
    const res = await makeRequest("PUT", `/users/${testUserId}`, userData);
    assert.strictEqual(
      res.statusCode,
      400,
      "Should return 400 for partial data"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 7: PATCH /users/:id - Update only name
  try {
    console.log("📝 Test 7: PATCH /users/:id - Update only name");
    const userData = { name: "Patched Name" };
    const res = await makeRequest("PATCH", `/users/${testUserId}`, userData);
    assert.strictEqual(res.statusCode, 200, "Should return 200 status");
    assert.strictEqual(
      res.body.user.name,
      "Patched Name",
      "Name should be updated"
    );
    assert.strictEqual(
      res.body.user.email,
      "updated@example.com",
      "Email should remain unchanged"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 8: PATCH /users/:id - Update only email
  try {
    console.log("📝 Test 8: PATCH /users/:id - Update only email");
    const userData = { email: "patched@example.com" };
    const res = await makeRequest("PATCH", `/users/${testUserId}`, userData);
    assert.strictEqual(res.statusCode, 200, "Should return 200 status");
    assert.strictEqual(
      res.body.user.email,
      "patched@example.com",
      "Email should be updated"
    );
    assert.strictEqual(
      res.body.user.name,
      "Patched Name",
      "Name should remain unchanged"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 9: PATCH /users/:id - No fields should fail
  try {
    console.log("📝 Test 9: PATCH /users/:id - No fields should fail");
    const userData = {};
    const res = await makeRequest("PATCH", `/users/${testUserId}`, userData);
    assert.strictEqual(res.statusCode, 400, "Should return 400 status");
    assert.ok(
      res.body.includes("At least one field"),
      "Should require at least one field"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 10: DELETE /users/:id - Delete existing user
  try {
    console.log("📝 Test 10: DELETE /users/:id - Delete existing user");
    const res = await makeRequest("DELETE", `/users/${testUserId}`);
    assert.strictEqual(res.statusCode, 200, "Should return 200 status");
    assert.ok(
      res.body.message.includes("deleted successfully"),
      "Should confirm deletion"
    );
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 11: GET /users/:id - Verify deletion (should fail)
  try {
    console.log("📝 Test 11: PUT /users/:id - User should not exist after deletion");
    const userData = { name: "Should Fail", email: "fail@example.com" };
    const res = await makeRequest("PUT", `/users/${testUserId}`, userData);
    assert.strictEqual(res.statusCode, 404, "Should return 404 status");
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Test 12: DELETE /users/:id - Delete non-existing user
  try {
    console.log("📝 Test 12: DELETE /users/:id - Delete non-existing user");
    const res = await makeRequest("DELETE", "/users/99999");
    assert.strictEqual(res.statusCode, 404, "Should return 404 status");
    console.log("✅ PASSED\n");
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    failedTests++;
  }

  // Summary
  console.log("=" .repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=" .repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);
  console.log(
    `🎯 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`
  );
  console.log("=" .repeat(50));

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error("💥 Test suite crashed:", error);
  process.exit(1);
});
