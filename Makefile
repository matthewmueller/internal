watch:
	@ ./node_modules/.bin/vitest --coverage

format:
	@ ./node_modules/.bin/prettier --write src

test: format
	@ ./node_modules/.bin/vitest run --coverage

install:
	@ npm install
	@ ./node_modules/.bin/playwright install

clean:
	@ rm -rf node_modules dist

build: test
	@ rm -rf dist
	@ ./node_modules/.bin/tsup

precommit: test

release: VERSION := $(shell awk '/[0-9]+\.[0-9]+\.[0-9]+/ {print $$2; exit}' Changelog.md)
release: format test build
	@ test -n "$(VERSION)" || (echo "Unable to read the version." && false)
	@ test -z "`git tag -l v$(VERSION)`" || (echo "Aborting because the v$(VERSION) tag already exists." && false)
	@ test -z "`git status --porcelain | grep -vE 'Changelog\.md'`" || (echo "Aborting from uncommitted changes." && false)
	@ test -n "`git status --porcelain Changelog.md`" || (echo "Aborting because Changelog.md has not changed." && false)
	@ npm version "$(VERSION)" --no-git-tag-version
	@ git add Changelog.md package.json
	@ git commit -m "Release v$(VERSION)"
	@ git tag "v$(VERSION)"
	@ git push origin main "v$(VERSION)"
	@ go run github.com/cli/cli/v2/cmd/gh@latest release create --generate-notes "v$(VERSION)"
	@ PUBLISH=1 npm publish
