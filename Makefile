# Automatically install & include https://github.com/matthewmueller/make
ifeq ($(strip $(wildcard ${.INCLUDE_DIRS}/github.com/matthewmueller/make/all.mk)),)
	i := $(shell >&2 echo "installing github.com/matthewmueller/make..." && curl -sL https://git.io/fjD5i | sh)
endif
include github.com/matthewmueller/make/all.mk

precommit: rollup.compile tsc.check
prepublish: clean.dist rollup.compile tsc.check

clean.dist:
	@ rm -rf dist

rollup.compile:
	@ ./node_modules/.bin/rollup -c

rollup.watch:
	@ ./node_modules/.bin/rollup -c -w

tsc.check:
	@ ./node_modules/.bin/tsc

serve:
	@ ./node_modules/.bin/serve

publish: prepublish bin.npm bin.node bin.jq env.NPM_TOKEN
	@ echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
	@ cp package.json dist/
	@ if [ $(shell npm info --json $(shell jq -r '.name' < package.json) version) != $(shell jq .version < package.json) ]; then \
			PUBLISH=1 npm publish dist/; \
		fi
	@ rm dist/package.json
	@ rm .npmrc