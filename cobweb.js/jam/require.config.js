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
        {
            "name": "poly2tri",
            "location": "jam/poly2tri.js",
            "main": "dist/poly2tri.js"
        },
        {
            "name": "jquery-resize",
            "location": "jam/jquery-resize",
            "main": "jquery.ba-resize.min.js"
        }
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
        {
            "name": "poly2tri",
            "location": "jam/poly2tri.js",
            "main": "dist/poly2tri.js"
        },
        {
            "name": "jquery-resize",
            "location": "jam/jquery-resize",
            "main": "jquery.ba-resize.min.js"
        }
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
        {
            "name": "poly2tri",
            "location": "jam/poly2tri.js",
            "main": "dist/poly2tri.js"
        },
        {
            "name": "jquery-resize",
            "location": "jam/jquery-resize",
            "main": "jquery.ba-resize.min.js"
        }
    ],
    "shim": {}
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}