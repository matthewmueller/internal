precommit: rollup.compile tsc.check

rollup.compile:
	@ ./node_modules/.bin/rollup -c

rollup.watch:
	@ ./node_modules/.bin/rollup -c -w

tsc.check:
	@ ./node_modules/.bin/tsc