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
        actions: {},
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
        } catch(e) {
            if (console) {
                console.log(e);
            }
            return;
        }

        if (Locale) {
            Locale.use(this.options.locale || document.getElement("html").get("lang") || "en-US");
        }

        var sReqURL = "http://api.twitter.com/1/statuses/user_timeline/" + this.options.username + ".json",
            oQuery = Object.filter({"count": this.options.count}, function(value, key) {
                return value;
            }),
            TwitterJSONP = new Request.JSONP({
                url: sReqURL,
                data: oQuery,
                link: "chain",
                callbackKey: "callback",
                onComplete: function(jsonp) {
                    new Request({
                        url: this.options.template,
                        onSuccess: function(html) {
                            this._parse(html, jsonp);
                        }.bind(this)
                    }).send();
                }.bind(this)
            });

        TwitterJSONP.send(oQuery);
    },
    /**
    @protected
    */
    _parse: function(template, jsonp) {
        var reTag = /[{]{2}\s*([a-zA-Z0-9._\-]+)\s*[}]{2}/mig,
            oUL = new Element("ul");

        Object.each(jsonp, function(oTweet) {
            oTweet = this._doAction(oTweet);
            var sParsedHTML = template.substitute(oTweet, reTag);
            oUL.set("html", oUL.get("html") + sParsedHTML);
        }, this);
        document.id(this.element).adopt(oUL);
    },
    _doAction: function(oObj) {
        Object.each(this.options.actions, function(key, action) {
            if (typeOf(this[action]) === "function") {
                oObj[key] = this[action](oObj[key]);
            }
        }, this);
        return oObj;
    },
    linkify: function(sText) {
        sText = sText.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" rel="external">$1</a>');
        sText = sText.replace(/(^|\s)@(\w+)/g, '$1@<a href="http://www.twitter.com/$2">$2</a>');
        sText = sText.replace(/(^|\s)#(\w+)/g, '$1#<a href="http://www.twitter.com/search/$2">$2</a>');
        return sText;
    },
    formatdate: function(sDate, sFormat) {
        var sNewFormat = sFormat||this.options.dateformat,
            dDate = Date.parse(sDate);
        return dDate.format(sNewFormat);
    }
});
