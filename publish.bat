echo 'deploying'

rem commit source and push to github
git add -A
git commit -m 'update'
git push origin

rem build public folder
hugo

rem change to public directory
cd public

rem commit master and push to github
git add -A
git commit -m 'update'
git push origin master

echo 'deployment complete'