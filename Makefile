all: v0.12 v4.4 v6.2

v%:
	n $@ && npm test

.PHONY: all
