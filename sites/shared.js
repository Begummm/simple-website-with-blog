"use strict";
const React = require("react");
const dateFormatOptionsWeekday = {
    "weekday": "long",
    "year": "numeric",
    "month": "long",
    "day": "numeric"
};
const dateFormatOptionsDay = {
    "year": "numeric",
    "month": "long",
    "day": "numeric"
};
const dateFormatOptionsMonth = {
    "year": "numeric",
    "month": "long"
};
module.exports.dateTimeFormatWeekday = new Intl.DateTimeFormat("en-US", dateFormatOptionsWeekday);
module.exports.dateTimeFormatDay = new Intl.DateTimeFormat("en-US", dateFormatOptionsDay);
const dateTimeFormatMonth = new Intl.DateTimeFormat("en-US", dateFormatOptionsMonth);
module.exports.getArchiveList = (archives) => archives.
    map((period) => {
    const year = period.
        getFullYear().
        toString().
        padStart(4, "0");
    const month = (period.getMonth() + 1).
        toString().
        padStart(2, "0");
    const archiveLink = `${year}${month}`;
    return (React.createElement("li", { key: archiveLink },
        React.createElement("a", { href: `/blog/archive/${archiveLink}` }, dateTimeFormatMonth.format(period))));
});
module.exports.getTitleHeading = (props, strings) => {
    let heading = null;
    if (props.period) {
        heading = `Posts from ${dateTimeFormatMonth.format(props.period)}`;
    }
    else if (props.query) {
        heading = `Search: ${props.query}`;
    }
    const title = [
        props.title || heading,
        strings.title
    ].
        filter((part) => Boolean(part)).
        join(" - ");
    return {
        title,
        heading
    };
};
module.exports.getPrevNextLinks = (props) => {
    const nextLink = props.nextLink ? React.createElement("a", { href: props.nextLink },
        "\u00ab",
        " Older Posts") : null;
    const prevLink = props.prevLink ? React.createElement("a", { href: props.prevLink },
        "Newer Posts ",
        "\u00bb") : null;
    return (nextLink || prevLink)
        ? React.createElement("div", null,
            nextLink,
            " ",
            nextLink && prevLink ? "-" : "",
            " ",
            prevLink)
        : null;
};
module.exports.getRssMetadata = (strings) => {
    const { title, description, author, copyright } = strings;
    return {
        title,
        description,
        author,
        copyright
    };
};
