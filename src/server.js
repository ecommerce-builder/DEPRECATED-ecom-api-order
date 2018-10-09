'use strict';
const App = require('../src/app');
let app = App();

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Order System API Version ${process.env.npm_package_version} started on http://localhost:${port}`);
});
