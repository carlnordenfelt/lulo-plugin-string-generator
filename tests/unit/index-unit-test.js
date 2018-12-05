const expect = require('chai').expect;

describe('Index', function () {
    let subject = require('../../src/index');
    let event;

    beforeEach(function () {
        event = {
            ResourceProperties: {}
        };
    });

    describe('Validate', function () {
        it('coverage', function (done) {
            subject.validate(event);
            done();
        });
    });

    describe('Create', function () {
        it('should succeednwith default length', function (done) {
            subject.create(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal(undefined);
                expect(result.String.length).to.equal(128 * 2);
                done();
            });
        });
        it('should succeed with length', function (done) {
            event.ResourceProperties.Length = 256;
            subject.create(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal(undefined);
                expect(result.String.length).to.equal(256 * 2);
                done();
            });
        });
        it('should succeed with length as string', function (done) {
            event.ResourceProperties.Length = '256';
            subject.create(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal(undefined);
                expect(result.String.length).to.equal(256 * 2);
                done();
            });
        });
    });

    describe('Update', function () {
        it('for coverage', function (done) {
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result).to.be.an('object');
                done();
            });
        });
    });

    describe('Delete', function () {
        it('will always succeed', function (done) {
            subject.delete(event, {}, function (error, _result) {
                expect(error).to.equal(undefined);
                done();
            });
        });
    });
});

// Rereg all badges
// Republish

