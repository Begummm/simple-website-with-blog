"use strict";
// eslint-disable-next-line no-unused-vars
const React = require("react");
const dateFormatOptionsWeekday = {
    "weekday": "long",
    "year": "numeric",
    "month": "long",
    "day": "numeric"
};
const dateFormatOptionsNoWeekday = {
    "year": "numeric",
    "month": "long",
    "day": "numeric"
};
const dateTimeFormatWeekday = new Intl.DateTimeFormat("en-US", dateFormatOptionsWeekday);
const dateTimeFormatNoWeekday = new Intl.DateTimeFormat("en-US", dateFormatOptionsNoWeekday);
module.exports = (props) => {
    const posts = props.posts.map((post) => {
        const content = post.contentJson.map((photo, index) => {
            const src = `/photos/${photo.image}`;
            const srcSet = photo.image2x ? `/photos/${photo.image2x} 2x` : null;
            return (React.createElement("div", { key: index },
                React.createElement("img", { src: src, srcSet: srcSet, alt: photo.caption }),
                React.createElement("p", null, photo.caption)));
        });
        const contentDate = dateTimeFormatNoWeekday.format(post.contentDate);
        const date = dateTimeFormatWeekday.format(post.date);
        return (React.createElement("section", { key: post.id },
            React.createElement("hr", null),
            React.createElement("h2", null,
                React.createElement("a", { href: `/blog/post/${post.id}` },
                    contentDate,
                    " - ",
                    post.title)),
            content,
            React.createElement("p", null,
                "Posted ",
                React.createElement("time", { dateTime: post.date.toISOString() }, date))));
    });
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("title", null, "simple-website-with-blog/sample-photo"),
            React.createElement("meta", { name: "viewport", content: "width=device-width" }),
            React.createElement("meta", { name: "description", content: "The photo blog of a simple web site" })),
        React.createElement("body", null,
            React.createElement("h1", null,
                React.createElement("a", { href: "/blog" }, "The photo blog of simple-website-with-blog")),
            posts)));
};
