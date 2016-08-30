# MarkdocsJS v1.0

> Markdocs permet de mettre en place rapidement une page de documentation pour vos outils ou sites 
à partir de fichiers Markdown.

## Installation

    npm install markdocs-js
    
ou...
    
    bower install markdocs-js


## Paramétrage

### Utilisation rapide
Copier le contenu du dossier **docs/** de Markdocs (index.html, assets/, md/) et modifier les paramètres (var **mdopts**) avec vos propres fichiers .md

### Utilisation custom
Si vous avez votre propre template html :

- insérez markdocs.min.js dans votre projet
- Déclarez une instance de Markdocs qui prend en paramètre un objet d'options contenant au moins l'index mdFiles (Array) obligatoire.
- modifiez les options pour écrire dans vos propres conteneurs ([voir les options](#options))


### exemple
```html
<body>
    <div id="main-wrapper">
        <div id="wrapper-nav">
            ...
        </div>
        <div id="wrapper-text">
            ...
        </div>
    </div>
    
<script src="assets/markdocs.min.js"></script>

<script>
    var options = {
                mdFiles: [
                    'md/votredoc.md',
                    'md/category/autrefichier.md'
                ],
                genericNames: {
                    container_docBody: 'wrapper-nav',   //--> définition du conteneur de la navigation
                    container_docNav: 'wrapper-text'    //--> définition du conteneur de la doc
                }  
            },
            doc = new Markdocs(options); //--> génération de la page...
</script>
</body>
```


## Options

### mdFiles

***array* (required)**

La liste de vos fichiers .md sous forme d'array.

### genericNames
**object**

*default: {container_docBody: 'markdocs-render', container_docNav: 'markdocs-nav', container_filesNav: 'markdocs-nav-files'}*

Liste des id des conteneurs pour générer la page :
- *container_docBody* : wrapper général du corps de la doc (*default : markdocs-render*)
- *container_docNav* : wrapper general de la navigation (*default : markdocs-nav*)
- *container_filesNav* : wrapper de la navigation entre fichiers, insérée à la fin du container_docNav (*default : markdocs-nav-files*)

**En cas de changement de ces paramètres, n'utilisez QUE des id dans votre html**

### showdownOptions
**object**

*default: { 'tables': true }*

MarkdocsJs utilise [Showdown](https://github.com/showdownjs/showdown) pour convertir le texte MD en html, 
ce paramètre permet de mofifier les paramètre de Showdown comme vous voulez ([liste des options](https://github.com/showdownjs/showdown#options))

### categoriesActived
**bool**

*default: true*

Active / désactive le tri des liens vers les fichiers de doc en catégories.

La catégorie est représentée par le niveau de sous-dossier spécifié *(categoriesLvl)*

> ex: un fichier md/partie1/souspartie1/fichier.md avec categoriesLvl à 1 sera trié dans la catégorie **"partie1"**
si on change categoriesLvl à 2 il sera trié le nom de la catégorie sera **"souspartie1"**.

***N.B.**: les fichiers qui ne sont pas dans un sous dossier avec un niveau correspondant à categoriesLvl seront considérés sans catégorie.*

### categoriesLvl

**int**

*default: 1*

Défini le niveau de profondeur des dossiers qui correspondra à la catégorie en cas de tri





## Tips

- [Mémo des fonctionnalités du Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)