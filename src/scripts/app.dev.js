"use strict";

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _showdown = require("showdown");

var _showdown2 = _interopRequireDefault(_showdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO : modifier en objet parametrable dans le front
//TODO : définir style navigation files avec séparateur de la nav principale
//TODO : faire la doc de markdocs.........
//TODO : (moins important) - loader au chergement des fichiers de doc

if (typeof mdFiles === 'undefined' || !_jquery2.default.isArray(mdFiles)) throw new Error("Il manque la variable mdFiles, mdFiles doit être un tableau...");

var MdFiles = mdFiles,
    GenericNames = {
    docBody: 'markdocs-render',
    docNav: 'markdocs-nav',
    filesNav: 'markdocs-nav-files',
    loadRender: 'markdocs-renderLoad',
    data_btnFilesNav: 'file-name'
},
    Uri = window.location.protocol + '//' + window.location.hostname,
    ShowdownOptions = {
    'tables': true
};

var DocFiles = []; // tableau qui des différents fichiers de doc et leurs infos

function rmExtension(file) {

    var arr = file.trim().split('.');
    arr.pop();

    return arr.join('.');
}

function convertToObject(array) {

    for (var i = 0; array.length > i; i++) {
        DocFiles[i] = {};
        DocFiles[i].name = rmExtension(array[i]);
        DocFiles[i].path = array[i];
    }
}

function sendToHtml(txt) {

    (0, _jquery2.default)("#" + GenericNames.docBody).html("<div id=\"" + GenericNames.loadRender + "\">" + txt + "</div>");
}

function readMdFile(urlFile, action) {

    var reader = new XMLHttpRequest();

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

    // application des options
    for (var opp in ShowdownOptions) {
        converter.setOption(opp, ShowdownOptions[opp]);
    }

    return converter.makeHtml(md);
}

function createNavFiles() {
    // création du container
    (0, _jquery2.default)("#" + GenericNames.docNav).append("<nav><ul id=\"" + GenericNames.filesNav + "\"></ul></nav>");

    // parcourt du tableau de fichiers
    DocFiles.forEach(function (obj) {
        (0, _jquery2.default)("#" + GenericNames.filesNav).append("<li>\n                    <button data-" + GenericNames.data_btnFilesNav + "=\"" + obj['path'] + "\">" + obj['name'] + "</button>\n                </li>");
    });
}
function createNavPage() {
    var titleList = (0, _jquery2.default)('h1, h2, h3, h4, h5, h6'),
        template = "<nav><ul></ul></nav>";

    (0, _jquery2.default)("#" + GenericNames.docNav).html(template);

    titleList.each(function () {
        var classTitle = "title_nav title_" + (0, _jquery2.default)(this).get(0).tagName;

        (0, _jquery2.default)("#" + GenericNames.docNav).find('ul').append("<li><a class=\"" + classTitle + "\" href=\"#" + (0, _jquery2.default)(this).attr('id') + "\">" + (0, _jquery2.default)(this).html() + "</a></li>");
    });
}

function initPage(filePage) {
    readMdFile(filePage, function (data) {
        sendToHtml(parseMdToHtml(data));
    });

    (0, _jquery2.default)("#" + GenericNames.loadRender).ready(function () {
        setTimeout(function () {
            createNavPage();

            convertToObject(MdFiles);
            createNavFiles();
        }, 100);
    });
}

/*===============================
 === Execution de l'application
 ================================*/
(function () {

    initPage(MdFiles[0]);

    (0, _jquery2.default)('body').on('click', 'button', function () {
        initPage((0, _jquery2.default)(this).data(GenericNames.data_btnFilesNav));
    });
})();
