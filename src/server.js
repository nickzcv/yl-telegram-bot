const express = require('express');
const config = require('./config/config.json');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
//const logger = require('morgan');
// Routing
const botRoutes = require('./routings/bot');
// Init Express
const app = express();
// Run logger
//app.use(logger('dev'));
// Parse incoming request bodies in a middleware before your handlers
// available under the req.body property
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Express middleware for uploading files
// When you upload a file, the file will be accessible from req.files
app.use(fileUpload({}));
// Routes
app.use('/', botRoutes);
// Server start point
app.listen(config.PORT, () => {
    console.log(`Server is up on port: ${config.PORT}`)
});