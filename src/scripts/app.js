//TODO : faire la doc de markdocs...
//TODO : page d'erreur si .md pas trouvé
//TODO : trier liste filesNav
//TODO : (moins important) - loader au chargement des fichiers de doc

let $ = jQuery,
    sdn = showdown;


const   GenericNames = {
        docBody: 'markdocs-render',
        docNav: 'markdocs-nav',
        filesNav: 'markdocs-nav-files',
        loadRender: 'markdocs-renderLoad',
        data_btnFilesNav: 'file-name'
    },
        ShowdownOptions = {
            'tables': true
        },
        DefaultOptions = {
        };

let DocFiles = [];// tableau d'objet qui liste les différents fichiers de doc et leurs infos


class Markdocs {

    constructor(options){
        // =*= Propriétés
        this._options = {};
        this._options.filesArray = options.mdFiles;

        // =*= Vérifications
        if( typeof this._options.filesArray === 'undefined' || !$.isArray(this._options.filesArray) )
            throw new Error(`Il manque l'index mdFiles, mdFiles doit être un tableau...`);

        // =*= Execution
        Markdocs._initPage(this._options.filesArray, this._options.filesArray[0]);
    }

    static _rmExtension(file){

        let arr = file.trim().split('.');
        arr.pop();

        let stringPath = arr.join('.'),
            resultNameArr = stringPath.split('/');

        return resultNameArr.pop();
    }

    static _convertToObject(array){

        for(let i=0; array.length > i; i++){
            DocFiles[i] = {};
            DocFiles[i].name = this._rmExtension(array[i]);
            DocFiles[i].path = array[i];
        }
    }

    static _sendToHtml(txt){

        $(`#${GenericNames.docBody}`).html(`<div id="${GenericNames.loadRender}">${txt}</div>`);

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

    static _parseMdToHtml(md){
        let converter = new sdn.Converter();

        // application des options
        for (let opp in ShowdownOptions){
            converter.setOption(opp, ShowdownOptions[opp]);
        }

        return converter.makeHtml(md);

    }

    static _createNavFiles(){
        // création du container
        let template = `<hr><div id="${GenericNames.filesNav}"><p>Catégories disponibles&nbsp;:</p></div>`;

        $(`#${GenericNames.docNav}`).append(template);

        // parcourt du tableau de fichiers
        DocFiles.forEach(function(obj){
            $(`#${GenericNames.filesNav}`)
                .append(
                    `<span>
                        <button data-${GenericNames.data_btnFilesNav}="${obj['path']}" class="btn__navfiles">${obj['name']}</button>
                    </span>`);
        });
    }

    static _createNavPage(){
        let titleList = $('h1, h2, h3, h4, h5, h6'),
            template = `<nav><ul></ul></nav>`;

        $(`#${GenericNames.docNav}`).html(template);

        titleList.each( function(){
            let classTitle = `title_nav title_${ $(this).get(0).tagName }`;

            $(`#${GenericNames.docNav}`).find('ul').append(`<li><a class="${classTitle}" href="#${ $(this).attr('id') }">${ $(this).html() }</a></li>`)
        });
    }

    static _initPage(arrayFiles, filePage){

        // -**- Lit le fichier md, le converti en html et envoie son contenu à la vue
        Markdocs._readMdFile(filePage, data => {

            Markdocs._sendToHtml( Markdocs._parseMdToHtml(data) );

        });

        // -**- attend la fin du chargement du contenu pour générer la navigation...
        $(`#${GenericNames.loadRender}`).ready( () => {
            setTimeout( () => {
                // -***-
                Markdocs._createNavPage();

                Markdocs._convertToObject(arrayFiles);
                console.log(arrayFiles);

                if(arrayFiles.length > 1) {
                    Markdocs._createNavFiles();
                }
            }, 100);
        });
    }
}




/*


 function rmExtension(file){

 let arr = file.trim().split('.');
 arr.pop();

 let stringPath = arr.join('.'),
 resultNameArr = stringPath.split('/');

 return resultNameArr.pop();
 }

 function convertToObject(array){

 for(let i=0; array.length > i; i++){
 DocFiles[i] = {};
 DocFiles[i].name = rmExtension(array[i]);
 DocFiles[i].path = array[i];
 }
 }

 function sendToHtml(txt){

 $(`#${GenericNames.docBody}`).html(`<div id="${GenericNames.loadRender}">${txt}</div>`);

 }

 function readMdFile(urlFile, action){

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

 function parseMdToHtml(md){
 let converter = new showdown.Converter();

 // application des options
 for (let opp in ShowdownOptions){
 converter.setOption(opp, ShowdownOptions[opp]);
 }

 return converter.makeHtml(md);

 }

 function createNavFiles(){
 // création du container
 let template = `<hr><div id="${GenericNames.filesNav}"><p>Catégories disponibles&nbsp;:</p></div>`;
 $(`#${GenericNames.docNav}`).append(template);

 // parcourt du tableau de fichiers
 DocFiles.forEach(function(obj){
 $(`#${GenericNames.filesNav}`)
 .append(
 `<span>
 <button data-${GenericNames.data_btnFilesNav}="${obj['path']}" class="btn__navfiles">${obj['name']}</button>
 </span>`);
 });

 }

 function createNavPage(){
 let titleList = $('h1, h2, h3, h4, h5, h6'),
 template = `<nav><ul></ul></nav>`;

 $(`#${GenericNames.docNav}`).html(template);

 titleList.each( function(){
 let classTitle = `title_nav title_${ $(this).get(0).tagName }`;

 $(`#${GenericNames.docNav}`).find('ul').append(`<li><a class="${classTitle}" href="#${ $(this).attr('id') }">${ $(this).html() }</a></li>`)
 });
 }

 function initPage(filePage){
 readMdFile(filePage, data => {
 sendToHtml(parseMdToHtml(data));
 });

 $(`#${GenericNames.loadRender}`).ready( () =>{
 setTimeout( () => {
 createNavPage();

 convertToObject(MdFiles);

 if(MdFiles.length > 1) {
 createNavFiles();
 }
 }, 100);
 });
 }


 /!*===============================
 === Execution de l'application
 ================================*!/
 (function(){

 initPage(MdFiles[0]);

 $('body').on('click', 'button', function(){
 initPage( $(this).data(GenericNames.data_btnFilesNav) );
 });

 })();*/
