var toml = require("toml");
var S = require("string");

var CONTENT_PATH_PREFIX = "content/post";

module.exports = function(grunt) {

    grunt.registerTask("lunr-index", function() {

        grunt.log.writeln("Build pages index");
var test = "   hello   world   ";
var test2 = test.trim();
grunt.log.writeln(test2);
        var indexPages = function() {
	grunt.log.writeln("Build pages index2");
            var pagesIndex = [];
            grunt.file.recurse(CONTENT_PATH_PREFIX, function(abspath, rootdir, subdir, filename) {
                grunt.verbose.writeln("Parse file:",abspath);
                pagesIndex.push(processFile(abspath, filename));
            });

            return pagesIndex;
        };
	
        var processFile = function(abspath, filename) {
            var pageIndex;
	grunt.log.writeln("Build pages index3");
            if (S(filename).endsWith(".html")) {
                pageIndex = processHTMLFile(abspath, filename);
            } else {
                pageIndex = processMDFile(abspath, filename);
            }
grunt.log.writeln("Build pages index4");
            return pageIndex;
        };

        var processHTMLFile = function(abspath, filename) {
            var content = grunt.file.read(abspath);
            var pageName = S(filename).chompRight(".html").s;
            var href = S(abspath)
                .chompLeft(CONTENT_PATH_PREFIX).s;
            return {
                title: pageName,
                href: href,
                content: S(content).trim().stripTags().stripPunctuation().s
            };
        };

        var processMDFile = function(abspath, filename) {
            var content = grunt.file.read(abspath);
            var pageIndex;
            // First separate the Front Matter from the content and parse it
            content = content.split("---");
            content = content[1].match(/[^\r\n]+/g);
	var tags = [];
	for (var i = 2 ; i < content.length; i++)
	{
		if(content[i][0] !== "-")
			continue;
		content[i] = content[i].trim().replace('- ', '');
		tags.push(content[i]);
	}
var title = content[0].substring(content[0].indexOf('"') + 1, content[0].length - 1).trim();
grunt.log.writeln(title);
var dates = content[1].replace('date: ', '').split("-");


	var href = "/" + dates[0] + "/" + dates[1] + "/" + title.toLowerCase().replace(/ /gi, '-') + "/";
	grunt.log.writeln(href);
            // Build Lunr index for this page
            pageIndex = {
                title: title,
                tags: tags,
                href: href,
                content: S(content[2]).trim().stripTags().stripPunctuation().s
            };

            return pageIndex;
        };

        grunt.file.write("static/js/lunr/PagesIndex.json", JSON.stringify(indexPages()));
        grunt.log.ok("Index built");
    });
};