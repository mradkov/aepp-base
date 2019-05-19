#!/bin/sh

export GIT_ASKPASS=scripts/git-askpass.sh

npm install
npx cordova telemetry off

npm run build:cordova
npx cordova prepare android
npm run gen:cordova-resources
npx cordova build android -- --gradleArg=--no-daemon
