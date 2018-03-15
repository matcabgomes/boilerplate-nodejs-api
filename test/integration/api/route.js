var request               = require('supertest');
var chai                  = require('chai');
var expect                = chai.expect;
var UserBO                = require('../../../src/business/userBO');
var RouteBO               = require('../../../src/business/routeBO');
var DAOFactory            = require('../../../src/daos/daoFactory');
var ModelParser           = require('../../../src/models/modelParser');
var JWTHelper             = require('../../../src/helpers/jwtHelper');

describe('api', function(){
  var server;
  var userBO = new UserBO({
    userDAO: DAOFactory.getDAO('user'),
    modelParser: new ModelParser(),
    jwtHelper: new JWTHelper()
  });

  var routeBO = new RouteBO({
    routeDAO: DAOFactory.getDAO('route'),
    modelParser: new ModelParser(),
  });

  var adminUser = {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: '123456',
    role: 'admin',
    confirmation: {
      key: '1'
    },
    internalKey: '1'
  };

  var user = {
    name: 'User',
    email: 'user@gmail.com',
    password: '123456',
    role: 'user',
    confirmation: {
      key: '1'
    },
    internalKey: '1'
  };

  var connectionInfo = {
    ip: 'fake',
    userAgent: 'fake'
  };

  before(function(){
    server = require('../../../src/server');
    var chain = Promise.resolve();

    //before start the tests it is necessary create an admin user, simple user
    // and get the tokens for each one of them
    return chain
      .then(function() {
        return userBO.clear();
      })
      .then(function() {
        return userBO.createUserWithoutValidations(adminUser);
      })
      .then(function(r) {
        adminUser.id = r.id;
        return userBO.generateToken(adminUser.email, adminUser.password, connectionInfo);
      })
      .then(function(r) {
        adminUser.token = r.token;
        return userBO.createUserWithoutValidations(user);
      })
      .then(function(r) {
        user.id = r.id;
        return userBO.generateToken(user.email, user.password, connectionInfo);
      })
      .then(function(r) {
        user.token = r.token;
        return routeBO.clear();
      });
  });

  after(function(){
    var chain = Promise.resolve();

    return chain
      .then(function() {
        return userBO.clear();
      })
      .then(function() {
        return routeBO.clear();
      });
  });

  describe('/v1/routes', function(){
    describe('basic token validation', function(){
      it('should fail to perform GET to the route /routes without a token (403)', function() {
        return request(server)
          .get('/v1/routes')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403);
      });

      it('should fail to perform POST to the route /routes without a token (403)', function() {
        return request(server)
          .post('/v1/routes')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403);
      });

      it('should fail to perform GET the route /routes without a token (404)', function() {
        return request(server)
          .get('/v1/routes/fake-id')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403);
      });

      it('should fail to perform DELETE to the route /routes/id without a token (403)', function() {
        return request(server)
          .delete('/v1/routes/fake-id')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403);
      });
    });

    it('should list routes with a valid token', function() {
      return request(server)
        .get('/v1/routes')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminUser.token)
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should store a new route', function() {
      var entityId = null;

      return request(server)
        .post('/v1/routes')
        .send({
            key: 'key',
            path: 'path',
            request: {
              headers: {
                'x': 'y'
              }
            },
            response: {
              statusCode: 200,
              body: {
                'x': 'y'
              }
            }
          })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminUser.token)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body).to.have.property('id');
          expect(res.body.key).to.be.equal('key');
          expect(res.body.path).to.be.equal('path');
          expect(res.body.request.headers.x).to.be.equal('y');
          expect(res.body.response.statusCode).to.be.equal(200);
          expect(res.body.response.body.x).to.be.equal('y');

          return res.body.id;
        })
        .then(function(id) {
          entityId = id;
          return request(server)
            .get('/v1/routes')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminUser.token)
            .expect('Content-Type', /json/)
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].id).to.be.equal(entityId);
        });
    });

    it('should fail to store a new route using a regular user token', function() {
      return request(server)
        .post('/v1/routes')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + user.token)
        .expect('Content-Type', /json/)
        .expect(401);
    });

    it('should update a route', function() {
      var entityId = null;

      return request(server)
        .get('/v1/routes')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminUser.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          entityId = res.body[0].id;
          return request(server)
            .put('/v1/routes/' + entityId)
            .send({
              response: {
                statusCode: 404
              }
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminUser.token)
            .expect('Content-Type', /json/)
            .expect(200);
        })
        .then(function(res) {
          expect(res.body.id).to.be.equal(entityId);
          expect(res.body.key).to.be.equal('key');
          expect(res.body.path).to.be.equal('path');
          expect(res.body.request.headers.x).to.be.equal('y');
          expect(res.body.response.statusCode).to.be.equal(404);
          expect(res.body.response.body.x).to.be.equal('y');
        });
    });

    it('should fail to update a route using a regular user token', function() {
      return request(server)
        .put('/v1/routes/fake-id')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + user.token)
        .expect('Content-Type', /json/)
        .expect(401);
    });

    it('should fail to disable a route with a regular user token', function() {
      return request(server)
        .delete('/v1/routes/fake-id')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + user.token)
        .expect('Content-Type', /json/)
        .expect(401);
    });

    it('should disable a route with a admin user token', function() {
      var entityId = null;

      return request(server)
        .get('/v1/routes')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminUser.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          entityId = res.body[0].id;
          return request(server)
            .delete('/v1/routes/' + entityId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminUser.token)
            .expect('Content-Type', /json/)
            .expect(200);
        })
        .then(function() {
          return request(server)
            .get('/v1/routes/' + entityId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminUser.token)
            .expect('Content-Type', /json/)
            .expect(404);
        });
    });
  });
});
