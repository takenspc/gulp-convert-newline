# gulp-convert-newline

Gulp plugin that unifying newline characters to either `\n`,`\r\n`, or `\r`.

## Usage

	var gulp = require("gulp");
	var convertEncoding = require("gulp-convert-newline");
	
	gulp.task("default", function () {
		return gulp.src("src/file.txt")
			.pipe(convertNewline({
				newline: "crlf",
				encoding: "shift_jis"
			}))
			.pipe(gulp.dest("dest"));
	});

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