/// <reference path="../../../typings/main/ambient/qunit/qunit.d.ts" />

import {AuthenticationHelper} from "../../scripts/extensions/authenticationHelper";
import {UserInfoData} from "../../scripts/userInfo";

let xhr: Sinon.SinonFakeXMLHttpRequest;
let server: Sinon.SinonFakeServer;

function getValidUserInformationJson(): UserInfoData {
	return {
		accessToken: "abcd",
		accessTokenExpiration: 2000,
		authType: "MSA",
		cid: "cid",
		emailAddress: "me@myemail.xyz",
		fullName: "George"
	};
}

QUnit.module("authenticationHelper-sinon", {
	beforeEach: () => {
		xhr = sinon.useFakeXMLHttpRequest();
		let requests = this.requests = [];
		xhr.onCreate = req => {
			requests.push(req);
		};

		server = sinon.fakeServer.create();
	},
	afterEach: () => {
		xhr.restore();
		server.restore();
	}
});

let clipperId = "XX-1a23456b-a1b2-12ab-1a2b-12a34b567c8d";
let authUrl = "https://www.onenote.com/webclipper/userinfo?clipperId=" + clipperId;

QUnit.test("retrieveUserInformation resolves the response as a json string if it represents valid user information", (assert: QUnitAssert) => {
	let done = assert.async();

	server.respondWith(
		"POST", authUrl,
		[200, { "Content-Type": "application/json" },
		JSON.stringify(getValidUserInformationJson())
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		strictEqual(responsePackage.parsedResponse, JSON.stringify(getValidUserInformationJson()),
			"The user information should be resolved as a json string");
	}, (error) => {
		ok(false, "reject should not be called");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.test("retrieveUserInformation resolves the response with no parameter if it returns an empty object", (assert: QUnitAssert) => {
	let done = assert.async();

	server.respondWith(
		"POST", authUrl,
		[200, { "Content-Type": "application/json" },
		JSON.stringify({})
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		strictEqual(responsePackage.parsedResponse, undefined, "The response should be undefined");
	}, (error) => {
		ok(false, "reject should not be called");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.test("retrieveUserInformation resolves the response with no parameter if it returns an empty string", (assert: QUnitAssert) => {
	let done = assert.async();

	server.respondWith(
		"POST", authUrl,
		[200, { "Content-Type": "application/json" },
		JSON.stringify("")
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		strictEqual(responsePackage.parsedResponse, undefined, "The response should be undefined");
	}, (error) => {
		ok(false, "reject should not be called");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.test("retrieveUserInformation resolves the response with no parameter if it represents incomplete user information", (assert: QUnitAssert) => {
	let done = assert.async();

	let invalidUserInformation = getValidUserInformationJson();
	invalidUserInformation.accessToken = undefined;
	server.respondWith(
		"POST", authUrl,
		[200, { "Content-Type": "application/json" },
		JSON.stringify(invalidUserInformation)
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		strictEqual(responsePackage.parsedResponse, undefined, "The response should be undefined");
	}, (error) => {
		ok(false, "reject should not be called");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.test("retrieveUserInformation resolves the response with no parameter if it represents empty user information", (assert: QUnitAssert) => {
	let done = assert.async();

	let invalidUserInformation: UserInfoData = {
		accessToken: undefined,
		accessTokenExpiration: 0,
		authType: undefined,
		cid: undefined,
		emailAddress: undefined,
		fullName: undefined
	};
	server.respondWith(
		"POST", authUrl,
		[200, { "Content-Type": "application/json" },
		JSON.stringify(invalidUserInformation)
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		strictEqual(responsePackage.parsedResponse, undefined, "The response should be undefined");
	}, (error) => {
		ok(false, "reject should not be called");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.test("retrieveUserInformation rejects the response with error object if the status code is 4XX", (assert: QUnitAssert) => {
	let done = assert.async();

	let responseMessage = "Something went wrong";
	server.respondWith(
		"POST", authUrl,
		[404, { "Content-Type": "application/json" },
		responseMessage
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		ok(false, "resolve should not be called");
	}, (error) => {
		let expected = {
			error: "Unexpected response status",
			statusCode: 404,
			responseHeaders: { "Content-Type": "application/json" },
			response: responseMessage,
			timeout: 30000
		};
		deepEqual(error, expected, "The error object should be returned in the reject");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.test("retrieveUserInformation rejects the response with error object if the status code is 5XX", (assert: QUnitAssert) => {
	let done = assert.async();

	let responseMessage = "Something went wrong on our end";
	server.respondWith(
		"POST", authUrl,
		[503, { "Content-Type": "application/json" },
		responseMessage
	]);

	AuthenticationHelper.retrieveUserInformation(clipperId).then((responsePackage) => {
		ok(false, "resolve should not be called");
	}, (error) => {
		let expected = {
			error: "Unexpected response status",
			statusCode: 503,
			responseHeaders: { "Content-Type": "application/json" },
			response: responseMessage,
			timeout: 30000
		};
		deepEqual(error, expected,
			"The error object should be returned in the reject");
	}).then(() => {
		done();
	});
	server.respond();
});

QUnit.module("authenticationHelper", {});

/* tslint:disable:no-null-keyword */

QUnit.test("A valid userInfo should be validated by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Valid userInfo should be validated");
});

QUnit.test("A null userInfo should be invalidated by isValidUserInformationJsonString", () => {
	ok(!AuthenticationHelper.isValidUserInformationJsonString(null),
		"Null userInfo should be invalidated");
});

QUnit.test("An undefined userInfo should be invalidated by isValidUserInformationJsonString", () => {
	ok(!AuthenticationHelper.isValidUserInformationJsonString(undefined),
		"Undefined userInfo should be invalidated");
});

QUnit.test("A non-json-string userInfo should be invalidated by isValidUserInformationJsonString", () => {
	ok(!AuthenticationHelper.isValidUserInformationJsonString("{}}"),
		"Non-json-string userInfo should be invalidated");
});

QUnit.test("Invalid accessToken should be detected by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	userInfo.accessToken = null;
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Null accessToken should be seen as invalid");
	userInfo.accessToken = undefined;
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Undefined accessToken should be seen as invalid");
	userInfo.accessToken = "";
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Empty accessToken should be seen as invalid");
});

QUnit.test("Invalid accessTokenExpiration should be detected by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	userInfo.accessTokenExpiration = 0;
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"0 accessTokenExpiration should be seen as invalid");
	userInfo.accessTokenExpiration = -1;
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"<0 accessTokenExpiration should be seen as invalid");
});

QUnit.test("Invalid authType should be detected by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	userInfo.authType = null;
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Null authType should be seen as invalid");
	userInfo.authType = undefined;
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Undefined authType should be seen as invalid");
	userInfo.authType = "";
	ok(!AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Empty authType should be seen as invalid");
});

QUnit.test("Valid cid should be detected by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	userInfo.cid = null;
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Null cid should be seen as valid");
	userInfo.cid = undefined;
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Undefined cid should be seen as valid");
	userInfo.cid = "";
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Empty cid should be seen as valid");
});

QUnit.test("Valid emailAddress should be detected by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	userInfo.emailAddress = null;
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Null emailAddress should be seen as valid");
	userInfo.emailAddress = undefined;
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Undefined emailAddress should be seen as valid");
	userInfo.emailAddress = "";
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Empty emailAddress should be seen as valid");
});

QUnit.test("Valid fullName should be detected by isValidUserInformationJsonString", () => {
	let userInfo = getValidUserInformationJson();
	userInfo.fullName = null;
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Null fullName should be seen as valid");
	userInfo.fullName = undefined;
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Undefined fullName should be seen as valid");
	userInfo.fullName = "";
	ok(AuthenticationHelper.isValidUserInformationJsonString(JSON.stringify(userInfo)),
		"Empty fullName should be seen as valid");
});

/* tslint:enable:no-null-keyword */
