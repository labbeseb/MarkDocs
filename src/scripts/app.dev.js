'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO : modifier en library
//TODO : définir style navigation files avec séparateur de la nav principale
//TODO : faire la doc de markdocs.........
//TODO : page d'erreur si .md pas trouvé
//TODO : (moins important) - loader au chargement des fichiers de doc


var Markdocs = function Markdocs(options) {
    _classCallCheck(this, Markdocs);

    this.options = options;
    console.log(options);
};

if (typeof mdFiles === 'undefined' || !$.isArray(mdFiles)) throw new Error('Il manque la variable mdFiles, mdFiles doit être un tableau...');

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

    var stringPath = arr.join('.'),
        resultNameArr = stringPath.split('/');

    return resultNameArr.pop();
}

function convertToObject(array) {

    for (var i = 0; array.length > i; i++) {
        DocFiles[i] = {};
        DocFiles[i].name = rmExtension(array[i]);
        DocFiles[i].path = array[i];
    }
}

function sendToHtml(txt) {

    $('#' + GenericNames.docBody).html('<div id="' + GenericNames.loadRender + '">' + txt + '</div>');
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
    var converter = new showdown.Converter();

    // application des options
    for (var opp in ShowdownOptions) {
        converter.setOption(opp, ShowdownOptions[opp]);
    }

    return converter.makeHtml(md);
}

function createNavFiles() {
    // création du container
    var template = '<hr><div id="' + GenericNames.filesNav + '"><p>Catégories disponibles&nbsp;:</p></div>';
    $('#' + GenericNames.docNav).append(template);

    // parcourt du tableau de fichiers
    DocFiles.forEach(function (obj) {
        $('#' + GenericNames.filesNav).append('<span>\n                    <button data-' + GenericNames.data_btnFilesNav + '="' + obj['path'] + '" class="btn__navfiles">' + obj['name'] + '</button>\n                </span>');
    });
}
function createNavPage() {
    var titleList = $('h1, h2, h3, h4, h5, h6'),
        template = '<nav><ul></ul></nav>';

    $('#' + GenericNames.docNav).html(template);

    titleList.each(function () {
        var classTitle = 'title_nav title_' + $(this).get(0).tagName;

        $('#' + GenericNames.docNav).find('ul').append('<li><a class="' + classTitle + '" href="#' + $(this).attr('id') + '">' + $(this).html() + '</a></li>');
    });
}

function initPage(filePage) {
    readMdFile(filePage, function (data) {
        sendToHtml(parseMdToHtml(data));
    });

    $('#' + GenericNames.loadRender).ready(function () {
        setTimeout(function () {
            createNavPage();

            convertToObject(MdFiles);

            if (MdFiles.length > 1) {
                createNavFiles();
            }
        }, 100);
    });
}

/*===============================
 === Execution de l'application
 ================================*/
(function () {

    initPage(MdFiles[0]);

    $('body').on('click', 'button', function () {
        initPage($(this).data(GenericNames.data_btnFilesNav));
    });
})();
