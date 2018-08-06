"use strict";
const React = require("react");
const shared = require("../" + "shared.js");
const getTitle = (post) => {
    const contentDate = shared.dateTimeFormatDay.format(post.contentDate);
    return `${contentDate} - ${post.title}`;
};
module.exports.getTitle = getTitle;
module.exports.getContentElements = (post) => {
    const content = post.contentJson.map((photo, index) => {
        const src = `/photos/${photo.image}`;
        const srcSet = photo.image2x ? `/photos/${photo.image2x} 2x` : null;
        return (React.createElement("div", { key: index },
            React.createElement("img", { src: src, srcSet: srcSet, alt: photo.caption }),
            React.createElement("p", null, photo.caption)));
    });
    return React.createElement("div", null, content);
};
module.exports.getHtmlElements = (props) => {
    const archives = shared.getArchiveList(props.archives);
    const heading = props.period
        ? React.createElement("h2", null,
            "Posts from ",
            shared.dateTimeFormatMonth.format(props.period))
        : null;
    const posts = props.posts.map((post) => {
        const date = shared.dateTimeFormatWeekday.format(post.date);
        return (React.createElement("section", { key: post.id },
            React.createElement("hr", null),
            React.createElement("h2", null,
                React.createElement("a", { href: `/blog/post/${post.id}` }, getTitle(post))),
            React.createElement("div", { dangerouslySetInnerHTML: { "__html": post.contentHtml } }),
            React.createElement("p", null,
                "Posted ",
                React.createElement("time", { dateTime: post.date.toISOString() }, date))));
    });
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("title", null, "simple-website-with-blog/sample-photo"),
            React.createElement("meta", { name: "viewport", content: "width=device-width" }),
            React.createElement("meta", { name: "description", content: "The photo blog of a simple web site" }),
            React.createElement("link", { rel: "alternate", type: "application/rss+xml", href: "/blog/rss", title: "simple-website-with-blog/sample-photo" })),
        React.createElement("body", null,
            React.createElement("h1", null,
                React.createElement("a", { href: "/blog" }, "The photo blog of simple-website-with-blog")),
            React.createElement("ul", null, archives),
            heading,
            posts)));
};
module.exports.getRssMetadata = () => {
    const author = "David Anson";
    return {
        "title": "simple-website-with-blog/sample-photo",
        "description": "The photo blog of a simple web site",
        author,
        "copyright": `Copyright \u00a9 2004-${new Date().getFullYear()} by ${author}`
    };
};
