const expect  = require('chai').expect;
const mockery = require('mockery');
const sinon   = require('sinon');

describe('Index', function () {
    let subject;
    let event;
    const putParameterStub    = sinon.stub();
    const getParameterStub    = sinon.stub();
    const deleteParameterStub = sinon.stub();

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        const awsMock = {
            SSM: function () {
                this.putParameter    = putParameterStub;
                this.getParameter    = getParameterStub;
                this.deleteParameter = deleteParameterStub;
            }
        };

        mockery.registerMock('aws-sdk', awsMock);
        subject = require('../../src/index');
    });

    beforeEach(function () {
        putParameterStub.reset();
        putParameterStub.yields(null, {});

        getParameterStub.reset();
        getParameterStub.yields(null, { Parameter: { Value: 'foo' } });

        deleteParameterStub.reset();
        deleteParameterStub.yields(null);

        event = {
            ResourceProperties: {
                Name: 'MyName',
                Description: 'Description'
            },
            OldResourceProperties: {
                Name: 'MyName'
            }
        };
    });

    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('Validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail without Name', function (done) {
            delete event.ResourceProperties.Name;

            function fn() {
                subject.validate(event);
            }

            expect(fn).to.throw(/Missing required property Name/);
            done();
        });
    });

    describe('Create', function () {
        it('should succeed with default KeyId', function (done) {
            subject.create(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal(event.ResourceProperties.Name);
                expect(putParameterStub.calledOnce).to.equal(true);

                expect(putParameterStub.firstCall.args[0].Name).to.equal(event.ResourceProperties.Name);
                expect(putParameterStub.firstCall.args[0].Type).to.equal('SecureString');
                expect(putParameterStub.firstCall.args[0].Description).to.equal(event.ResourceProperties.Description);
                expect(putParameterStub.firstCall.args[0].Overwrite).to.equal(true);
                expect(putParameterStub.firstCall.args[0].KeyId).to.equal(undefined);
                expect(putParameterStub.firstCall.args[0].Value.length).to.equal(128 * 2);

                expect(getParameterStub.called).to.equal(false);
                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });

        it('should succeed with custom KeyId and default Description and custom length', function (done) {
            delete event.ResourceProperties.Description;
            event.ResourceProperties.KeyId = 'MyKey';
            event.ResourceProperties.SecretLength = 256;
            subject.create(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal('MyName');
                expect(putParameterStub.calledOnce).to.equal(true);

                expect(putParameterStub.firstCall.args[0].KeyId).to.equal(event.ResourceProperties.KeyId);
                expect(putParameterStub.firstCall.args[0].Description).to.contain('lulo');
                expect(putParameterStub.firstCall.args[0].Value.length).to.equal(256 * 2);

                expect(getParameterStub.called).to.equal(false);
                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });

        it('should fail on putParameter error', function (done) {
            putParameterStub.yields('putParameterStub');
            subject.create(event, {}, function (error, result) {
                expect(error).to.equal('putParameterStub');
                expect(result).to.equal(undefined);
                expect(putParameterStub.calledOnce).to.equal(true);

                expect(getParameterStub.called).to.equal(false);
                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });
    });

    describe('Update', function () {
        it('should succeed', function (done) {
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal('MyName');
                expect(putParameterStub.calledOnce).to.equal(true);
                expect(getParameterStub.calledOnce).to.equal(true);

                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });
        it('should replace parameter', function (done) {
            event.ResourceProperties.Name = 'MyNewName';
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal('MyNewName');
                expect(putParameterStub.calledOnce).to.equal(true);
                expect(getParameterStub.calledOnce).to.equal(true);
                expect(deleteParameterStub.calledOnce).to.equal(true);

                expect(deleteParameterStub.firstCall.args[0].KeyId).to.equal(event.OldResourceProperties.KeyId);

                done();
            });
        });

        it('should fail on getParameter error', function (done) {
            getParameterStub.yields('getParameterStub');
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal('getParameterStub');
                expect(result).to.equal(undefined);
                expect(getParameterStub.calledOnce).to.equal(true);
                expect(putParameterStub.called).to.equal(false);
                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });

        it('should fail on putParameter error', function (done) {
            putParameterStub.yields('putParameterStub');
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal('putParameterStub');
                expect(result).to.equal(undefined);
                expect(getParameterStub.calledOnce).to.equal(true);
                expect(putParameterStub.calledOnce).to.equal(true);
                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });

        it('should fail on putParameter error', function (done) {
            putParameterStub.yields('putParameterStub');
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal('putParameterStub');
                expect(result).to.equal(undefined);
                expect(getParameterStub.calledOnce).to.equal(true);
                expect(putParameterStub.calledOnce).to.equal(true);
                expect(deleteParameterStub.called).to.equal(false);
                done();
            });
        });

        it('should not fail on deleteParameter error', function (done) {
            deleteParameterStub.yields('deleteParameterStub');
            event.ResourceProperties.Name = 'MyNewName';
            subject.update(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result.physicalResourceId).to.equal('MyNewName');
                expect(deleteParameterStub.calledOnce).to.equal(true);

                expect(putParameterStub.calledOnce).to.equal(true);
                expect(getParameterStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('Delete', function () {
        it('should succeed ', function (done) {
            subject.delete(event, {}, function (error, result) {
                expect(error).to.equal(null);
                expect(result).to.equal(undefined);
                expect(deleteParameterStub.calledOnce).to.equal(true);

                expect(deleteParameterStub.firstCall.args[0].Name).to.equal(event.ResourceProperties.Name);

                expect(putParameterStub.called).to.equal(false);
                expect(getParameterStub.called).to.equal(false);
                done();
            });
        });

        it('should fail on deleteParameter error', function (done) {
            deleteParameterStub.yields('deleteParameterStub');
            subject.delete(event, {}, function (error, result) {
                expect(error).to.equal('deleteParameterStub');
                expect(result).to.equal(undefined);
                expect(deleteParameterStub.calledOnce).to.equal(true);

                expect(putParameterStub.called).to.equal(false);
                expect(getParameterStub.called).to.equal(false);
                done();
            });
        });
    });
});
