git pull
npm run build
echo "Copying dist files over"
cp dist/bundle.css /var/www/html/brainstormer/
cp dist/bundle.js /var/www/html/brainstormer/
cp dist/index.html /var/www/html/brainstormer/
cp dist/fonts /var/www/html/brainstormer/ -R
cp dist/images /var/www/html/brainstormer/ -R
echo "Deployment complete."