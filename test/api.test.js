'use strict';
const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-uuid'));
const assert = chai.assert;
const App = require('../src/app');

const TEST_ENDPOINT = process.env.TEST_ENDPOINT || 'app';
const APP_VERSION = process.env.TEST_APP_VERSION;

const customerAddresses = [
  {
    'type': 'billing',
    'contact_name': 'Rodney Trotter',
    'address_line_1': 'Mandella House',
    'address_line_2': 'The Circle',
    'city': 'Peckham',
    'state': 'Surrey',
    'zip': 'E1',
    'country': 'GB',
    'metadata': {
      age: 30,
      height: 185
    }
  },
  {
    'type': 'shipping',
    'contact_name': 'Dell Trotter',
    'address_line_1': 'Kings Avenue',
    'address_line_2': 'The Triangle',
    'city': 'Edgeham',
    'state': 'Wilts',
    'zip': 'E2',
    'country': 'GB',
    'metadata': {
      age: 30,
      height: 185
    }
  },
  {
    'type': 'shipping',
    'contact_name': 'John Deo',
    'address_line_1': '100 Timbuck Two',
    'address_line_2': 'Strange Lane',
    'city': 'Bigville',
    'state': 'The Shire',
    'zip': '192402',
    'country': 'FR',
    'metadata': {
      age: 30,
      height: 185,
      shoeSize: 9
    }
  }
];
const LAST_IDX = customerAddresses.length - 1;

let endpoint;
let customerId;
var addressId;

describe('Order System Ingration Tests', () => {
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
  it('CreateCustomer: should create two new customers', function(done) {
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
  it('CreateCustomerAddress: should create a billing address for this customer', async function() {
    for (let a of customerAddresses) {
      try {
        const res = await request(endpoint)
          .post(`/customers/${customerId}/addresses`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({
            type: a.type,
            contact_name: a.contact_name,
            address_line_1: a.address_line_1,
            address_line_2: a.address_line_2,
            city: a.city,
            state: a.state,
            zip: a.zip,
            country: a.country,
            metadata: a.metadata
          })
          .expect('Content-Type', /application\/json/)
          .expect(201);

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
        assert.strictEqual(res.body.type, a.type);
        assert.strictEqual(res.body.contact_name, a.contact_name);
        assert.strictEqual(res.body.address_line_1, a.address_line_1);
        assert.strictEqual(res.body.address_line_2, a.address_line_2);
        assert.strictEqual(res.body.city, a.city);
        assert.strictEqual(res.body.state, a.state);
        assert.strictEqual(res.body.zip, a.zip);
        assert.strictEqual(res.body.country, a.country);
        assert.isObject(res.body.metadata);
        assert.deepEqual(res.body.metadata, a.metadata);
        assert.lengthOf(res.body.created, 24);
        addressId = res.body.address_id;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  });

  //
  // GetCustomerAddress
  //
  it('GetCustomerAddress: should retrieve customer address', async function() {
    try {
      const res = await request(endpoint)
        .get(`/customers/${customerId}/addresses/${addressId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200);

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
        'created',
        'modified'
      ]);

      assert.uuid(res.body.address_id, 'v4');
      assert.uuid(res.body.customer_id, 'v4');
      assert.strictEqual(res.body.type, customerAddresses[LAST_IDX].type);
      assert.strictEqual(res.body.contact_name, customerAddresses[LAST_IDX].contact_name);
      assert.strictEqual(res.body.address_line_1, customerAddresses[LAST_IDX].address_line_1);
      assert.strictEqual(res.body.address_line_2, customerAddresses[LAST_IDX].address_line_2);
      assert.strictEqual(res.body.city, customerAddresses[LAST_IDX].city);
      assert.strictEqual(res.body.state, customerAddresses[LAST_IDX].state);
      assert.strictEqual(res.body.zip, customerAddresses[LAST_IDX].zip);
      assert.strictEqual(res.body.country, customerAddresses[LAST_IDX].country);
      assert.isObject(res.body.metadata);
      assert.deepEqual(res.body.metadata, customerAddresses[LAST_IDX].metadata);
      assert.lengthOf(res.body.created, 24);
      assert.lengthOf(res.body.modified, 24);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  it('ListCustomerAddresses: should retrieve a list of all addresses for this customer', async function() {
    try {
      const res = await request(endpoint)
        .get(`/customers/${customerId}/addresses`)
        .set('Accept', 'application/json')
        .expect(200);

        let checkList = customerAddresses.reverse();

        for (let i = 0; i < res.body.length; i++) {
          assert.strictEqual(res.body[i].type, checkList[i].type);
          assert.strictEqual(res.body[i].contact_name, checkList[i].contact_name);
          assert.strictEqual(res.body[i].address_line_1, checkList[i].address_line_1);
          assert.strictEqual(res.body[i].address_line_2, checkList[i].address_line_2);
          assert.strictEqual(res.body[i].city, checkList[i].city);
          assert.strictEqual(res.body[i].state, checkList[i].state);
          assert.strictEqual(res.body[i].country, checkList[i].country);
          assert.deepStrictEqual(res.body[i].metadata, checkList[i].metadata);
          assert.uuid(res.body[i].address_id, 'v4');
          assert.uuid(res.body[i].customer_id, 'v4');
          assert.lengthOf(res.body[i].created, 24);
        }
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  //
  // DeleteCustomerAddress
  //
  // it('DeleteCustomerAddress: should delete the customer address', function(done) {
  //   request(endpoint)
  //     .delete(`/customers/${customerId}/addresses/${addressId}`)
  //     .set('Accept', 'application/json')
  //     .expect(204)
  //     .end(function(err, res) {
  //       if (err) {
  //         console.error(res.text);
  //         return done(err);
  //       }

  //       assert.isEmpty(res.body);
  //       done();
  //     });

  // });



  after(function(done) {
    done();
  });
});
