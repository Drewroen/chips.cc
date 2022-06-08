Remove-Item dist -Force -Recurse
tsc
cp ./CHIPS_MMO_TESTS.dat ./dist/CHIPS_MMO.dat
node dist/server/index.js
