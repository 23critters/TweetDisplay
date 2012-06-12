/*
---

script: TweetDisplay.js

name: TweetDisplay

description: List Tweets for a certain Twitter username and parses them via a HTML template.

license: MIT-style license

authors:
  - Thomas Kunambi
  - kunambi

requires:
  - Core/Class
  - Core/Object
  - Core/Element
  - More/Request.JSONP
  - More/Date

provides: [TweetDisplay]

...
*/

var TweetDisplay = new Class({
    Implements: Options,
    options: {
        element: null,
        actions: {
            "text": "linkify",
            "created_at": "formatdate"
        },
        locale: "",
        dateformat: "%Y-%m-%d %H:%M:%S",
        count: 5,
        template: "TweetDisplay.html",
        username: "23critters"
    },
    /**
     @constructor
     @this {TweetDisplay}
     @throws {String} If this.element can't be found, throw error
     @param {Array} Options for behaviours of the displaying of tweets
     @throws {Error} Console.logs any error messages
     @author Thomas Kunambi
     @version 1.0
     */
    initialize: function(options) {
        this.setOptions(options);
        try {
            this.element = document.id(this.options.element) || this.options.element;
            if (this.element === null) {
                throw("DOM object not found");
            }
            if (!this.options.username.trim()) {
                throw("Must set a username");
            }
            /**
             * @since 0.9
             */
			if (Locale && this.options.locale) {
				Locale.use(this.options.locale || document.getElement("html").get("lang") || "en-US");
			}
        } catch(e) {
            if (console) {
                console.log(e);
            }
            return;
        }

        var oSettings = {
                "API": "http://api.twitter.com/1/statuses/user_timeline/",
                "twtrKey": "JSONP.",
                "htmlKey": "HTML."
            },
            sReqURL = oSettings.API + this.options.username + ".json",
            oQuery = Object.filter({"count": this.options.count}, function(value) {
                return value;
            }),
            sEntireURL = sReqURL + "?" + Object.toQueryString(oQuery),
            reqTwtr = null,
            reqTmpl = new Request({
                url: this.options.template,
				method: "get",
                onSuccess: function(sHTML) {
                    reqTwtr = new Request.JSONP({
                        url: sReqURL,
                        data: oQuery,
                        link: "chain",
                        callbackKey: "callback",
                        onComplete: function(oJSONP) {
                            this.set_cache(oSettings.twtrKey + sEntireURL, JSON.encode(oJSONP));
                            this._parse(sHTML, oJSONP);
                        }.bind(this)
                    });
                    this.set_cache(oSettings.htmlKey + this.options.template, sHTML);

                    if (this.in_cache(oSettings.twtrKey + sEntireURL)) {
                        this._parse(sHTML, JSON.decode(sessionStorage.getItem(oSettings.twtrKey + sEntireURL)));
                    } else {
                        reqTwtr.send();
                    }
                }.bind(this)
           });

        if (this.in_cache(oSettings.htmlKey + this.options.template)) {
            this._parse(sessionStorage.getItem(oSettings.htmlKey + this.options.template), JSON.decode(sessionStorage.getItem(oSettings.twtrKey + sEntireURL)));
        } else {
            reqTmpl.send();
        }
    },
    /**
     @protected
     @return {void}
     @description traverses the json-data and replaces the occurances it finds in the HTML template
     @param {String} HTML template
     @param {Object} JSONP-data from Twitters API
     @since 0.1
     */
    _parse: function(template, jsonp) {
        var regTag = /[{]{2}\s*([a-zA-Z0-9._\-]+)\s*[}]{2}/mig,
            oUL = new Element("ul");

        Object.each(jsonp, function(oTweet) {
            var oNestedObjects = Object.filter(oTweet, function(value) {
                    return typeOf(value) === "object";
                });

            if (Object.getLength(oNestedObjects)) {
                Object.each(oNestedObjects, function(oNestedValues, oName) {
                    Object.each(oNestedValues, function(value, key) {
                        oTweet[oName + "." + key] = value;
                    });
                });
            }
            oTweet = this._doAction(oTweet);
            var sParsedHTML = template.substitute(oTweet, regTag);
            oUL.set("html", oUL.get("html") + sParsedHTML);
        }, this);
        document.id(this.element).adopt(oUL);
    },
    /**
     @protected
     @return {Object}
     @description returns the passed object - but parsed through another method, or untouched if no method exists
     @param {Object} object to be parsed through any other method
     @since 0.8
     */
    _doAction: function(oObj) {
        Object.each(this.options.actions, function(action, key) {
            if (typeOf(this[action]) === "function") {
                oObj[key] = this[action](oObj[key]);
            }
        }, this);
        return oObj;
    },
    /**
     @public
     @return {void}
     @description add new item with unique key to sessionStorage
     @param {String} a URL
     @param {String} serialised JSON object
     @since 1.0
     */
    set_cache: function(sURL, sJSON) {
        sessionStorage.setItem(sURL, sJSON);
    },
    /**
     @public
     @return {Boolean}
     @description check wether the key exists in the sessionStorage
     @param {String} a URL, used as a key
     @since 1.0
     */
    in_cache: function(sURL) {
        return sessionStorage.getItem(sURL) !== null;
	},
    /**
     @public
     @return {void}
     @description clears the sessionStorage
     @since 1.0
     */
    clear_cache: function() {
        sessionStorage.clear();
    },
    /**
     @public
     @return {String}
     @description takes string and returns http://, ftp://, file:// clickable. Also @usernames and #tags
     @since 0.8
     */
    linkify: function(sText) {
        sText = sText.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/mig, '<a href="$1" rel="external">$1</a>');
        sText = sText.replace(/(^|\s)@(\w+)/g, '$1@<a href="http://www.twitter.com/$2">$2</a>');
        sText = sText.replace(/(^|\s)#(\w+)/g, '$1#<a href="http://www.twitter.com/search/$2">$2</a>');
        return sText;
    },
    /**
     @public
     @return {String}
     @description formats date according to specification
     @see http://mootools.net/docs/more/Types/Date#Date:format
     @since 0.8
     */
    formatdate: function(sDate, sFormat) {
        var sNewFormat = sFormat||this.options.dateformat,
            dDate = Date.parse(sDate);
        return dDate.format(sNewFormat);
    }
});
