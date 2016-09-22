/// <reference path="../../../typings/main/ambient/qunit/qunit.d.ts" />
/// <reference path="../../../typings/main/ambient/sinon/sinon.d.ts" />

import * as Log from "../../scripts/logging/log";
import {Logger} from "../../scripts/logging/logger";

import {MockLogger} from "./mockLogger";

QUnit.module("logger", {});

QUnit.test("logFailure should be called as a Json parse unexpected failure when logJsonParseUnexpected is called", () => {
	let mockLogger: Logger = new MockLogger();
	let logFailureSpy = sinon.spy(mockLogger.logFailure);
	mockLogger.logFailure = logFailureSpy;

	mockLogger.logJsonParseUnexpected("{{}");

	ok(logFailureSpy.calledOnce, "logFailure should be called once");
	ok(logFailureSpy.calledWith(Log.Failure.Label.JsonParse, Log.Failure.Type.Unexpected, undefined, "{{}"),
		"logFailure should be called as a Json parse unexpected failure");
});

QUnit.test("logJsonParseUnexpected should pipe an undefined id to logFailure if called with undefined", () => {
	let mockLogger: Logger = new MockLogger();
	let logFailureSpy = sinon.spy(mockLogger.logFailure);
	mockLogger.logFailure = logFailureSpy;

	mockLogger.logJsonParseUnexpected(undefined);

	ok(logFailureSpy.calledOnce, "logFailure should be called once");
	ok(logFailureSpy.calledWith(Log.Failure.Label.JsonParse, Log.Failure.Type.Unexpected, undefined, undefined),
		"logFailure should be called with an undefined id");
});

QUnit.test("logJsonParseUnexpected should pipe an empty string id to logFailure if called with empty string", () => {
	let mockLogger: Logger = new MockLogger();
	let logFailureSpy = sinon.spy(mockLogger.logFailure);
	mockLogger.logFailure = logFailureSpy;

	mockLogger.logJsonParseUnexpected("");

	ok(logFailureSpy.calledOnce, "logFailure should be called once");
	ok(logFailureSpy.calledWith(Log.Failure.Label.JsonParse, Log.Failure.Type.Unexpected, undefined, ""),
		"logFailure should be called with an empty string id");
});
