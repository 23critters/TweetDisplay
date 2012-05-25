/*
 ---
 description: List Tweets for a certain Twitter username

 license: MIT-style

 authors:
 - Thomas Kunambi
 - kunambi

 requires:
 - core/1.4: [Class, Object, Element, Request.JSONP]
 
 
 provides: [TweetDisplay]

 ...
 */

var TweetDisplay = new Class({
    Implements: Options,
    options: {
        element: null,
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
                            console.log(jsonp);
                            this.parse(html, jsonp);
                        }.bind(this)
                    }).send();
                }.bind(this)
            });

        TwitterJSONP.send(oQuery);
    },
    parse: function(template, jsonp) {
        var reTag = /[{]{2}\s*([a-zA-Z0-9._\-]+)\s*[}]{2}/mig,
            oUL = new Element("ul");

        Object.each(jsonp, function(item) {
            var sParsedHTML = template.substitute(item, reTag);
            oUL.set("html", oUL.get("html") + sParsedHTML);
        });
        document.id(this.element).adopt(oUL);
    }
});
