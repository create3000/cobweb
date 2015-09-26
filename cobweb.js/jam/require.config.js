var jam = {
    "packages": [
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-mousewheel",
            "location": "jam/jquery-mousewheel",
            "main": "jquery.mousewheel.js"
        },
        {
            "name": "require",
            "location": "jam/require",
            "main": "require.min.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
    ],
    "version": "0.2.17",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-mousewheel",
            "location": "jam/jquery-mousewheel",
            "main": "jquery.mousewheel.js"
        },
        {
            "name": "require",
            "location": "jam/require",
            "main": "require.min.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
    ],
    "shim": {}
});
}
else {
    var require = {
    "packages": [
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-mousewheel",
            "location": "jam/jquery-mousewheel",
            "main": "jquery.mousewheel.js"
        },
        {
            "name": "require",
            "location": "jam/require",
            "main": "require.min.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
    ],
    "shim": {}
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}