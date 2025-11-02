// tests/debug.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe.skip('🔍 DEBUG OAuth Tests', function () {
  it('DEBUG Facebook route', async () => {
    
  });

  it('DEBUG Google route', async () => {
  });
});