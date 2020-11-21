

module.exports = {
    "*.{json,yml,md}": ["prettier --no-config --write"],
    "**/*.ts": ["npx eslint --fix", "prettier --write", () => "npx tsc -p tsconfig.json --noEmit"]
}