'use strict';

const assert   = require('assert');
const helpers  = require('./test_helper.js');

const config   = helpers.config();
const uri      = helpers.app(config, 'legacy/bootstrap');

let response = {};

before((done) => {
    helpers.preFetch(uri, (res) => {
        response = res;
        done();
    });
});

describe('legacy/bootstrap', () => {
    it('works', (done) => {
        assert(response);
        assert.equal(200, response.statusCode);
        done();
    });

    it('valid html', (done) => {
        helpers.assert.validHTML(response, done);
    });

    it('has header', (done) => {
        assert(response.body.includes('<h2 class="text-center mb-4">Bootstrap Legacy</h2>'),
            'Expected response body to include Bootstrap Legacy header');
        done();
    });

    it('contains authors', (done) => {
        config.authors.forEach((author) => {
            assert(response.body.includes(author), `Expected response body to include "${author}"`);
        });
        done();
    });

    config.bootstrap.forEach((bootstrap) => {
        if (bootstrap.latest === true) {
            return;
        }

        describe(bootstrap.version, () => {
            describe('config', () => {
                it('has javascript integrity', (done) => {
                    assert(typeof bootstrap.javascriptSri !== 'undefined');
                    done();
                });
                it('has stylesheet integrity', (done) => {
                    assert(typeof bootstrap.stylesheetSri !== 'undefined');
                    done();
                });
            });

            ['html', 'pug', 'haml'].forEach((fmt) => {
                it(`has javascript ${fmt}`, (done) => {
                    const str = helpers.javascript[fmt](bootstrap.javascript, bootstrap.javascriptSri);

                    assert(response.body.includes(str), `Expected response body to include "${str}"`);
                    done();
                });

                it(`has stylesheet ${fmt}`, (done) => {
                    const str = helpers.css[fmt](bootstrap.stylesheet, bootstrap.stylesheetSri);

                    assert(response.body.includes(str), `Expected response body to include "${str}"`);
                    done();
                });
            });
        });
    });
});
