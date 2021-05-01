// @flow

var express = require('express');
var router = express.Router();

/* ::
import type {
  Code,
  Brand
} from '../lib';

type GenerateResponse = {|
  status: 'success' | 'partial_success',
  brand: Brand,
  expires: number,
  codes: Array < Code >,
  now: number
|}
*/

const {
  generate,
} = require('../lib');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const count = parseInt(req.query.count);
  const expires = parseInt(req.query.expires);
  if (!count || !expires) {
    next(new Error('BAD_REQUEST')); // TODO: can be more specific about the error
    return;
  }
  generate(req.query.brand, req.query.count, req.query.expires)
  .then(codes => {
    const resp /* : GenerateResponse */ = {
      status: codes.length === count ? 'success' : 'partial_success',
      brand: req.query.brand,
      expires,
      codes,
      now: Date.now()
    };
    res.json(resp);
  })
  .catch(next);
});

module.exports = (router /* : any */);
