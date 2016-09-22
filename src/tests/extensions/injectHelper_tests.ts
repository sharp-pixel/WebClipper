/// <reference path="../../../typings/main/ambient/qunit/qunit.d.ts" />

import {InjectHelper} from "../../scripts/extensions/injectHelper";

QUnit.module("injectHelper", {});

QUnit.test("isKnownUninjectablePage should return true on about:tabs", () => {
	ok(InjectHelper.isKnownUninjectablePage("about:tabs"));
});

QUnit.test("isKnownUninjectablePage should return false on a 'regular' site", () => {
	ok(!InjectHelper.isKnownUninjectablePage("www.bing.com"));
	ok(!InjectHelper.isKnownUninjectablePage("https://www.bing.com"));
	ok(!InjectHelper.isKnownUninjectablePage("http://www.bing.com"));
});

QUnit.test("isKnownUninjectablePage should return false on a blank or undefined input", () => {
	ok(!InjectHelper.isKnownUninjectablePage(""));
	ok(!InjectHelper.isKnownUninjectablePage(undefined));
});
