const chai = require("chai")
const chaiHttp = require("chai-http")
const { app } = require("./../index")

chai.use(chaiHttp)

describe("probando ruta get/animes", function () {
    it("return 200", function (done) {
        chai.request(app).get('/animes').end(function (error, res) {
            chai.expect(res).to.have.status(200)
            done()
        })
    })
})