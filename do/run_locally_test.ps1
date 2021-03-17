Remove-Item dist -Force -Recurse
tsc
cp ./CHIPS_MMO_TESTS.dat ./dist/CHIPS_MMO.dat
nodemon dist/server/index.js
