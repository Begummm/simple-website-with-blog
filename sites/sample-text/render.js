"use strict";
const React = require("react");
const shared = require("../" + "shared.js");
const blogName = "simple-website-with-blog/sample-text";
const getTitle = (post) => post.title;
module.exports.getTitle = getTitle;
module.exports.getContentElements = (post) => {
    const content = post.contentJson.map((line, index) => React.createElement("p", { key: index }, line));
    return React.createElement("div", null, content);
};
module.exports.getHtmlElements = (props) => {
    const archives = shared.getArchiveList(props.archives);
    const heading = props.period
        ? `Posts from ${shared.dateTimeFormatMonth.format(props.period)}`
        : null;
    const posts = props.posts.map((post) => {
        const publishDateIso = post.publishDate.toISOString();
        const publishDateFormat = shared.dateTimeFormatWeekday.format(post.publishDate);
        const publishDate = (post.publishDate.getTime() > 0)
            ? React.createElement("p", null,
                React.createElement("time", { dateTime: publishDateIso }, publishDateFormat))
            : null;
        return (React.createElement("section", { key: post.id },
            React.createElement("hr", null),
            React.createElement("h2", null,
                React.createElement("a", { href: `/blog/post/${post.id}` }, getTitle(post))),
            publishDate,
            React.createElement("div", { dangerouslySetInnerHTML: { "__html": post.contentHtml } })));
    });
    const titlePrefix = heading || props.title;
    const title = (titlePrefix ? `${titlePrefix} - ` : "") + blogName;
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("title", null, title),
            React.createElement("meta", { name: "viewport", content: "width=device-width" }),
            React.createElement("meta", { name: "description", content: "The blog of a simple web site" }),
            React.createElement("link", { rel: "alternate", type: "application/rss+xml", href: "/blog/rss", title: blogName }),
            React.createElement("link", { rel: "stylesheet", href: "/xcode.css" })),
        React.createElement("body", null,
            React.createElement("h1", null,
                React.createElement("a", { href: "/blog" }, "The blog of simple-website-with-blog")),
            React.createElement("ul", null, archives),
            React.createElement("p", null,
                React.createElement("a", { href: "/blog/post/about" }, "About this blog")),
            props.period ? React.createElement("h2", null, heading) : null,
            posts)));
};
module.exports.getRssMetadata = () => {
    const author = "David Anson";
    return {
        "title": blogName,
        "description": "The blog of a simple web site",
        author,
        "copyright": `Copyright \u00a9 2006-${new Date().getFullYear()} by ${author}`
    };
};
