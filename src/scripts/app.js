import $ from "jquery";
import showdown from "showdown";


const   TxtString = "#Un texte n'importe quoi !",// === temporaire
        ContainerHtml = ('markdocs-render'),
        uri = window.location.protocol + '//' + window.location.hostname;


function sendToHtml(txt){

    $(`#${ContainerHtml}`).html(txt);



}

function readMdFile(file){

}

function parseMdToHtml(md){
    let converter = new showdown.Converter();

    return converter.makeHtml(md);
}





sendToHtml(parseMdToHtml(TxtString));