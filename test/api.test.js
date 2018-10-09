'use strict';
const request = require('supertest');
const chai = require('chai');
const assert = chai.assert;
const App = require('../src/app');

const TEST_ENDPOINT = process.env.TEST_ENDPOINT || 'app';
const APP_VERSION = process.env.TEST_APP_VERSION;


describe('Order System Ingration Tests', () => {
  let endpoint;
  let customerId;
  let addressId;

  before(function(done) {
    if (TEST_ENDPOINT === 'app') {
      endpoint = App();
    } else {
      endpoint = TEST_ENDPOINT;
    }
    done();
  });

  //
  // CreateCustomer
  //
  it('CreateCustomer: should create a new customer', function(done) {
    request(endpoint)
      .post('/customers')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        firstname: 'John',
        lastname: 'Doe'
      })
      .expect('Content-Type', /application\/json/)
      .expect(201)
      .end(function(err, res) {
        if (err) {
          console.error(res.text);
          return done(err);
        }

        assert.hasAllKeys(res.body, [
          'customer_id',
          'firstname',
          'lastname',
          'metadata',
          'created'
        ]);

        assert.lengthOf(res.body.customer_id, 36);
        assert.strictEqual(res.body.firstname, 'John');
        assert.strictEqual(res.body.lastname, 'Doe');
        //assert.isObject(res.body.metadata);
        assert.lengthOf(res.body.created, 24);

        customerId = res.body.customer_id;
        done();
      });
  });

  //
  // GetCustomer
  //
  it('GetCustomer: should retrieve same customer', function(done) {
    request(endpoint)
      .get(`/customers/${customerId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          console.error(res.text);
          return done(err);
        }

        assert.hasAllKeys(res.body, [
          'customer_id',
          'firstname',
          'lastname',
          'metadata',
          'created',
          'modified'
        ]);

        assert.lengthOf(res.body.customer_id, 36);
        assert.strictEqual(res.body.firstname, 'John');
        assert.strictEqual(res.body.lastname, 'Doe');
        assert.lengthOf(res.body.created, 24);
        assert.lengthOf(res.body.modified, 24);

        done();
      });
  });

  //
  // CreateCustomerAddress
  //
  it('CreateCustomerAddress: should create a billing address for this customer', function(done) {
    request(endpoint)
      .post(`/customers/${customerId}/addresses`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        type: 'billing',
        contact_name: 'Johny Dellboy',
        address_line_1: '100 Timbuck Two',
        address_line_2: 'Strange Lane',
        city: 'Big City',
        state: 'Some state',
        zip: 'CB99 199',
        country: 'UK',
        metadata: {
          mobile: '07523250462'
        }
      })
      .expect('Content-Type', /application\/json/)
      .expect(201)
      .end(function(err, res) {
        if (err) {
          console.error(res.text);
          return done(err);
        }

        assert.hasAllKeys(res.body, [
          'address_id',
          'customer_id',
          'type',
          'contact_name',
          'address_line_1',
          'address_line_2',
          'city',
          'state',
          'zip',
          'country',
          'metadata',
          'created'
        ]);

        assert.lengthOf(res.body.address_id, 36);
        assert.lengthOf(res.body.customer_id, 36);
        assert.strictEqual(res.body.type, 'billing');
        assert.strictEqual(res.body.contact_name, 'Johny Dellboy');
        assert.strictEqual(res.body.address_line_1, '100 Timbuck Two');
        assert.strictEqual(res.body.address_line_2, 'Strange Lane');
        assert.strictEqual(res.body.city, 'Big City');
        assert.strictEqual(res.body.state, 'Some state');
        assert.strictEqual(res.body.zip, 'CB99 199');
        assert.strictEqual(res.body.country, 'UK');
        assert.isObject(res.body.metadata);
        assert.deepEqual(res.body.metadata, {
          mobile: '07523250462'
        });
        assert.lengthOf(res.body.created, 24);
        addressId = res.body.address_id;

        done();
      });
  });

  //
  // DeleteCustomerAddress
  //
  it('DeleteCustomerAddress: should delete the customer address', function(done) {
    request(endpoint)
      .delete(`/customers/${customerId}/addresses/${addressId}`)
      .set('Accept', 'application/json')
      .expect(204)
      .end(function(err, res) {
        if (err) {
          console.error(res.text);
          return done(err);
        }

        assert.isEmpty(res.body);
        done();
      });

  });

  after(function(done) {
    done();
  });
});
