"use strict";
var assert = require("power-assert");
var path = require("path");
var util = require("util");
var bufferEquals = require("buffer-equals");
var es = require("event-stream");
var gutil = require("gulp-util");
var convertNewline = require("../");

//
// const.
//
var SHIFT_JIS = "shift_jis";

//
// Test Data
//
function getStringTestData() {
	return {
		cr: "AAA\rBBB\rCCC\r",
		crlf: "AAA\r\nBBB\r\nCCC\r\n",
		lf: "AAA\nBBB\nCCC\n"
	};
}

function getShiftJISBufferTestData() {
	// each hiragana letter is repeated 3 times.
	var HIRAGANA_LETTER_A = [0x82, 0xa0, 0x82, 0xa0, 0x82, 0xa0];
	var HIRAGANA_LETTER_I = [0x82, 0xa2, 0x82, 0xa2, 0x82, 0xa2];
	var HIRAGANA_LETTER_U = [0x82, 0xa4, 0x82, 0xa4, 0x82, 0xa4];
	var CR = 0x0d;
	var LF = 0x0a;

	return {
		cr: new Buffer([].concat(HIRAGANA_LETTER_A, CR, HIRAGANA_LETTER_I, CR, HIRAGANA_LETTER_U, CR)),
		crlf: new Buffer([].concat(HIRAGANA_LETTER_A, CR, LF, HIRAGANA_LETTER_I, CR, LF, HIRAGANA_LETTER_U, CR, LF)),
		lf: new Buffer([].concat(HIRAGANA_LETTER_A, LF, HIRAGANA_LETTER_I, LF, HIRAGANA_LETTER_U, LF))
	};
}

//
// Tests
//
describe("gulp-convert-newline", function() {
	it("should handle null file gracefully", function(done) {
		var stream = convertNewline();

		stream.on("data", function(file) {
			assert.ok(file.isNull());
			assert.strictEqual(file.relative, "file.txt");
		});

		stream.on("end", done);

		stream.write(new gutil.File({
			base: __dirname,
			path: path.join(__dirname, "file.txt"),
			contents: null
		}));
		stream.end();
	});

	describe("in buffer mode (simple)", function() {
		var testData = getStringTestData();
		var newlines = Object.keys(testData);
		newlines.forEach(function(toNewline) {
			newlines.forEach(function(fromNewline) {
				it(util.format("should convert from %s to %s", fromNewline, toNewline), function(done) {
					var stream = convertNewline({
						newline: toNewline
					});

					stream.on("data", function(file) {
						assert.ok(file.isBuffer());
						assert.strictEqual(file.relative, "file.txt");
						assert.strictEqual(file.contents.toString(), testData[toNewline]);
					});

					stream.on("end", done);

					stream.write(new gutil.File({
						base: __dirname,
						path: path.join(__dirname, "file.txt"),
						contents: new Buffer(testData[fromNewline])
					}));

					stream.end();
				});
			});
		});
	});

	describe("in buffer mode (iconv)", function() {
		var testData = getShiftJISBufferTestData();
		var newlines = Object.keys(testData);
		newlines.forEach(function(toNewline) {
			newlines.forEach(function(fromNewline) {
				it(util.format("should convert from %s to %s", fromNewline, toNewline), function(done) {
					var stream = convertNewline({
						newline: toNewline,
						encoding: SHIFT_JIS
					});

					stream.on("data", function(file) {
						assert.ok(file.isBuffer());
						assert.strictEqual(file.relative, "file.txt");
						assert.ok(bufferEquals(file.contents, testData[toNewline]));
					});

					stream.on("end", done);

					stream.write(new gutil.File({
						base: __dirname,
						path: path.join(__dirname, "file.txt"),
						contents: testData[fromNewline]
					}));

					stream.end();
				});
			});
		});
	});

	describe("in stream mode (simple)", function() {
		var testData = getStringTestData();
		var newlines = Object.keys(testData);
		newlines.forEach(function(toNewline) {
			newlines.forEach(function(fromNewline) {
				it(util.format("should convert from %s to %s", fromNewline, toNewline), function(done) {
					var stream = convertNewline({
						newline: toNewline
					});

					stream.on("data", function(file) {
						assert.ok(file.isStream());
						assert.strictEqual(file.relative, "file.txt");

						// buffer the contents
						file.contents.pipe(es.wait(function(err, actual) {
							if (err) {
								throw err;
							}
							// input (string) -> converter (string) -> output (string)
							var expected = testData[toNewline];
							assert.strictEqual(actual, expected);
						}));
					});

					stream.on("end", done);

					stream.write(new gutil.File({
						base: __dirname,
						path: path.join(__dirname, "file.txt"),
						contents: es.readArray([testData[fromNewline]])
					}));

					stream.end();
				});
			});
		});
	});

	describe("in stream mode (iconv)", function() {
		var testData = getShiftJISBufferTestData();
		var newlines = Object.keys(testData);
		newlines.forEach(function(toNewline) {
			newlines.forEach(function(fromNewline) {
				it(util.format("should convert from %s to %s", fromNewline, toNewline), function(done) {
					var stream = convertNewline({
						newline: toNewline,
						encoding: SHIFT_JIS
					});

					stream.on("data", function(file) {
						assert.ok(file.isStream());
						assert.strictEqual(file.relative, "file.txt");

						// buffer the contents
						file.contents.pipe(es.wait(function(err, data) {
							if (err) {
								throw err;
							}
							// input (buffer) -> converter (buffer -> string -> buffer) -> output (buffer)
							assert.ok(Buffer.isBuffer(data));
							var expected = testData[toNewline];
							assert.ok(bufferEquals(data, expected));
						}));
					});

					stream.on("end", done);

					stream.write(new gutil.File({
						base: __dirname,
						path: path.join(__dirname, "file.txt"),
						contents: es.readArray([testData[fromNewline]])
					}));

					stream.end();
				});
			});
		});
	});
});
