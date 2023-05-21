const request = require('supertest');
const yup = require('yup');
const { expect } = require('chai');
const app = require('./../app');

// request(app)
//   .method('/path')
//   .set('Header','value') - встановлення заголовків
//   .send(тіло) - встановлення тіла запиту
//   .expect('Header','value') - перевірка заголовка, що прийшов з відповіддю
//   .expect(statusCode)
//   .expect('Response')

//   .end(done)
// або
//   .end((err,res)=>{
//     if(err) {return done(err)}
//     перевірка res.body
//     done()
//   })
// або
//   .then(res=>{ перевірка res.body; done()})
//   .catch(err=>done(err))

const userCredentials = { email: 'buyer@gmail.com', password: '123456' };

const TOKEN_VALIDATION_SCHEMA = yup.object({
  token: yup
    .string()
    .matches(/^\w+\.\w+\.\w+$/)
    .required(),
});

describe('Testing app', () => {
  describe('Testing public endpoints', function () {
    it('response should be [] when GET /offers', function (done) {
      request(app)
        .get('/offers')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(err => done(err));
    });

    describe('POST /login', function () {
      it('response should be 200 {token:"tokenString"} Content-Type json when valid login/passw (user exists)', function (done) {
        request(app)
          .post('/login')
          .send(userCredentials)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(TOKEN_VALIDATION_SCHEMA.isValidSync(res.body)).to.be.true;
            done();
          })
          .catch(err => done(err));
      });

      it('response should be 400 "Invalid data for login" when invalid email', function (done) {
        request(app)
          .post('/login')
          .send({ email: 'buyer', password: '123456' })
          .expect(400)
          .expect('Invalid data for login')
          .end(done);
      });

      it('response should be 404 "user with this data didn`t exist" when valid login/passw (user doesn`t exist)', function (done) {
        request(app)
          .post('/login')
          .send({ email: 'buyer1@gmail.com', password: '123456' })
          .expect(404)
          .expect('user with this data didn`t exist')
          .end(done);
      });
    });
  });

  describe('Testing private endpoints', function () {
    let token;

    before(function (done) {
      request(app)
        .post('/login')
        .send(userCredentials)
        .then(res => {
          token = res.body.token;
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    describe('GET /getUser', function () {
      it('response should be 200 res.body.email=userCredentials.email Content-Type json when valid token', function (done) {
        request(app)
          .post('/getUser')
          .set('Authorization', token)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body.email).to.be.equal(userCredentials.email);
            done();
          })
          .catch(err => done(err));
      });

      it('response should be 408 "token error" when invalid token', function (done) {
        request(app)
          .post('/getUser')
          .set('Authorization', 'token')
          .expect(408)
          .expect('token error')
          .end(done);
      });

      it('response should be 408 "need token" when token is missed', function (done) {
        request(app)
          .post('/getUser')
          .expect(408)
          .expect('need token')
          .end(done);
      });
    });
  });
});
