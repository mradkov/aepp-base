#!/bin/bash
set -e

npm run lint
npm run test:unit
npm run build -- --report

npm run test:e2e -- --headless

if [[ $TRAVIS_BRANCH == "develop" ]]; then
  npm run storybook:build
  mv storybook-static dist/storybook
fi
