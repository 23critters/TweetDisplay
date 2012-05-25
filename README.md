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


Methods
-----------------

The following methods are availible publicly:

    None


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

	* Unable to show any information about the user
	* Not possible to automaticly create links within the tweet
	* Not possible to format the date
	

Notes
-----------------

Version 0.9

    * First version
	