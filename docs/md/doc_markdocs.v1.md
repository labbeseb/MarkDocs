# Markdocs v1.0

> Markdocs permet de mettre en place rapidement une page de documentation pour vos outils ou sites 
à partir de fichiers Markdown.

## Installation


## Paramétrage
Déclarez une variable nommée *mdFiles* avant l'appel de Mardocs. Devra être un tableau contenant le chemin (relatif)
des fichiers que vous voulez charger.

### exemple
```html
<script>
    var mdFiles = ['md/doc_markdocs.v1.md', 'md/sample.md','md/plop.md'];
</script>
<script src="assets/markdocs.min.js"></script>
```


## Options
### Nom des fichiers
Le nom de vos fichiers .md, renseignés dans le tableau à la déclaration de Markdocs, déterminera le nom des boutons (sans le chemin ni extension).

> ex: /path/where/is/your/doc-file.md deviendra "doc-file" pour la navigation dans ce fichier

### Templates
> à venir...