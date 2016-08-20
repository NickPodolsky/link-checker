var Cheerio     = require('cheerio');
var Promise     = require('bluebird');

// Module constructor
var m = function(siteUrl, page){
    this.site = siteUrl;
    this.page = page;
    this.tags = ['a', 'style', 'script', 'link', 'area', 'img', 'audio', 'video', 'embed', 'iframe', 'input', 'source', 'track'];
};

// Run link extracting
m.prototype.extract = function(){
    this.$ = Cheerio.load(this.page);
    return this.createListOfElementsByTags(this.$, this.tags)
        .bind(this)
        .then(function(elementsList){
            return this.complementListWithXPath(this.$, elementsList);
        })
        .then(function(elementsList){
            return this.complementListWithUrlsPositions(this.$, elementsList)
        })
        .then(function(elementsList){
            return this.normalizeUrls(elementsList, this.site);
        })
        .then(function(elementsList){
            return this.buildResultedList(elementsList);
        });

};


// Collect elements which corresponding target tags
m.prototype.createListOfElementsByTags = function($, tags){
    var elements = [];
    return Promise.try(function(){
        tags.forEach(function(tag){
            $(tag).map(function(index,element){
                var attr = ($(element).attr("href") !== undefined) ? 'href' : 'src';
                var url = $(element).attr("href") || $(element).attr("src");
                if(url !== undefined && url !=='#' && url !== '/'){
                    elements.push({
                        element: element,
                        attr: attr,
                        rawUrl: url,
                        position: {line: null, column: null},
                        xpath: null
                    });
                }
            });
        }, this);
        return elements;
    });
};


// Iterate on list and append XPath to items
m.prototype.complementListWithXPath = function($, elementsList){
    elementsList.map(function(element){
        element.xpath = this.calculateXPath($, element.element);
        return element;
    }, this);
    return elementsList;
};

// Calculate xpath for given element
m.prototype.calculateXPath = function($, element){
    var xpath = '';
    element = $(element);
    while(element[0] !== undefined && element[0].type !== 'root'){
        var id = element.parent().children(element[0].name).index(element) + 1;
        id = (id > 1) ? '[' + id + ']' : '';
        xpath = '/' + element[0].name + id + xpath;
        element = element.parent();
    }
    return xpath;
};


// Fill page with placeholders match elements list index, find placeholders and finds url position in page text
m.prototype.complementListWithUrlsPositions = function($, elementsList){
    return this.fillPageWithPlaceholders($, elementsList)
        .bind(this)
        .then(function(page){
            return this.extractPositionsByPlaceholders(page, elementsList);
        });
};

// Replace urls on placeholders which contains url's id in list
m.prototype.fillPageWithPlaceholders = function($, elementsList){
    var getPlaceholder = this.getPlaceholder;
    return Promise.try(function(){
        elementsList.forEach(function(element, index){
            var placeholder = getPlaceholder(index, element.rawUrl.length);
            $(element.element).attr(element.attr, placeholder);
        }, this);

        return $.html();                                 // render page with placeholders
    });
};

// Create link placeholder based on link index in list (placeholders length equals to original urls length)
m.prototype.getPlaceholder = function(index, replacedUrlLength){
    var placeholder = index.toString();
    while(placeholder.length < 4){                      // complement counter to 4 digits
        placeholder = '0' + placeholder;
    }
    placeholder = '~' + placeholder + '~';              // wrap counter in anchors
    while(placeholder.length < replacedUrlLength){      // complement counter to link placeholder length
        placeholder = placeholder + '~';
    }
    return placeholder;
};


// Split page on lines, in each line search placeholders, complement list with placeholder position
m.prototype.extractPositionsByPlaceholders = function(page, elementsList){
    var lines = page.match(/[^\r\n]+/g);                // split page into lines
    var placeholderRE = /~(\d{4})~/g;
    var match = null;
    lines.forEach(function(line, index) {               // search placeholders on each line
        var lineNumber = index + 1;
        while ((match = placeholderRE.exec(line)) != null) {
            elementsList[parseInt(match[1])].position = {line: lineNumber, column: match.index};    // update list item with position
        }
    });

    return elementsList;
};


// Transform relative urls to absolute and append protocol if needs
m.prototype.normalizeUrls = function(elementsList, siteUrl){
    elementsList.map(function(element) {
        var url = element.rawUrl;
        url = (url.substr(0,2) !== '//') ? url : 'http:' + url;
        url = (url.substr(0,1) !== '/') ? url : siteUrl + url;
        return element.url = url;
    });
    return elementsList;
};


// Create resulted clean list based on working one
m.prototype.buildResultedList = function(elementsList){
    var resultedList = [];
    elementsList.forEach(function(element){
        var item = {
            url:        element.url,
            rawUrl:     element.rawUrl,
            xpath:      element.xpath,
            position:   element.position,
            httpCode:   null,
            broken:     false
        };
        resultedList.push(item);
    });
    return resultedList;
};

module.exports = m;