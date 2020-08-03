tsc
mkdir ./dist/objects/levels
Copy-Item ./objects/levels/CHIPS_MMO.dat ./dist/objects/levels/CHIPS_MMO.dat
ng build
nodemon dist/server/index.js
