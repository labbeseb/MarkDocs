import $ from "jquery";
import _ from "lodash";
import showdown from "showdown";

if( typeof mdFiles === 'undefined' || !$.isArray(mdFiles) )
    throw new Error(`Il manque la variable mdFiles, mdFiles doit être un tableau...`);


const   ContainerHtml = ('markdocs-render'),
        ContainerNav = ('markdocs-nav'),
        Uri = window.location.protocol + '//' + window.location.hostname,
        ShowdownOptions = {
            'tables': true
        };

let DocFiles = [];// tableau qui des différents fichiers de doc et leurs infos

function rmExtension(file){

    let arr = file.trim().split('.');
    arr.pop();

    return arr.join('.');

}

function convertToObject(array){

    for(let i=0; array.length > i; i++){
        DocFiles[i] = {};
        DocFiles[i].name = rmExtension(array[i]);
        DocFiles[i].path = array[i];
    }
}

function sendToHtml(txt){

    $(`#${ContainerHtml}`).html(txt);

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

function createNav(){
    let titleList = $('h1, h2, h3, h4, h5, h6'),
        template = `<nav><ul></ul></nav>`;

    $(`#${ContainerNav}`).html(template);

    titleList.each( function(){
        let classTitle = `title_nav title_${ $(this).get(0).tagName }`;

        $(`#${ContainerNav}`).find('ul').append(`<li><a class="${classTitle}" href="#${ $(this).attr('id') }">${ $(this).html() }</a></li>`)
    });
}
function createNavFiles(){

    DocFiles.forEach(function(obj){
        console.log(obj);

        for(var i in obj){
            console.log(`${i} : ${obj[i]}`);
        }
    });

}

function initPage(){

}


/*===============================
 === Execution de l'application
 ================================*/
(function(){
    readMdFile('sample.md', data => {
        sendToHtml(parseMdToHtml(data));
    });

    setTimeout( () => {
        createNav();
    }, 1500);

    convertToObject(['hu.md', 'plop.md', 'fkf.md']);
    createNavFiles();
})();