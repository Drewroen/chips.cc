tslint -c tslint.json -p tsconfig.json --fix
tsc
ng build --prod
cp ./CHIPS_MMO.dat ./dist/CHIPS_MMO.dat
