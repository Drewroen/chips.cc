Remove-Item dist -Force -Recurse -ErrorAction SilentlyContinue
tslint -c tslint.json -p tsconfig.json --fix
tsc
cp ./CHIPS_MMO.dat ./dist/CHIPS_MMO.dat
