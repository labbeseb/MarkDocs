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


// Tests des otpions
describe('options', function(){
    it('should be an Array', function(){
        assert.isArray(MD._settings.mdFiles, 'This is not an Array');
    });
});


// ===== Tests _getFileName
describe('_getFileName', function(){
    it('should return name without path and extension (md)', function(){
        assert.equal(Markdocs._getFileName('/md/plop/onefile.md'), 'onefile', 'md extension not worked');
    });
    it('should return name without path and extension (txt)', function(){
        assert.equal(Markdocs._getFileName('/md/plop/onefile.txt'), 'onefile', 'txt extension not worked');
    });
    it('should return name without path and extension (other)', function(){
        assert.equal(Markdocs._getFileName('/md/plop/onefile.other'), 'onefile', 'others extensions not worked');
    });
});


// ===== Tests _convertToObject

describe('_convertToObject', function(){
    it('should convert array to litteral object', function(){
        assert.isArray(MD._settings.mdFiles, 'This is not an Array');
    });
});