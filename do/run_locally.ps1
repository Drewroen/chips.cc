tsc
cp ./objects/levels/CHIPS_MMO.dat ./dist/CHIPS_MMO.dat
ng build
nodemon dist/server/index.js
