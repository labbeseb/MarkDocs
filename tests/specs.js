var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect;

var mdOpts = {
        mdFiles: [
            '/docs/md/doc_markdocs.v1.md',
            '/docs/md/samples/samples.md',
            '/docs/md/samples/categories.md'
        ],
        categoriesActived: true,
        categoriesLvl: 1
    },
    MD = new Markdocs(mdOpts);

describe('Test MarkdocsJs', function(){

    it('should be an Array', function(){
        assert.isArray(MD._settings.mdFiles, 'This is not an Array');
    });

});