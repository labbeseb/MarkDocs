'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO: unit tests !!!
//TODO: page d'erreur si .md pas trouvé
//TODO: rappel de la page courante en cas de rechergement (suppression #nav + stockage dernière page en Local Storage ?)
//TODO: (moins important) - loader au chargement des fichiers de doc

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
        container_navGenerated: 'markdocs-nav-generated',
        container_filesNav: 'markdocs-nav-files',
        container_loadRender: 'markdocs-renderLoad',
        data_btnFilesNav: 'file-name'
    },
    categoriesActived: true,
    categoriesLvl: 1
};

var Markdocs = function () {
    function Markdocs(options) {
        _classCallCheck(this, Markdocs);

        var th = this;

        // =*= Propriétés
        th._settings = Markdocs._mergeOptions(options);
        th._docFiles = [];
        th._timerLoadNav = 400;

        // =*= Vérifications du tableau de fichiers
        if (typeof th._settings.mdFiles === 'undefined' || !$.isArray(th._settings.mdFiles) || th._settings.mdFiles.length <= 0) throw new Error('Il manque l\'index mdFiles, mdFiles doit être un tableau...');

        // =*= Execution
        th._init();

        // =*= Events
        $('body').on('click', 'button', function () {
            $('#' + th._settings.genericNames.container_docNav);
            // .find(`#${th._settings.genericNames.container_navGenerated}`).fadeOut(th._timerLoadNav);

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
         * Chargement ou rechargement de la page en fonction de la catégorie choisie
         *
         * @param arrayFiles
         * @param filePage
         * @private
         */

    }, {
        key: '_loadPage',
        value: function _loadPage(arrayFiles, filePage) {
            var _this = this;

            // -**- Lit le fichier md, le converti en html et envoie son contenu à la vue
            Markdocs._readMdFile(filePage, function (data) {

                _this._sendToHtml(_this._parseMdToHtml(data));
            });

            // -**- attend la fin du chargement du contenu pour générer la navigation...
            $('#' + this._settings.genericNames.container_loadRender).ready(function () {
                setTimeout(function () {
                    _this._createNavPage();

                    Markdocs._convertToObject(arrayFiles, _this._docFiles, _this._settings.categoriesLvl);

                    if (arrayFiles.length > 1) {
                        _this._createNavFiles();
                    }
                }, _this._timerLoadNav);
            });
        }

        /**
         * Insert le texte de la documentation dans le template
         *
         * @param txt
         * @private
         */

    }, {
        key: '_sendToHtml',
        value: function _sendToHtml(txt) {
            $('#' + this._settings.genericNames.container_docBody).html('<div id="' + this._settings.genericNames.container_loadRender + '">' + txt + '</div>');
        }

        /**
         * Converti le MD en html
         *
         * @param md
         * @param converter
         * @returns {*}
         * @private
         */

    }, {
        key: '_parseMdToHtml',
        value: function _parseMdToHtml(md) {
            var converter = arguments.length <= 1 || arguments[1] === undefined ? new sdn.Converter() : arguments[1];


            // application des options
            for (var opp in this._settings.showdownOptions) {
                converter.setOption(opp, this._settings.showdownOptions[opp]);
            }

            return converter.makeHtml(md);
        }

        /**
         * Parcourt le tableau de fichiers MD :
         * - extrait le nom du fichier (sans extension)
         * - créé la navigation entre fichiers
         *
         * @private
         */

    }, {
        key: '_createNavFiles',
        value: function _createNavFiles() {
            var th = this;

            // création du container
            var template = '<hr><div id="' + th._settings.genericNames.container_filesNav + '"><p id="markdocs-cat-maintitle">Pages&nbsp;:</p><div id="markdocs-uncategorized"></div></div>';

            $('#' + th._settings.genericNames.container_docNav).append(template);

            var selCtn = $('#' + th._settings.genericNames.container_filesNav);

            // parcourt du tableau de fichiers
            th._docFiles.forEach(function (obj) {

                if (obj.category === undefined || th._settings.categoriesActived == false) {
                    selCtn.find('#markdocs-uncategorized').append('<span>\n                            <button data-' + th._settings.genericNames.data_btnFilesNav + '="' + obj['path'] + '" class="btn__navfiles">' + obj['name'] + '</button>\n                        </span>');
                } else {
                    if ($('#markdocs-cat-' + obj.category).length > 0) {
                        selCtn.find('#markdocs-cat-' + obj.category).append('<span>\n                                <button data-' + th._settings.genericNames.data_btnFilesNav + '="' + obj['path'] + '" class="btn__navfiles">' + obj['name'] + '</button>\n                            </span>');
                    } else {
                        selCtn.append('<div id="markdocs-cat-' + obj.category + '">\n                            <p id="markdocs-cat-title">' + obj.category + '</p>\n                            <span>\n                                <button data-' + th._settings.genericNames.data_btnFilesNav + '="' + obj['path'] + '" class="btn__navfiles">' + obj['name'] + '</button>\n                            </span>\n                        </div>');
                    }
                }
            });
        }

        /**
         * Liste les titres de la page et créé la navigation du fichier lu
         *
         * @private
         */

    }, {
        key: '_createNavPage',
        value: function _createNavPage() {
            var th = this;

            var titleList = $('h1, h2, h3, h4, h5, h6'),
                template = '<nav id="' + th._settings.genericNames.container_navGenerated + '"><ul></ul></nav>';

            $('#' + th._settings.genericNames.container_docNav).html(template);
            // .find(`#${th._settings.genericNames.container_navGenerated}`).fadeIn('fast');

            titleList.each(function () {
                var classTitle = 'title_nav title_' + $(this).get(0).tagName;

                $('#' + th._settings.genericNames.container_docNav).find('ul').append('<li><a class="' + classTitle + '" href="#' + $(this).attr('id') + '">' + $(this).html() + '</a></li>');
            });
        }

        /**
         * Merge les options user/default et retourne l'objet correspondant
         *
         * @private
         */

    }], [{
        key: '_mergeOptions',
        value: function _mergeOptions(options) {
            return $.extend(true, {}, Defaults, options);
        }

        /**
         * Supprime l'extension d'un fichier
         *
         * @param file
         * @returns {*}
         * @private
         */

    }, {
        key: '_getFileName',
        value: function _getFileName(file) {

            var arr = file.trim().split('.');
            arr.pop();

            var stringPath = arr.join('.'),
                resultNameArr = stringPath.split('/');

            return resultNameArr.pop();
        }
    }, {
        key: '_convertPathToCategory',
        value: function _convertPathToCategory(file, lvl) {

            var arr = file.trim().split('/');

            // test si le niveau de dossier existe...
            if (arr.length > lvl + 1) return arr[lvl]; // ...et retourne le nom
        }

        /**
         * Converti un tableau de fichiers MD en objet litéral
         * - obj.name : nom du fichier sans l'extension
         * - obj.path : chemin relatif du fichier
         *
         * @param array
         * @param obj
         * @param categoryLvl
         * @private
         */

    }, {
        key: '_convertToObject',
        value: function _convertToObject(array, obj, categoryLvl) {

            for (var i = 0; array.length > i; i++) {
                obj[i] = {};
                obj[i].name = Markdocs._getFileName(array[i]);
                obj[i].path = array[i];
                obj[i].category = Markdocs._convertPathToCategory(array[i], categoryLvl);
            }
        }

        /**
         * Lit un fichier et execute un callback après la lecture
         *
         * @param urlFile
         * @param action
         * @private
         */

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
