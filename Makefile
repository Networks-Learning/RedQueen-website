.PHONY: build

build:
	@rm -rf build/
	@mkdir -p build
	@cp favicon.ico index.html build/
	@cp -r css  build/
	@cp -r data build/
	@cp -r js   build/
	@cp -r img  build/
	@echo "Done."

