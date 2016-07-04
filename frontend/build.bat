copy app.json dist\app.json
copy main\tab.html dist\tab.html
copy detail\detail.html dist\detail.html
copy settings\settings.html dist\settings.html
copy detail\detail-controller.js dist\detail-bundle.js
copy settings\controller.js dist\settings-bundle.js

webpack main\controller.js dist\main-bundle.js



