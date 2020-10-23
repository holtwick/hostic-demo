module.exports = {
  // parser: 'postcss-comment',
  plugins: {
    'tailwindcss': {
      future: {
        // Silence warnings, see https://tailwindcss.com/docs/upcoming-changes
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
      },
    },
    'postcss-nested': true,
    'autoprefixer': true,
  },
}
