all: build

test: v0.12 v4. v6. v7.

v%:
	n $@ \
	&& npm test

deltat:
	./scripts/download.sh -t

pack:
	rm astronomia*.tgz
	npm pack
	tar tvzf astronomia*.tgz

build: clean lib/

lib/: src/*.js
	npm run lint \
	&& npm run transpile \
	&& npm run test

clean:
	npm run clean

.PHONY: all deltat
