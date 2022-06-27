Remove-Item dist -Force -Recurse
tsc
node dist/server/index.js
