.PHONY: build

build:
	mkdir -p build
	cp favicon.ico index.html build/
	mkdir -p build/css
	cp css/*.css  build/css/
	rsync -r css/et-book  build/css/
	rsync -r css/vendor  build/css/
	rsync -r css/fonts  build/css/
	mkdir -p build/data
	rsync -r data/*.json build/data/
	mkdir -p build/js
	rsync -r js/*.js  build/js/
	mkdir -p build/js/vendor/
	rsync -r js/vendor/*.js  build/js/vendor/
	mkdir -p build/img
	rsync -r img/*  build/img/
	mkdir -p build/slides/
	rsync -ua slides/* build/slides\
	       --exclude node_modules\
	       --exclude test\
	       --exclude '*~'\
	       --exclude "*.scss"\
	       --exclude "*.orig"\
	       --exclude "demo.html"\
	       --exclude "*.md"\
	       --exclude "package.json"\
	       --exclude "bower.json"\
	       --exclude "Gruntfile.js"
	echo "Done."


clean:
	rm -rf build


