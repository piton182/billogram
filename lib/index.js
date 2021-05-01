// @flow

const randomstring = require("randomstring");
const debug = require('debug')('discount-codes:server:lib');

/* ::
type Maybe < T > = Promise < T >;

export type Code = string;

export type Brand = string;
*/

const validateExpires /* : (expires: number) => Maybe < number > */ = async (expires) => {
    // TODO: validate if expires is an epoch at all
    // TODO: validate if expires is in the future
    // TODO: something else?..
    // throw if does not comply
    return expires;
}

const validateCount /* : (count: number) => Maybe < number > */ = async (count) => {
    // TODO: count is a Nat > 0
    if (count <= 0) {
        throw new Error('invalid input'); // TODO: be more specific about the error
    }
    // TODO: isn't reasonably high?.. (range validation)
    // throw if does not comply
    return count;
}

const store /* : Map < Brand, Array< {| code: Code, expires: number |} > > */ = new Map();
let generating/* : boolean */ = false;

const generateCode /* : () => Promise < Code > */ = async () => {
    return randomstring.generate(7);
};

const postpone /* : (action: Function => Promise < any >, ms: number) => Promise < any > */ = async (action, ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                resolve( await action() );
            } catch(err) {
                reject(err);
            }
        }, ms);
    });
};

const delay = (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});

const generateUniqueCode /* : (brand: Brand, expires: number) => Promise < Code > */ = async (brand, expires) => {
    if (generating) {
        debug(`concurrency issue`);
        // TODO: later on, probably emit a metric as well to have insights on how bad concurrency of current solution hinders performance
        return postpone(() => generateUniqueCode(brand, expires), 10);
    }
    generating = true;
    await delay(50);
    let code = await generateCode();
    debug(`generated code ${code} for brand=${brand}`);
    {
        const brandCodes = store.get(brand);
        if (!brandCodes) {
            store.set(brand, [{ code, expires }]);
        } else {
            while (brandCodes.includes(code)) {
                debug(`${code} already exists for brand=${brand}, retrying ...`);
                // TODO: later on, probably emit a metric as well to know how often rerties happen over time
                code = await generateCode();
                // TODO: maybe have a reasonable upper limit here, so that this function would definitely ever terminate
            }
            store.set(brand, brandCodes.concat({ code, expires }));
        }
    }
    generating = false;
    return code;
};

const publishSnsEvent = (codes) => {

}

const generate /* : (
    brand: Brand,
    count: number,
    expires: number
) => Promise < Array < Code > > */ = async (brand, count, expires) => {
    await validateCount(count);
    await validateExpires(expires);
    // TODO: later on, brand can be a part of signed JWT, so no need to validate it
    
    let promises = [];
    for (var i = 0; i < count; i++) {
        promises.push(generateUniqueCode(brand, expires));
    }
    const codes = await Promise.allSettled(promises)
                        .then(rs => rs
                                    .filter(x => x.status === 'fulfilled')
                                    // $FlowFixMe
                                    .map(x => x.value)
                        );
    publishSnsEvent(codes);
    return codes;
};

const fetch /* : (brand: Brand) => Promise < Array < {| code: Code, expires: number |} > > */ = async (brand) => {
    const now = Date.now();
    return (store.get(brand) || []).filter(c => c.expires > now);
}

module.exports = ({
    generate,
    fetch,
} /* : {
    generate: typeof generate,
    fetch: typeof fetch
} */);