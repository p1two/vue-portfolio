module.exports = {
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'Mozart Pistori Tomazetti'
      return args
    })
  },
  pwa: {
    name: "Mozart's Portfolio", // <---- this is PWA name
    short_name: "Mozart's Portfolio", // <---- this is PWA name
  }
}
