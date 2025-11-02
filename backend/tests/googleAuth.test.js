// tests/googleAuth.test.js  
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe.skip('🧩 Google OAuth API Tests', function () {
  it('should redirect to Google OAuth consent page', async () => {
    const res = await chai.request(app).get('/auth/google');
    expect(res).to.have.status(302);
  });

  it('should handle Google callback', async () => {
    const res = await chai.request(app).get('/auth/google/callback');
    expect(res).to.have.status(302);
  });
});