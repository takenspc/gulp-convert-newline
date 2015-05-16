"use strict";
var gutil = require("gulp-util");
var iconv = require("iconv-lite");
var through = require("through2");
var convertNewline = require("convert-newline");

var PACKAGE_NAME = "gulp-convert-newline";

module.exports = function(options) {
	options = options || {};

	var newline = options.newline || "lf";
	var encoding = options.encoding;
	var converter = convertNewline(newline, encoding);

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			cb();
			return;
		}

		if (file.isStream()) {
			try {
				if (encoding) {
					file.contents = file.contents
						.pipe(iconv.decodeStream(encoding))
						.pipe(converter.stream())
						.pipe(iconv.encodeStream(encoding));
				} else {
					file.contents = file.contents
						.pipe(converter.stream());
				}
				this.push(file);
			} catch (err) {
				this.emit("error", new gutil.PluginError(PACKAGE_NAME, err));
			}
		}

		if (file.isBuffer()) {
			try {
				file.contents = converter.buffer()(file.contents);
				this.push(file);
			} catch (err) {
				this.emit("error", new gutil.PluginError(PACKAGE_NAME, err));
			}
		}
		cb();
	});
};
