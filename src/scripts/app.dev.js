"use strict";

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _showdown = require("showdown");

var _showdown2 = _interopRequireDefault(_showdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContainerHtml = 'markdocs-render',
    ContainerNav = 'markdocs-nav',
    Uri = window.location.protocol + '//' + window.location.hostname;

function sendToHtml(txt) {

    (0, _jquery2.default)("#" + ContainerHtml).html(txt);
}

function readMdFile(file, action) {

    var reader = new XMLHttpRequest(),
        urlFile = Uri + "/" + file;

    reader.onload = function () {
        var data = this.responseText;

        if (typeof action === 'function') {
            action(data);
        }
    };

    reader.open("GET", urlFile + (/\?/.test(urlFile) ? "&" : "?") + new Date().getTime(), true);

    reader.overrideMimeType("text/markdown; charset=UTF-8");
    reader.setRequestHeader("Cache-Control", "no-cache");

    if (reader.status == 0 || reader.status == 200) {
        return reader.send();
    } else {
        throw new Error('Il y a eu une erreur lors du chargement du fichier...');
    }
}

function parseMdToHtml(md) {
    var converter = new _showdown2.default.Converter();

    return converter.makeHtml(md);
}

function createNav() {
    var titleList = (0, _jquery2.default)('h1, h2, h3, h4, h5, h6'),
        template = "<nav><ul></ul></nav>";

    (0, _jquery2.default)("#" + ContainerNav).html(template);

    titleList.each(function () {
        var classTitle = "title_nav title_" + (0, _jquery2.default)(this).get(0).tagName;

        (0, _jquery2.default)("#" + ContainerNav).find('ul').append("<li><a class=\"" + classTitle + "\" href=\"#" + (0, _jquery2.default)(this).attr('id') + "\">" + (0, _jquery2.default)(this).html() + "</a></li>");
    });

    console.log(titleList);
}

/*===============================

 ================================*/
readMdFile('sample.md', function (data) {
    var mdTxt = parseMdToHtml(data);

    sendToHtml(mdTxt);
});

setTimeout(function () {
    createNav();
}, 1500);
