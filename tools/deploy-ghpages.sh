#!/bin/bash -e
cd docs
git init
git config user.name "Travis CI"
git config user.email "zdumb1885@outlook.com"
cp -r ../dist ./dist
git add .
git commit -m "Deployed to Github Pages"
git push "https://${GH_TOKEN}@github.com/lowsprofile/jaysn.git" master:gh-pages > /dev/null 2>&1