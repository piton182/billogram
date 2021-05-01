// @flow

var express = require('express');
var router = express.Router();

/* ::
import type {
  Code,
  Brand
} from '../lib';

type FetchResponse = {|
  brand: Brand,
  codes: Array < {| code: Code, expires: number |} >,
  filter: 'all' | 'active',
  now: number
|}
*/

const {
  fetch
} = require('../lib')

/* GET users listing. */
router.get('/', function(req, res, next) {
  fetch(req.query.brand)
  .then(codes => {
    const resp/* : FetchResponse */ = {
      brand: req.query.brand,
      codes,
      filter: 'active',
      now: Date.now()
    }
    res.json(resp);
  })
  .catch(next);
});

module.exports = (router /* : any */);
