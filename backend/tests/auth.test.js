const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); 
const db = require("../config/database");

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth API Unit Tests", () => {

  let token; 
  let createdUserId;

  before(async () => {
    console.log("Connecting to Test Database...");
    await db.sequelize.sync({ force: false }); 
  });

  it("should register a new user successfully", async () => {
    const res = await chai.request(app)
      .post("/user/create-account")
      .send({
        full_name: "Test User",
        email_address: "testuser@example.com",
        password: "password123"
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body.user).to.have.property("id");
    expect(res.body.user).to.have.property("email_address", "testuser@example.com");

    createdUserId = res.body.user.id;
    console.log("User created with ID:", createdUserId);
  });

  it("should login successfully and return a valid token", async () => {
    const res = await chai.request(app)
      .post("/user/login-account")
      .send({
        email_address: "testuser@example.com",
        password: "password123"
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
    token = res.body.token;
    console.log("Received JWT token:", token.substring(0, 20) + "...");
  });

  it("should fetch the current logged-in user", async () => {
    const res = await chai.request(app)
      .get("/user/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("email_address", "testuser@example.com");
    console.log("👤 Current user fetched successfully.");
  });

  it("should update the user profile successfully", async () => {
    const res = await chai.request(app)
      .put("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        full_name: "Updated Test User"
      });

    expect(res).to.have.status(200);
    expect(res.body.user.full_name).to.equal("Updated Test User");
    console.log("Profile updated successfully.");
  });

  it("should initiate the forget password process", async () => {
    const res = await chai.request(app)
      .post("/user/forget-password")
      .send({
        email_address: "testuser@example.com"
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    console.log("Forget password request sent successfully.");
  });

  it("should fail to reset password with invalid token (expected)", async () => {
    const res = await chai.request(app)
      .post("/user/reset-password")
      .send({
        token: "invalid_token_here",
        newPassword: "newpassword123"
      });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("success", false);
    console.log("Reset password failed as expected (invalid token).");
  });

  it("should logout the user successfully", async () => {
    const res = await chai.request(app)
      .post("/user/logout")
      .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "Logged out successfully");
    console.log("User logged out successfully.");
  });

  it("should delete the user account successfully", async () => {
    const res = await chai.request(app)
      .delete("/user/delete-account")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    console.log("User account deleted successfully.");
  });

  after(async () => {
    console.log("All Auth tests completed successfully.");
  });

});
