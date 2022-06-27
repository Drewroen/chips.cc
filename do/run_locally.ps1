Remove-Item dist -Force -Recurse
tsc
Remove-Item dist/test -Force -Recurse
node dist/server/index.js
