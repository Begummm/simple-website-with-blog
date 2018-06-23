"use strict";

const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const app = express();

// Configure app
app.set("case sensitive routing", true);
app.set("strict routing", true);

// Fix protocol for HTTPS requests under iisnode
app.set("trust proxy", true);
app.use((req, res, next) => {
  if (!req.secure && req.headers["x-arr-ssl"] && !req.headers["x-forwarded-proto"]) {
    req.headers["x-forwarded-proto"] = "https";
  }
  next();
});

// Redirect HTTP traffic to HTTPS
if (process.env.SWWB_REDIRECT_TO_HTTPS) {
  app.use((req, res, next) => {
    if (req.secure) {
      return next();
    }
    return res.redirect(`https://${req.headers.host}${req.originalUrl}`);
  });
}

// Redirect to remove "www." prefix from host name
app.use((req, res, next) => {
  const originalHostUrl = `//${req.headers.host}${req.originalUrl}`;
  const redirectHost = req.headers.host.replace(/^www\./i, "");
  const redirectHostUrl = `//${redirectHost}${req.originalUrl}`;
  if (redirectHostUrl === originalHostUrl) {
    return next();
  }
  return res.redirect(redirectHostUrl);
});

// Add security headers and compression
app.use(helmet({
  "contentSecurityPolicy": {
    "directives": {
      "defaultSrc": ["'self'"]
    }
  },
  "hsts": {
    "maxAge": 60 * 60 * 24 * 7
  }
}));
app.use(compression({
  "level": 9,
  "threshold": 0
}));

// Handle static content
app.use(express.static("static", {
  "index": [
    "index.html",
    "index.htm",
    "default.html",
    "default.htm"
  ]
}));

// Handle HTTP 404/500
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.sendStatus(404);
});
// eslint-disable-next-line max-params, no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
