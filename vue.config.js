module.exports = {
  lintOnSave: false, // 关闭ESLint的规则检查
  // lintOnSave: 'warning', // 输出提示错误, 但项目继续运行

  devServer: { // 只用于开发环境
    proxy: {
      '/api':    { // 只对请求路由以/api开头的请求进行代理转发
        target: 'http://121.5.235.28:8888', // 转发的目标url
        changeOrigin: true, // 支持跨域
        // pathRewrite: {'^/api': ''}  // 是否把路径中的api去掉，需要看后台接口都有/api
      },
    }
  },
}