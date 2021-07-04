import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'md'
  },
  theme: {
    themes: {
      light: {
        primary: colors.orange.base,
        secondary: colors.cyan.base,
        accent: colors.teal.base,
        error: colors.red.base,
        warning: colors.amber.base,
        info: colors.yellow.base,
        success: colors.green.base
      }
    }
  }
})
