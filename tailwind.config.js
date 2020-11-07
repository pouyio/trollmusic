module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: {
    content:['./index.html', './components/**/*.vue', './App.vue']
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
