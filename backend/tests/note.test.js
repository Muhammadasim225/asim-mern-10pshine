const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const app = require("../server"); 
const db = require("../config/database");
const { protectedRoutes } = require("../middlewares/protectedRoutes");

const { expect } = chai;
chai.use(chaiHttp);

const Note = db.notes;
const User = db.user;

describe("🧠 Notes API Unit Tests", () => {

  let token;
  let mockUser;
  let mockNote;

  before(async () => {
    mockUser = { id: 1, email_address: "test@user.com", full_name: "Test User" };
    token = jwt.sign(mockUser, process.env.JWT_SECRET_KEY || "secretkey");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Middleware: protectedRoutes", () => {
    it("should return 401 if token is missing", (done) => {
      const req = { headers: {}, cookies: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const next = sinon.spy();

      protectedRoutes(req, res, next);
      expect(res.status.calledWith(401)).to.be.true;
      done();
    });

    it("should call next() if token is valid", (done) => {
      const validToken = jwt.sign({ id: 2 }, process.env.JWT_SECRET_KEY || "secretkey");
      const req = {
        headers: { authorization: `Bearer ${validToken}` },
        cookies: {}
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const next = sinon.spy();

      protectedRoutes(req, res, next);
      expect(next.calledOnce).to.be.true;
      done();
    });
  });

  describe("Controller: createNotes", () => {
    it("should create a note successfully", async () => {
      sinon.stub(Note, "create").resolves({ id: 1, title: "Test", content: "Content", userId: 1 });

      const res = await chai
        .request(app)
        .post("/user/create-note")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Test", content: "Content" });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("success", true);
    });
  });

  describe("Controller: fetchAllNotes", () => {
    it("should fetch all user notes", async () => {
      sinon.stub(Note, "findAll").resolves([{ id: 1, title: "Note1" }]);
      const res = await chai
        .request(app)
        .get("/user/fetch-all-notes")
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("data").that.is.an("array");
    });
  });

  describe("Controller: updateNote", () => {
    it("should update a note successfully", async () => {
      const fakeNote = { update: sinon.stub().resolves(true) };
      sinon.stub(Note, "findOne").resolves(fakeNote);

      const res = await chai
        .request(app)
        .put("/user/edit-note/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated", content: "Updated content" });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
    });
  });

  describe("Controller: deleteNote", () => {
    it("should delete a note successfully", async () => {
      const fakeNote = { destroy: sinon.stub().resolves(true) };
      sinon.stub(Note, "findOne").resolves(fakeNote);

      const res = await chai
        .request(app)
        .delete("/user/remove-note/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);
    });
  });

  describe("Controller: getSingleNote", () => {
    it("should get single note successfully", async () => {
      sinon.stub(Note, "findOne").resolves({ id: 1, title: "Note1" });
      const res = await chai
        .request(app)
        .get("/user/get-single-note/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("data");
    });
  });
});
