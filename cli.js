#! /usr/bin/env node

var fs = require('fs-promise');
var path = require('path');
var xmldoc = require('xmldoc');
var tpl = '@selector {\n\tbackground-image: url(@data);\n}\n';
var isPrefix = /^--prefix\s*[A-z-]/;

if (!process.argv[2] || process.argv[2].length < 3) {
	log(
		'Usage:',
		'    svgc <file> [--prefix <prefix>] [--base64] [--ext <file>] [<destination>]'
	);
} else {
	// get file path
	var fileargv = process.argv[2];
	var filepath = path.join(process.cwd(), fileargv);

	// get css path
	var cssargv = path.join(path.dirname(fileargv), path.basename(fileargv, path.extname(filepath)) + '.css');

	// get arguments
	var prefix = '';
	var suffix = '';
	var isBase64 = false;
	var isInline = true;
	var inlinePath = '';

	var destargv = cssargv;

	var args = process.argv.slice(3);
	var index = -1;

	while (++index < args.length) {
		if (args[index] === '--prefix') {
			prefix = args[++index].replace(/-$/, '') + '-';
		} else if (args[index] === '--suffix') {
			suffix = args[++index].replace(/-$/, '');
		} else if (args[index] === '--base64') {
			isBase64 = true;
		} else if (args[index] === '--fragment') {
			inlinePath = args[++index];

			isInline = false;
		} else {
			destargv = args[index];
		}
	}

	var destpath = path.join(process.cwd(), destargv);

	// get read file
	fs.readFile(filepath, {
		encoding: 'utf8'
	}).then(function (content) {
		return new xmldoc.XmlDocument(content);
	}).then(function (document) {
		// get stylesheet array
		var css = [];

		// for each symbol[id]
		getSymbols(document).forEach(function (symbol) {
			// create the class selector from the prefix and symbol id
			var selector = '.' + prefix + symbol.attr.id + suffix;

			if (isInline) {
				// clone the symbol
				var clone = cloneNode(symbol);

				// convert the symbol to a URI
				var data = node2uri(clone, document, isBase64);

				// push the selector to the stylesheet array
				css.push(selector + ' {\n\tbackground-image: url(' + data + ');\n}\n');
			} else {
				// push the selector to the stylesheet array
				css.push(selector + ' {\n\tbackground-image: url(' + inlinePath + '#' + symbol.attr.id + ');\n}\n');
			}
		});

		// return the joined stylesheet
		return css.join('\n');
	}).then(function (css) {
		// write the stylesheet to the same directory as the
		return fs.writeFile(destpath, css);
	}).then(function () {
		console.log('Successfully created "' + destargv + '"');

		// exit succesfully
		process.exit(0);
	}).catch(function () {
		console.log('Unable to create "' + destargv + '"');

		// exit unsuccesfully
		process.exit(1);
	});
}

function getSymbols(node) {
	var all = [];

	if (node.name === 'symbol' && node.attr && 'id' in node.attr) {
		all.push(node);
	} else {
		var index = -1;
		var child;

		while (child = node.children[++index]) {
			child = getSymbols(child);

			all = all.concat(child);
		}
	}

	return all;
}

function node2uri(fragment, document, isBase64) {
	// rebuild fragment as <svg>
	fragment.name = 'svg';

	delete fragment.attr.id;

	fragment.attr.viewBox = fragment.attr.viewBox || document.attr.viewBox;

	fragment.attr.xmlns = 'http://www.w3.org/2000/svg';

	// build data URI
	var uri = 'data:image/svg+xml;';

	uri += isBase64 ? 'base64,' : 'charset=utf-8,';

	uri += isBase64 ? encodeBase64(fragment) : encodeUTF8(fragment);

	// return data URI
	return uri;
}

function encodeBase64(stringable) {
	return new Buffer(String(stringable)).toString('base64');
}

function encodeUTF8(stringable) {
	return encodeURIComponent(
		String(stringable)
		// collapse whitespace
		.replace(/[\n\r\s\t]+/g, ' ')
		// remove comments
		.replace(/<\!\-\-([\W\w]*(?=\-\->))\-\->/g, '')
		// pre-encode ampersand
		.replace(/&/g, '%26')
	)
	// escape comma
	.replace(/'/g, '\\\'')
	// decode compatible characters
	.replace(/%20/g, ' ')
	.replace(/%2F/g, '/')
	.replace(/%3A/g, ':')
	.replace(/%3D/g, '=')
	// encode incompatible characters
	.replace(/\(/g, '%28')
	.replace(/\)/g, '%29');
}

function cloneNode(node) {
	var clone = {};

	for (var key in node) {
		if (node[key] instanceof Array) {
			clone[key] = node[key].map(cloneNode);
		} else if (typeof node[key] === 'object') {
			clone[key] = cloneNode(node[key]);
		} else {
			clone[key] = node[key];
		}
	}

	return clone;
}
