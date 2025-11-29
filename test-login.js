/**
 * Script de prueba para verificar el login
 */

async function testLogin() {
  const baseUrl = "http://localhost:3000";
  const testUser = {
    email: "test_login@example.com",
    username: "testlogin",
    password: "SecurePass123!",
  };

  try {
    console.log("🔐 Testing Login Flow...\n");

    // 0. Crear usuario de prueba
    console.log("0️⃣ Creating test user...");
    const createResponse = await fetch(`${baseUrl}/db-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const createData = await createResponse.json();
    
    if (createResponse.ok) {
      console.log("✅ Test user created successfully");
      console.log("User ID:", createData.data.user.id);
      console.log("");
    } else if (createResponse.status === 409) {
      console.log("ℹ️  Test user already exists (skipping creation)");
      console.log("");
    } else {
      console.log("❌ Failed to create user:", createData);
      return;
    }

    // 1. Intentar login con el usuario de prueba
    console.log("1️⃣ Attempting login...");
    const loginResponse = await fetch(`${baseUrl}/db-users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
      console.log("✅ Login successful!");
      console.log("Token:", loginData.token.substring(0, 50) + "...");
      console.log("User data:", loginData.data);
      console.log("");

      // 2. Usar el token para acceder a ruta protegida
      console.log("2️⃣ Testing protected route with token...");
      const protectedResponse = await fetch(`${baseUrl}/db-users`, {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          Accept: "application/json",
        },
      });

      if (protectedResponse.ok) {
        const users = await protectedResponse.json();
        console.log("✅ Protected route access successful!");
        console.log(`Found ${users.results} users in database`);
        console.log("");
      } else {
        const error = await protectedResponse.json();
        console.log("❌ Protected route failed:", error);
      }

      // 3. Intentar acceder sin token (debe fallar)
      console.log("3️⃣ Testing protected route WITHOUT token...");
      const noTokenResponse = await fetch(`${baseUrl}/db-users`, {
        headers: { Accept: "application/json" },
      });

      if (noTokenResponse.status === 401) {
        console.log("✅ Correctly rejected request without token");
        const error = await noTokenResponse.json();
        console.log("Error message:", error.error);
        console.log("");
      } else {
        console.log("❌ Should have rejected request without token!");
      }

      // 4. Test con credenciales incorrectas
      console.log("4️⃣ Testing login with wrong password...");
      const wrongPassResponse = await fetch(`${baseUrl}/db-users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: "WrongPassword123",
        }),
      });

      if (wrongPassResponse.status === 401) {
        console.log("✅ Correctly rejected wrong password");
        const error = await wrongPassResponse.json();
        console.log("Error message:", error.message);
      } else {
        console.log("❌ Should have rejected wrong password!");
      }

      console.log("\n🎉 All tests passed!");
    } else {
      console.log("❌ Login failed:", loginData);
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
    console.log("\nℹ️  Make sure the server is running: yarn start");
  }
}

testLogin();
