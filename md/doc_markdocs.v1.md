# Markdocs v1.0

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

mdFiles définit les chemins de vos fichiers .md, le premier index sera celui affiché au chargement de la page de doc.


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
                    
                }  
            },
            doc = new Markdocs(options);
</script>
</body>
```


## Options
### Nom des fichiers
Le nom de vos fichiers .md, renseignés dans le tableau à la déclaration de Markdocs, déterminera le nom des boutons (sans le chemin ni extension).

> ex: /path/where/is/your/doc-file.md deviendra "doc-file" pour la navigation dans ce fichier

### Templates
> à venir...