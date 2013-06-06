PageStopwatch
=============

measure load times in real user browsers.

Real user performance trackers often can track dom ready and dom load, if you want more detail on the load time of individual resources you have to make individual tests on a controlled environment. This is because browser don't expose an Javascript API to monitor network activity (unless a plugin is installed, not practical for real user monitoring).

PageStopwatch estimates load time of resources (scripts, images and css) on real user browsers, by detecting when script, img or link tags are added to the document. This can be acheived used MutationObserver, which is present in most modern browsers:

Supported Browsers
------------------

- Chrome 26+
- Firefox 14+
- Safari 6+

Basically the requirement is MutationObserver support, you can test it by checking ```pageStopwatch.supported```

Demo
-----

[DEMO](http://benjamine.github.io/PageStopwatch/demo/demo.html)

Usage
------

``` js

// start and show load times on console
var stopwatch = pageStopwatch.start().notifyConsole();

// send to google analytics (using _trackTiming)
stopwatch.notifyGA();

// later...
setTimeout(function(){
	// render a waterfall chart in the page
	stopwatch.drawAt(document.getElementById('#pageLoadChart'));	
}, 15000);

```

License
-----------
The MIT License (MIT)

Copyright (c) 2013 Benjamin Eidelman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
