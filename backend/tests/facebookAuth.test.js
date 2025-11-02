// tests/facebookAuth.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe.skip('🧩 Facebook OAuth API Tests', function () {
  it('should redirect to Facebook OAuth consent page', async () => {
    const res = await chai.request(app).get('/auth/facebook');
    expect(res).to.have.status(302);
  });

  it('should handle Facebook callback', async () => {
    const res = await chai.request(app).get('/auth/facebook/callback');
    expect(res).to.have.status(302);
  });
});