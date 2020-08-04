tsc
mkdir -p ./dist/objects/levels
cp ./objects/levels/CHIPS_MMO.dat ./dist/objects/levels/CHIPS_MMO.dat
ng build
nodemon dist/server/index.js
