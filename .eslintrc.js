module.exports = {
    root: true,
    extends: 'standard',
    env: {
      browser: true,
      node: true
    },
    // Plugins
    plugins: [
    ],
    // Custom rules
    rules: {
        'brace-style': 'error'
    },
    globals: {
      it: true,
      describe: true
    }
  }
  