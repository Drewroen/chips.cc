Remove-Item dist -Force -Recurse
tsc
cp ./CHIPS_MMO.dat ./dist/CHIPS_MMO.dat
nodemon dist/server/index.js
