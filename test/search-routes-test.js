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

// Search Router Tests
describe('The Search Router', () => {

  // Create Test User
  before((done) => {
    // Search test events
    var events = [{
      name: 'Sams party',
      tags: ['sam', 'birthday', 'seattle', '20'],
      unixDate: Date.parse('11/27/2016'),
      location: {
        coords: {
          lat: '47.594409299999995',
          lng: '-122.28775460000001'
        }
      }
    }, {
      name: 'Jons Party',
      tags: ['jon', 'sick', 'bozeman', '22', 'sam'],
      unixDate: Date.parse('3/1/2016'),
      location: {
        coords: {
          lat: '47.00',
          lng: '-122.30'
        }
      }
    }, {
      name: 'Sonja Party',
      tags: ['sonja', 'neat', 'california', '44'],
      unixDate: Date.parse('7/7/2016'),
      location: {
        coords: {
          lat: '48.00',
          lng: '-122.3087668798'
        }
      }
    }, {
      name: 'Jeff Party',
      tags: ['jeff', 'sick', 'whitefish', '54'],
      unixDate: Date.parse('6/12/2016'),
      location: {
        coords: {
          lat: '47.65',
          lng: '-122.30'
        }
      }
    }];

    // Register Test User
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

        // Create events to test with
        events.forEach(function(event, index) {
          chai.request(baseURI)
            .post('/api/events/create')
            .set('token', userToken)
            .send(event)
            .end((err, res) => {
              expect(err).to.eql(null);
              expect(res).to.have.status(200);
              if (index === events.length - 1) {
                done();
              }
            });
        });
      });
  });

  // Drop DB
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  // Interval search
  it('Retrieves events between an interval of time', (done) => {
    chai.request(baseURI)
      .post('/api/events/search/interval')
      .set('token', userToken)
      .send({
        from: '3/1/2016',
        to: '7/1/2016'
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.length).to.eql(2);
        done();
      });
  });

  // Query Search
  it('Retrieves events based on an array of queries', (done) => {
    chai.request(baseURI)
      .post('/api/events/search/query')
      .set('token', userToken)
      .send({
        queryArray: ['sam']
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.length).to.eql(2);
        done();
      });
  });
});