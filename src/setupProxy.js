const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://geula-list.ru",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": "" // Убираем `/api` из запроса перед отправкой на сервер
      }
    })
  );
};
