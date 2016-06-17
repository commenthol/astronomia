all: 0.12 4.4 6.2

%:
	n $@ && npm test

.PHONY: all
