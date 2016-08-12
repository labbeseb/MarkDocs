import $ from "jquery";
import showdown from "showdown";

class Markdocs{
    constructor(file){
        console.log();
    }
}

const   ContainerHtml = ('markdocs-render'),
        ContainerNav = ('markdocs-nav'),
        Uri = window.location.protocol + '//' + window.location.hostname,
        ShowdownOptions = {
            'tables': true
        };

function sendToHtml(txt){

    $(`#${ContainerHtml}`).html(txt);

}

function readMdFile(file, action){

    let reader = new XMLHttpRequest(),
        urlFile = `${file}`;

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

    console.log('plop');

    $(`#${ContainerNav}`).html(template);

    titleList.each( function(){
        let classTitle = `title_nav title_${ $(this).get(0).tagName }`;

        $(`#${ContainerNav}`).find('ul').append(`<li><a class="${classTitle}" href="#${ $(this).attr('id') }">${ $(this).html() }</a></li>`)
    });
}


/*===============================

 ================================*/
readMdFile('sample.md', data => {

    let mdTxt = parseMdToHtml(data);

    sendToHtml(mdTxt);
});

setTimeout( () => {
    createNav();
}, 1500);
