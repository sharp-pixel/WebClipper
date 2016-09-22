/// <reference path="../../../typings/main/ambient/qunit/qunit.d.ts" />

import {ExtensionBase} from "../../scripts/extensions/extensionBase";

import {Version} from "../../scripts/versioning/version";

QUnit.module("extensionBase", {});

QUnit.test("shouldCheckForMajorUpdates should return true if the last seen version is less than the current version", () => {
	ok(ExtensionBase.shouldCheckForMajorUpdates(new Version("3.0.9"), new Version("3.1.0")));
});

QUnit.test("shouldCheckForMajorUpdates should return false if the last seen version is greater than the current version", () => {
	ok(!ExtensionBase.shouldCheckForMajorUpdates(new Version("3.1.1"), new Version("3.1.0")));
});

QUnit.test("shouldCheckForMajorUpdates should return false if the last seen version is equal to the current version", () => {
	ok(!ExtensionBase.shouldCheckForMajorUpdates(new Version("4.1.10"), new Version("4.1.10")));
});

QUnit.test("shouldCheckForMajorUpdates should return false if the current version is undefined", () => {
	ok(!ExtensionBase.shouldCheckForMajorUpdates(new Version("4.1.10"), undefined));
});

QUnit.test("shouldCheckForMajorUpdates should return true if the last seen version is undefined", () => {
	ok(ExtensionBase.shouldCheckForMajorUpdates(undefined, new Version("4.1.10")));
});

QUnit.test("shouldCheckForMajorUpdates should return false if both parameters are undefined", () => {
	ok(!ExtensionBase.shouldCheckForMajorUpdates(undefined, undefined));
});
