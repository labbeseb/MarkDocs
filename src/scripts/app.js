//TODO : finir de commenter les methodes
//TODO : faire la doc de markdocs...
//TODO : page d'erreur si .md pas trouvé
//TODO : trier liste filesNav
//TODO : (moins important) - loader au chargement des fichiers de doc

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
        container_filesNav: 'markdocs-nav-files',
        container_loadRender: 'markdocs-renderLoad',
        data_btnFilesNav: 'file-name'
    }
};


class Markdocs {

    constructor(options){
        const th = this;

        // =*= Propriétés
        th._settings = Markdocs._mergeOptions(options);
        th._docFiles = [];

        // =*= Vérifications
        if( typeof th._settings.mdFiles === 'undefined' || !$.isArray(th._settings.mdFiles) )
            throw new Error(`Il manque l'index mdFiles, mdFiles doit être un tableau...`);

        // =*= Execution
        th._init();

        // =*= Events
        $('body').on('click', 'button', function(){
            th._loadPage(th._settings.mdFiles, $(this).data(th._settings.genericNames.data_btnFilesNav));
        });
    }

    /**
     * Chargement de la page avec le fichier par défaut à l'arrivée sur la doc
     *
     * @private
     */
    _init(){
        this._loadPage(this._settings.mdFiles, this._settings.mdFiles[0]);
    }

    /**
     * Merge les options user/default et retourne l'objet correspondant
     *
     * @private
     */
    static _mergeOptions(options){
        return $.extend( true, {}, Defaults, options );
    }

    /**
     * Chargement ou rechargement de la page en fonction de la catégorie choisie
     *
     * @param arrayFiles
     * @param filePage
     * @private
     */
    _loadPage(arrayFiles, filePage){

        // -**- Lit le fichier md, le converti en html et envoie son contenu à la vue
        Markdocs._readMdFile(filePage, data => {

            this._sendToHtml( this._parseMdToHtml(data) );

        });

        // -**- attend la fin du chargement du contenu pour générer la navigation...
        $(`#${this._settings.genericNames.loadRender}`).ready( () => {
            setTimeout( () => {
                // -***-
                this._createNavPage();

                Markdocs._convertToObject(arrayFiles, this._docFiles);

                if(arrayFiles.length > 1) {
                    this._createNavFiles();
                }
            }, 100);
        });
    }

    _sendToHtml(txt){
        $( `#${this._settings.genericNames.container_docBody}` )
            .html( `<div id="${this._settings.genericNames.container_loadRender}">${txt}</div>` );
    }

    _parseMdToHtml(md){
        let converter = new sdn.Converter();

        // application des options
        for (let opp in this._settings.showdownOptions){
            converter.setOption(opp, this._settings.showdownOptions[opp]);
        }

        return converter.makeHtml(md);
    }

    _createNavFiles(){
        const th = this;

        // création du container
        let template = `<hr><div id="${th._settings.genericNames.container_filesNav}"><p>Catégories disponibles&nbsp;:</p></div>`;

        $(`#${th._settings.genericNames.container_docNav}`).append(template);

        // parcourt du tableau de fichiers
        th._docFiles.forEach(function(obj){
            $(`#${th._settings.genericNames.container_filesNav}`)
                .append(
                    `<span>
                        <button data-${th._settings.genericNames.data_btnFilesNav}="${obj['path']}" class="btn__navfiles">${obj['name']}</button>
                    </span>`);
        });
    }

    _createNavPage(){
        const th = this;

        let titleList = $('h1, h2, h3, h4, h5, h6'),
            template = `<nav><ul></ul></nav>`;

        $(`#${th._settings.genericNames.container_docNav}`).html(template);

        titleList.each( function(){
            let classTitle = `title_nav title_${ $(this).get(0).tagName }`;

            $(`#${th._settings.genericNames.container_docNav}`).find('ul').append(`<li><a class="${classTitle}" href="#${ $(this).attr('id') }">${ $(this).html() }</a></li>`)
        });
    }


    static _rmExtension(file){

        let arr = file.trim().split('.');
        arr.pop();

        let stringPath = arr.join('.'),
            resultNameArr = stringPath.split('/');

        return resultNameArr.pop();
    }

    static _convertToObject(array, obj){

        for(let i=0; array.length > i; i++){
            obj[i] = {};
            obj[i].name = Markdocs._rmExtension(array[i]);
            obj[i].path = array[i];
        }
    }

    static _readMdFile(urlFile, action){

        let reader = new XMLHttpRequest();

        reader.onload = function(){
            let data = this.responseText;

            if(typeof action === 'function') {
                action(data);
            }
        };

        reader.open("GET", urlFile + ((/\?/).test(urlFile) ? "&" : "?") + (new Date()).getTime(), true);

        reader.overrideMimeType("text/markdown; charset=UTF-8");
        reader.setRequestHeader("Cache-Control", "no-cache");

        if(reader.status == 0 || reader.status == 200) {
            return reader.send();
        }else{
            throw new Error('Il y a eu une erreur lors du chargement du fichier...');
        }
    }
}