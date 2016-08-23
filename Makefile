all: v0.12 v4.5 v6.4

v%:
	n $@ && npm test

.PHONY: all
