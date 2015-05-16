# gulp-convert-newline

[![Build Status](https://travis-ci.org/takenspc/gulp-convert-newline.svg?branch=0.0.1)](https://travis-ci.org/takenspc/gulp-convert-newline)
[![Build status](https://ci.appveyor.com/api/projects/status/b46p7vntyi55ewtm/branch/master?svg=true)](https://ci.appveyor.com/project/takenspc/gulp-convert-newline/branch/master)
[![Coverage Status](https://coveralls.io/repos/takenspc/gulp-convert-newline/badge.svg)](https://coveralls.io/r/takenspc/gulp-convert-newline)
[![Code Climate](https://codeclimate.com/github/takenspc/gulp-convert-newline/badges/gpa.svg)](https://codeclimate.com/github/takenspc/gulp-convert-newline)

Gulp plugin that unifying newline characters to either `\n`,`\r\n`, or `\r`.

## Usage

```js
"use strict";
var gulp = require("gulp");
var convertNewline = require("gulp-convert-newline");

gulp.task("default", function() {
	return gulp.src("src/file.txt")
		.pipe(convertNewline({
			newline: "crlf",
			encoding: "shift_jis"
		}))
		.pipe(gulp.dest("dest"));
});
```

## API

### convertNewline(options)

#### options

##### newline

Optional. Target newline characters. Either `"lf"`, `"crlf"`, or `"cr"`. The default is `"lf"`.

#### encoding

Optional. The encoding of the file. If `encoding` is not specified, utf8 encoding is assumed.

[Supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings) are listed on the [iconv-lite](https://github.com/ashtuchkin/iconv-lite/) wiki.

## Thanks

This plugin is heavily based on [gulp-convert-encoding](https://github.com/heldinz/gulp-convert-encoding).