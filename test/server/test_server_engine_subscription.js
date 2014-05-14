var should = require("should");
var server_engine = require("../../lib/server/server_engine");
var resolveNodeId = require("../../lib/datamodel/nodeid").resolveNodeId;
var NodeClass = require("../../lib/datamodel/nodeclass").NodeClass;
var browse_service = require("../../lib/services/browse_service");
BrowseDirection = browse_service.BrowseDirection;
var read_service = require("../../lib/services/read_service");
var TimestampsToReturn = read_service.TimestampsToReturn;
var util = require("util");
var NodeId = require("../../lib/datamodel/nodeid").NodeId;
var assert = require('better-assert');
var AttributeIds = read_service.AttributeIds;

var DataType = require("../../lib/datamodel/variant").DataType;
var StatusCodes = require("../../lib/datamodel/opcua_status_code").StatusCodes;
var makeNodeId = require("../../lib/datamodel/nodeid").makeNodeId;
var VariableIds = require("../../lib/opcua_node_ids").VariableIds;
var Variant = require("../../lib/datamodel/variant").Variant;
var VariantArrayType =  require("../../lib/datamodel/variant").VariantArrayType;

var server_NamespaceArray_Id =  makeNodeId(VariableIds.Server_NamespaceArray); // ns=0;i=2255


describe("ServerEngine Subscriptions service", function () {


    var engine,FolderTypeId,BaseDataVariableTypeId;
    beforeEach(function(done){
        engine = new server_engine.ServerEngine();
        engine.initialize(null,function(){
            FolderTypeId = engine.findObject("FolderType").nodeId;
            BaseDataVariableTypeId = engine.findObject("BaseDataVariableType").nodeId;
            done();
        });

    });
    afterEach(function(){
        should(engine).not.equal(null);
        engine.shutdown();
        engine = null;
    });

    it("should return an error when trying to delete an non-existing subscription",function(){

        engine.deleteSubscription(-6789).should.eql(StatusCodes.Bad_SubscriptionIdInvalid);

    });

    it("should check the subscription live cycle",function(){

        engine.currentSubscriptionCount.should.equal(0);
        engine.cumulatedSubscriptionCount.should.equal(0);

        var subscription = engine.createSubscription({
            requestedPublishingInterval: 1000,  // Duration
            requestedLifetimeCount: 10,         // Counter
            requestedMaxKeepAliveCount: 10,     // Counter
            maxNotificationsPerPublish: 10,     // Counter
            publishingEnabled: true,            // Boolean
            priority: 14                        // Byte
        });

        engine.currentSubscriptionCount.should.equal(1);
        engine.cumulatedSubscriptionCount.should.equal(1);

        engine.getSubscription(subscription.id).should.equal(subscription);

        var statusCode = engine.deleteSubscription(subscription.id);
        statusCode.should.eql(StatusCodes.Good);

        engine.currentSubscriptionCount.should.equal(0);
        engine.cumulatedSubscriptionCount.should.equal(1);
    });

});
