.DEFAULT_GOAL:=build

node_modules:
	npm i

 build: node_modules
	npx flow
	npm run test-unit

start: ./bin/www node_modules
	npm run start
