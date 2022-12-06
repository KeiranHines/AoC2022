// Configured a node proxy. Enabling Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy allows
// Firefox to properly use the window.performance.now() api for higher precision timing.
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });
};
