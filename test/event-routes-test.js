// Set up
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
chai.use(require('chai-http'));

// Set test MONGO_URI
process.env.MONGO_URI = 'localhost:27017';

// Server and Models
const server = require(__dirname + '/../server.js');
const Event = require(__dirname + '/../models/event.js');

// For Testing
var baseURI = 'localhost:8888';
var userToken;
var user_id;
var event_id;

// Event Route Tests
describe('Event Routes', () => {
  // Create Test User
  before((done) => {
    chai.request(baseURI)
      .post('/auth/register')
      .send({
        "authentication": {
          "email": 'test@test.com',
          "password": 'password1'
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        userToken = res.body.token;
        user_id = res.body.user._id;
        done();
      })
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  // Create new event
  it('Creates a new Event on POST', (done) => {
    chai.request(baseURI)
      .post('/api/events/create')
      .set('token', userToken)
      .send({
        name: 'Test Name',
        unixDate: Date.parse('November 17, 2016'),
        description: 'Sams 20th birthday party. Bring your kids.',
        cost: '35',
        linkToMoreInfo: 'www.samheutmaker.com',
        tags: ['sam', 'heutmaker', 'birthday'],
        location: {
          venue: 'Sams House',
          area: 'Seattle',
          address: '900 Lakeside Ave E',
          coords: {
            lat: '48',
            lng: '140'
          }
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('postedOn');
        expect(res.body).to.have.property('owner_id');
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('unixDate');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('cost');
        expect(res.body).to.have.property('linkToMoreInfo');
        expect(res.body).to.have.property('tags');
        expect(res.body).to.have.property('location');
        event_id = res.body._id;
        done();
      });
  });

  describe('Requests that require an event', () => {
    // Get details of a single event
    it('Gets one event by id', (done) => {
      chai.request(baseURI)
        .get('/api/events/detail/' + event_id)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('postedOn');
          expect(res.body).to.have.property('owner_id');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('unixDate');
          expect(res.body).to.have.property('description');
          expect(res.body).to.have.property('cost');
          expect(res.body).to.have.property('linkToMoreInfo');
          expect(res.body).to.have.property('tags');
          expect(res.body).to.have.property('location');
          expect(res.body._id).to.eql(event_id);
          done();
        });
    });

    // Update Event
    it('Updates a post on a PUT request', (done) => {
      // Update
      var update = {
        name: 'Different',
      };
      chai.request(baseURI)
        .put('/api/events/update/' + event_id)
        .set('token', userToken)
        .send(update)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('Updated.');
          done();
        });
    });

    // Delete event
    it('Should set an events active status to false', (done) => {
      chai.request(baseURI)
        .delete('/api/events/delete/' + event_id)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          chai.request(baseURI)
            .get('/api/events/detail/' + event_id)
            .set('token', userToken)
            .end((err2, res2) => {
              expect(res2).to.have.status(500);
              expect(res2.body.msg).to.eql('No content.');
              done();
            });
        });
    });
  });
});