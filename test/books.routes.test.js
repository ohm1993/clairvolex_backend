import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

chai.should();
chai.use(chaiHttp);

describe('Auth Routes', () => {

  describe('POST /login', () => {
    it('should return a token and user data for valid credentials', (done) => {
      const user = {
        email: 'test@example.com',
        password: 'password123'
      };

      chai.request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql(true);
          res.body.should.have.property('user');
          res.body.should.have.property('token');
          done();
        });
    });

    it('should return a 404 for invalid credentials', (done) => {
      const user = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      chai.request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql(false);
          res.body.should.have.property('error').eql('User or Password not found');
          done();
        });
    });
  });

  describe('POST /register', () => {
    it('should register a new user', (done) => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      chai.request(server)
        .post('/api/auth/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql(true);
          res.body.should.have.property('user');
          done();
        });
    });

    it('should return 400 if required fields are missing', (done) => {
      const newUser = {
        email: 'john@example.com'
      };

      chai.request(server)
        .post('/api/auth/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('error').eql('Name or Email or Password fields cannot be empty!');
          done();
        });
    });
  });

});
