// @flow

const expect = require('chai').expect;
const {
    generate,
    fetch,
} = require('../../lib');

// $FlowFixMe
describe('fetching codes', () => {
    // $FlowFixMe
    it('should not include expired codes', async () => {
        const brand = 'xyz';
        await generate(brand, 10, Date.now());
        await generate(brand, 1, Date.now() + 10000);
        const codes = await fetch(brand);
        expect(codes.length).equal(1);
    });
});
