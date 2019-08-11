#!/bin/bash
set -e

npm run build -- --report --mode development

if [[ $TRAVIS_BRANCH == "develop" ]]; then
  npm run storybook:build
  mv storybook-static dist/storybook
fi
