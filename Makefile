all: v0.12 v4.5 v6.9

v%:
	n $@ && npm test

deltat:
	./scripts/download.sh -t	

.PHONY: all deltat
