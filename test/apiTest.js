'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect;
chai.use(chaiHttp);

const url = 'http://localhost:3000';

// json-server --watch db.json 서버 실행

describe('Request test', () => {
    it('request to server', (done) => {
        chai.request(url)
            .get('/')
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            })
    });

    it('fetch all posts', (done) => {
        chai.request(url)
            .get('/posts')
            .end((err, res) => {
                expect(err).to.be.not.ok;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            })
    })
});
