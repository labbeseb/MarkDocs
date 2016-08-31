//TODO: unit tests !!!
//TODO: page d'erreur si .md pas trouvé
//TODO: rappel de la page courante en cas de rechergement (suppression #nav + stockage dernière page en Local Storage ?)
//TODO: (moins important) - loader au chargement des fichiers de doc

let $ = jQuery,
    sdn = showdown;

const Defaults = {
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


class Markdocs {

    constructor(options) {
        const th = this;

        // =*= Propriétés
        th._settings = Markdocs._mergeOptions(options);
        th._docFiles = [];
        th._timerLoadNav = 400;

        // =*= Vérifications du tableau de fichiers
        if (typeof th._settings.mdFiles === 'undefined' || !$.isArray(th._settings.mdFiles) || th._settings.mdFiles.length <= 0)
            throw new Error(`Il manque l'index mdFiles, mdFiles doit être un tableau...`);

        // =*= Execution
        th._init();

        // =*= Events
        $('body').on('click', 'button', function () {
            $(`#${th._settings.genericNames.container_docNav}`);
            // .find(`#${th._settings.genericNames.container_navGenerated}`).fadeOut(th._timerLoadNav);

            th._loadPage(th._settings.mdFiles, $(this).data(th._settings.genericNames.data_btnFilesNav));
        });
    }

    /**
     * Chargement de la page avec le fichier par défaut à l'arrivée sur la doc
     *
     * @private
     */
    _init() {
        this._loadPage(this._settings.mdFiles, this._settings.mdFiles[0]);
    }

    /**
     * Chargement ou rechargement de la page en fonction de la catégorie choisie
     *
     * @param arrayFiles
     * @param filePage
     * @private
     */
    _loadPage(arrayFiles, filePage) {

        // -**- Lit le fichier md, le converti en html et envoie son contenu à la vue
        Markdocs._readMdFile(filePage, data => {

            this._sendToHtml(this._parseMdToHtml(data));

        });

        // -**- attend la fin du chargement du contenu pour générer la navigation...
        $(`#${this._settings.genericNames.container_loadRender}`).ready(() => {
            setTimeout(() => {
                this._createNavPage();

                Markdocs._convertToObject(arrayFiles, this._docFiles, this._settings.categoriesLvl);

                if (arrayFiles.length > 1) {
                    this._createNavFiles();
                }
            }, this._timerLoadNav);
        });
    }

    /**
     * Insert le texte de la documentation dans le template
     *
     * @param txt
     * @private
     */
    _sendToHtml(txt) {
        $(`#${this._settings.genericNames.container_docBody}`)
            .html(`<div id="${this._settings.genericNames.container_loadRender}">${txt}</div>`);
    }

    /**
     * Converti le MD en html
     *
     * @param md
     * @param converter
     * @returns {*}
     * @private
     */
    _parseMdToHtml(md, converter = new sdn.Converter()) {

        // application des options
        for (let opp in this._settings.showdownOptions) {
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
    _createNavFiles() {
        const th = this;

        // création du container
        let template = `<hr><div id="${th._settings.genericNames.container_filesNav}"><p id="markdocs-cat-maintitle">Pages&nbsp;:</p><div id="markdocs-uncategorized"></div></div>`;

        $(`#${th._settings.genericNames.container_docNav}`).append(template);

        let selCtn =  $(`#${th._settings.genericNames.container_filesNav}`);

        // parcourt du tableau de fichiers
        th._docFiles.forEach(function (obj) {

            if(obj.category === undefined || th._settings.categoriesActived == false) {
                selCtn.find('#markdocs-uncategorized')
                    .append(
                        `<span>
                            <button data-${th._settings.genericNames.data_btnFilesNav}="${obj['path']}" class="btn__navfiles">${obj['name']}</button>
                        </span>`);
            }else{
                if( $(`#markdocs-cat-${obj.category}`).length > 0 ) {
                    selCtn.find(`#markdocs-cat-${obj.category}`)
                        .append(
                            `<span>
                                <button data-${th._settings.genericNames.data_btnFilesNav}="${obj['path']}" class="btn__navfiles">${obj['name']}</button>
                            </span>`);
                }else{
                    selCtn.append(
                        `<div id="markdocs-cat-${obj.category}">
                            <p id="markdocs-cat-title">${obj.category}</p>
                            <span>
                                <button data-${th._settings.genericNames.data_btnFilesNav}="${obj['path']}" class="btn__navfiles">${obj['name']}</button>
                            </span>
                        </div>`);
                }
            }
        });
    }

    /**
     * Liste les titres de la page et créé la navigation du fichier lu
     *
     * @private
     */
    _createNavPage() {
        const th = this;

        let titleList = $('h1, h2, h3, h4, h5, h6'),
            template = `<nav id="${th._settings.genericNames.container_navGenerated}"><ul></ul></nav>`;

        $(`#${th._settings.genericNames.container_docNav}`)
            .html(template);
        // .find(`#${th._settings.genericNames.container_navGenerated}`).fadeIn('fast');

        titleList.each(function () {
            let classTitle = `title_nav title_${ $(this).get(0).tagName }`;

            $(`#${th._settings.genericNames.container_docNav}`).find('ul').append(`<li><a class="${classTitle}" href="#${ $(this).attr('id') }">${ $(this).html() }</a></li>`)
        });
    }




    /**
     * Merge les options user/default et retourne l'objet correspondant
     *
     * @private
     */
    static _mergeOptions(options) {
        return $.extend(true, {}, Defaults, options);
    }

    /**
     * Supprime l'extension d'un fichier
     *
     * @param file
     * @returns {*}
     * @private
     */
    static _getFileName(file) {

        let arr = file.trim().split('.');
        arr.pop();

        let stringPath = arr.join('.'),
            resultNameArr = stringPath.split('/');

        return resultNameArr.pop();
    }


    static _convertPathToCategory(file, lvl) {

        let arr = file.trim().split('/');

        // test si le niveau de dossier existe...
        if (arr.length > lvl + 1)
            return (arr[lvl]);// ...et retourne le nom
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
    static _convertToObject(array, obj, categoryLvl) {

        for (let i = 0; array.length > i; i++) {
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
    static _readMdFile(urlFile, action) {

        let reader = new XMLHttpRequest();

        reader.onload = function () {
            let data = this.responseText;

            if (typeof action === 'function') {
                action(data);
            }
        };

        reader.open("GET", urlFile + ((/\?/).test(urlFile) ? "&" : "?") + (new Date()).getTime(), true);

        reader.overrideMimeType("text/markdown; charset=UTF-8");
        reader.setRequestHeader("Cache-Control", "no-cache");

        if (reader.status == 0 || reader.status == 200) {
            return reader.send();
        } else {
            throw new Error('Il y a eu une erreur lors du chargement du fichier...');
        }
    }
}