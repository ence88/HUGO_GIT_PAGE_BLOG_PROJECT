#!/bin/bash

echo 'deploying'

# commit source and push to github
git add -A
git commit -m 'update'
git push origin

# build public folder
hugo

# change to public directory
cd public

# commit master and push to github
git add -A
git commit -m 'update'
git push origin master

echo 'deployment complete'