all: build

test: v24. v26.

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
	&& npm run build \
	&& npm run test

clean:
	npm run clean

.PHONY: all deltat
