const { LazyResult } = require("postcss");

module.exports = {
  important: true,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  purge: {
    mode: LazyResult,
    content: ["./pages/**/*.tsx", "./components/**/*.tsx",'./public/**/*.html'],
    // These options are passed through directly to PurgeCSS
  },
 
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cwc: {
          red:'#E84977',
          blue:'#49AADE',
          gray:'#222222'
        }
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      inset: ["checked"],
      zIndex: ["hover", "active"],
    },
  },
 
  plugins: [],
  future: {
    purgeLayersByDefault: true,
  },
}
