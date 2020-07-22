tslint -c tslint.json -p tsconfig.json --fix
tsc
ng build
nodemon dist/server/index.js
