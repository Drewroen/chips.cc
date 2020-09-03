tslint -c tslint.json -p tsconfig.json --fix
tsc
ng build --configuration=ec2
cp ./CHIPS_MMO.dat ./dist/CHIPS_MMO.dat
