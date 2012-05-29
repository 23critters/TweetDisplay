Tweet Display
===========

Tweet Display is a nifty widget, written in MooTools framework, that allows you to pull information via Twitters API about a certain user. Presents the tweets in a UL-list. 
You may template the output however you want. However, please remember that the template's HTML is looped.
All data is transfered in JSON/P.


How to use
----------

Javascript snippet to initialize the class:

	window.addEvent("domready", function() {
		var TD = new TweetDisplay({
			element: document.id("div#tweetdisplay"),
			username: "23critters"
		});
	});


HTML snippet:

	<div id="tweetdisplay">
	</div>

CSS selector to style the active navigation anchor, eg:

	DIV#tweetdisplay {background-color: #ccc;}

Options
-----------------
    element: (string||object) reference to div dom element container. if passing a string, supply it's id
    count: (integer) how many tweets to pull | default: 5
    template: (string) path to the template containing the HTML | default: "TweetDisplay.html"
    username: (string) username of user from who to fetch information from | default: "23critters"
	actions: (object) a set of "instructions" if you want to pass information from Twitter via different parsers | default: {"linkify":"text", "formatdate":"created_at"}
	dateformat: (string) a model over how to format the printed date, more information at http://mootools.net/docs/more/Types/Date#Date:format | default: "%Y-%m-%d %H:%M:%S"


Methods
-----------------

The following methods are availible publicly:

    None


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

	* Unable to show any information about the user
	

Notes
-----------------
Version 0.9.9

	* Added the ability to send information from the JSON/P response to various methods, at this time there's only "linkify" and "formatdate"
	* Added option to allow formation of dates
	* Tweet texts should be linkable. URL, #tags and @usernames

Version 0.9

    * First version
	