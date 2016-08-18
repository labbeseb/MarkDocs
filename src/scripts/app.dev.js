'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO : faire la doc de markdocs...
//TODO : page d'erreur si .md pas trouvé
//TODO : trier liste filesNav
//TODO : (moins important) - loader au chargement des fichiers de doc

var $ = jQuery,
    sdn = showdown;

var GenericNames = {
    docBody: 'markdocs-render',
    docNav: 'markdocs-nav',
    filesNav: 'markdocs-nav-files',
    loadRender: 'markdocs-renderLoad',
    data_btnFilesNav: 'file-name'
},
    ShowdownOptions = {
    'tables': true
},
    DefaultOptions = {};

var DocFiles = []; // tableau d'objet qui liste les différents fichiers de doc et leurs infos


var Markdocs = function () {
    function Markdocs(options) {
        _classCallCheck(this, Markdocs);

        // =*= Propriétés
        this._options = {};
        this._options.filesArray = options.mdFiles;

        // =*= Vérifications
        if (typeof this._options.filesArray === 'undefined' || !$.isArray(this._options.filesArray)) throw new Error('Il manque l\'index mdFiles, mdFiles doit être un tableau...');

        // =*= Execution
        Markdocs._initPage(this._options.filesArray, this._options.filesArray[0]);
    }

    _createClass(Markdocs, null, [{
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
        value: function _convertToObject(array) {

            for (var i = 0; array.length > i; i++) {
                DocFiles[i] = {};
                DocFiles[i].name = this._rmExtension(array[i]);
                DocFiles[i].path = array[i];
            }
        }
    }, {
        key: '_sendToHtml',
        value: function _sendToHtml(txt) {

            $('#' + GenericNames.docBody).html('<div id="' + GenericNames.loadRender + '">' + txt + '</div>');
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
    }, {
        key: '_parseMdToHtml',
        value: function _parseMdToHtml(md) {
            var converter = new sdn.Converter();

            // application des options
            for (var opp in ShowdownOptions) {
                converter.setOption(opp, ShowdownOptions[opp]);
            }

            return converter.makeHtml(md);
        }
    }, {
        key: '_createNavFiles',
        value: function _createNavFiles() {
            // création du container
            var template = '<hr><div id="' + GenericNames.filesNav + '"><p>Catégories disponibles&nbsp;:</p></div>';

            $('#' + GenericNames.docNav).append(template);

            // parcourt du tableau de fichiers
            DocFiles.forEach(function (obj) {
                $('#' + GenericNames.filesNav).append('<span>\n                        <button data-' + GenericNames.data_btnFilesNav + '="' + obj['path'] + '" class="btn__navfiles">' + obj['name'] + '</button>\n                    </span>');
            });
        }
    }, {
        key: '_createNavPage',
        value: function _createNavPage() {
            var titleList = $('h1, h2, h3, h4, h5, h6'),
                template = '<nav><ul></ul></nav>';

            $('#' + GenericNames.docNav).html(template);

            titleList.each(function () {
                var classTitle = 'title_nav title_' + $(this).get(0).tagName;

                $('#' + GenericNames.docNav).find('ul').append('<li><a class="' + classTitle + '" href="#' + $(this).attr('id') + '">' + $(this).html() + '</a></li>');
            });
        }
    }, {
        key: '_initPage',
        value: function _initPage(arrayFiles, filePage) {

            // -**- Lit le fichier md, le converti en html et envoie son contenu à la vue
            Markdocs._readMdFile(filePage, function (data) {

                Markdocs._sendToHtml(Markdocs._parseMdToHtml(data));
            });

            // -**- attend la fin du chargement du contenu pour générer la navigation...
            $('#' + GenericNames.loadRender).ready(function () {
                setTimeout(function () {
                    // -***-
                    Markdocs._createNavPage();

                    Markdocs._convertToObject(arrayFiles);
                    console.log(arrayFiles);

                    if (arrayFiles.length > 1) {
                        Markdocs._createNavFiles();
                    }
                }, 100);
            });
        }
    }]);

    return Markdocs;
}();

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
