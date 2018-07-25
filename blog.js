"use strict";

const {siteRoot} = require("./config");
const fs = require("fs");
const path = require("path");
const express = require("express");
const highlightJs = require("highlight.js");
const MarkdownIt = require("markdown-it");
const pify = require("pify");
const ReactDOMServer = require("react-dom/server");
const render = require(`${siteRoot}/generated/render.js`);
const router = express.Router();
const readdir = pify(fs.readdir);
const readFile = pify(fs.readFile);
const markdownIt = new MarkdownIt({
  "highlight": (str, lang) => {
    if (lang && highlightJs.getLanguage(lang)) {
      return highlightJs.highlight(lang, str).value;
    }
    return "";
  }
});


const postsDir = `${siteRoot}/posts`;
const postExtension = /\.json$/;
const posts = [];
readdir(postsDir).
  then((files) => Promise.all(files.
    filter((file) => postExtension.test(file)).
    map((file) => {
      const id = file.replace(postExtension, "");
      const filePath = path.join(postsDir, file);
      return readFile(filePath, "utf8").
        then((content) => {
          const post = JSON.parse(content);
          if (!post.title || !post.date) {
            throw new Error(`Post id "${id}" missing 'title' or 'date'.`);
          }
          post.id = id;
          post.date = new Date(post.date);
          return post;
        }).
        then((post) => {
          let promise = Promise.resolve();
          if (!post.contentJson) {
            const htmlFile = `${id}.html`;
            const includesHtmlFile = files.includes(htmlFile);
            const mdFile = `${id}.md`;
            const includesMdFile = files.includes(mdFile);
            if (!includesHtmlFile && !includesMdFile) {
              throw new Error(`Post id "${id}" missing 'contentJson'/${htmlFile}/${mdFile}.`);
            }
            promise = readFile(path.join(postsDir, includesHtmlFile ? htmlFile : mdFile), "utf8").
              then((content) => {
                post.contentHtml = includesHtmlFile ? content : markdownIt.render(content);
              });
          }
          return promise.
            then(() => posts.push(post));
        });
    }))).
  then(() => {
    posts.sort((left, right) => (right.date - left.date) || left.id.localeCompare(right.id));
  });

router.get("/", (req, res) => {
  const elements = render({
    posts
  });
  const staticMarkup = ReactDOMServer.renderToStaticMarkup(elements);
  const body = `<!DOCTYPE html>${staticMarkup}`;
  res.send(body);
});

module.exports = router;
