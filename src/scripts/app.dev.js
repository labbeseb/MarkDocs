'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO : finir de commenter les methodes
//TODO : faire la doc de markdocs...
//TODO : page d'erreur si .md pas trouvé
//TODO : trier liste filesNav par dossiers !!!
//TODO : (moins important) - loader au chargement des fichiers de doc

var $ = jQuery,
    sdn = showdown;

var Defaults = {
    mdFiles: undefined,
    showdownOptions: {
        'tables': true
    },
    genericNames: {
        container_docBody: 'markdocs-render',
        container_docNav: 'markdocs-nav',
        container_filesNav: 'markdocs-nav-files',
        container_loadRender: 'markdocs-renderLoad',
        data_btnFilesNav: 'file-name'
    }
};

var Markdocs = function () {
    function Markdocs(options) {
        _classCallCheck(this, Markdocs);

        var th = this;

        // =*= Propriétés
        th._settings = Markdocs._mergeOptions(options);
        th._docFiles = [];

        // =*= Vérifications
        if (typeof th._settings.mdFiles === 'undefined' || !$.isArray(th._settings.mdFiles)) throw new Error('Il manque l\'index mdFiles, mdFiles doit être un tableau...');

        // =*= Execution
        th._init();

        // =*= Events
        $('body').on('click', 'button', function () {
            th._loadPage(th._settings.mdFiles, $(this).data(th._settings.genericNames.data_btnFilesNav));
        });
    }

    /**
     * Chargement de la page avec le fichier par défaut à l'arrivée sur la doc
     *
     * @private
     */


    _createClass(Markdocs, [{
        key: '_init',
        value: function _init() {
            this._loadPage(this._settings.mdFiles, this._settings.mdFiles[0]);
        }

        /**
         * Merge les options user/default et retourne l'objet correspondant
         *
         * @private
         */

    }, {
        key: '_loadPage',


        /**
         * Chargement ou rechargement de la page en fonction de la catégorie choisie
         *
         * @param arrayFiles
         * @param filePage
         * @private
         */
        value: function _loadPage(arrayFiles, filePage) {
            var _this = this;

            // -**- Lit le fichier md, le converti en html et envoie son contenu à la vue
            Markdocs._readMdFile(filePage, function (data) {

                _this._sendToHtml(_this._parseMdToHtml(data));
            });

            // -**- attend la fin du chargement du contenu pour générer la navigation...
            $('#' + this._settings.genericNames.loadRender).ready(function () {
                setTimeout(function () {
                    // -***-
                    _this._createNavPage();

                    Markdocs._convertToObject(arrayFiles, _this._docFiles);

                    if (arrayFiles.length > 1) {
                        _this._createNavFiles();
                    }
                }, 100);
            });
        }
    }, {
        key: '_sendToHtml',
        value: function _sendToHtml(txt) {
            $('#' + this._settings.genericNames.container_docBody).html('<div id="' + this._settings.genericNames.container_loadRender + '">' + txt + '</div>');
        }
    }, {
        key: '_parseMdToHtml',
        value: function _parseMdToHtml(md) {
            var converter = new sdn.Converter();

            // application des options
            for (var opp in this._settings.showdownOptions) {
                converter.setOption(opp, this._settings.showdownOptions[opp]);
            }

            return converter.makeHtml(md);
        }
    }, {
        key: '_createNavFiles',
        value: function _createNavFiles() {
            var th = this;

            // création du container
            var template = '<hr><div id="' + th._settings.genericNames.container_filesNav + '"><p>Catégories disponibles&nbsp;:</p></div>';

            $('#' + th._settings.genericNames.container_docNav).append(template);

            // parcourt du tableau de fichiers
            th._docFiles.forEach(function (obj) {
                $('#' + th._settings.genericNames.container_filesNav).append('<span>\n                        <button data-' + th._settings.genericNames.data_btnFilesNav + '="' + obj['path'] + '" class="btn__navfiles">' + obj['name'] + '</button>\n                    </span>');
            });
        }
    }, {
        key: '_createNavPage',
        value: function _createNavPage() {
            var th = this;

            var titleList = $('h1, h2, h3, h4, h5, h6'),
                template = '<nav><ul></ul></nav>';

            $('#' + th._settings.genericNames.container_docNav).html(template);

            titleList.each(function () {
                var classTitle = 'title_nav title_' + $(this).get(0).tagName;

                $('#' + th._settings.genericNames.container_docNav).find('ul').append('<li><a class="' + classTitle + '" href="#' + $(this).attr('id') + '">' + $(this).html() + '</a></li>');
            });
        }
    }], [{
        key: '_mergeOptions',
        value: function _mergeOptions(options) {
            return $.extend(true, {}, Defaults, options);
        }
    }, {
        key: '_rmExtension',
        value: function _rmExtension(file) {

            var arr = file.trim().split('.');
            arr.pop();

            var stringPath = arr.join('.'),
                resultNameArr = stringPath.split('/');

            return resultNameArr.pop();
        }
    }, {
        key: '_convertToObject',
        value: function _convertToObject(array, obj) {

            for (var i = 0; array.length > i; i++) {
                obj[i] = {};
                obj[i].name = Markdocs._rmExtension(array[i]);
                obj[i].path = array[i];
            }
        }
    }, {
        key: '_readMdFile',
        value: function _readMdFile(urlFile, action) {

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
    }]);

    return Markdocs;
}();
