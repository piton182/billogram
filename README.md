# billogram

A microservice responsible for discount codes.

## How-to run

```sh
$ > docker-compose up --build
```

## API

### /generate

Generates `count` codes for `brand` with expiration timestamp `expires`.

Endpoint: `/generate?brand,count,expires`

Request params:
* brand (mandatory) - any string
* count (mandatory) - any natural number > 0
* expires (mandatory) - any epoch timestamp in the future (hint on getting: `node -e "console.log(Date.now() + 10000)"`)

Response:
```
// @flow
type GenerateResponse = {|
  status: 'success' | 'partial_success',
  brand: Brand,
  expires: number,
  codes: Array < Code >,
  now: number
|}
```

#### Example

Generates 10 codes for Billogram all expiring in 10 sec.

```sh
$> node -e "console.log(Date.now() + 10000)" | { read ts ; curl h"ttp://localhost:3003/generate?brand=billogram&count=10&expires=$ts "; }
```

### /fetch

Gets active (not yet expired) codes for `brand`.

Endpoint: `/fetch?brand`

Request params:
* brand (mandatory) - any string

Response:
```
// @flow
type FetchResponse = {|
  brand: Brand,
  codes: Array < {| code: Code, expires: number |} >,
  filter: 'all' | 'active',
  now: number
|}
```

#### Example

```sh
curl "http://localhost:3003/fetch?brand=billogram"
```
