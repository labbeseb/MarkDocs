"use strict";

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _showdown = require("showdown");

var _showdown2 = _interopRequireDefault(_showdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TxtString = "#Un texte n'importe quoi !",
    // === temporaire
ContainerHtml = 'markdocs-render',
    uri = window.location.protocol + '//' + window.location.hostname;

function sendToHtml(txt) {

    (0, _jquery2.default)("#" + ContainerHtml).html(txt);
}

function readMdFile(file) {}

function parseMdToHtml(md) {
    var converter = new _showdown2.default.Converter();

    return converter.makeHtml(md);
}

sendToHtml(parseMdToHtml(TxtString));
