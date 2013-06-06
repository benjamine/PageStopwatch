(function() {
    "use strict";

    var pageStopwatch = window.pageStopwatch = {
        supported: (typeof window.MutationObserver === 'function'),
        create: function(){
            return this.last = new this.Stopwatch();
        },
        start: function(){
            return this.create().start();
        }
    };

    function addListener(obj, eventName, listener) {
        if (obj.addEventListener) {
            obj.addEventListener(eventName, listener, false);
        } else {
            obj.attachEvent("on" + eventName, listener);
        }
    }

    addListener(document, "DOMContentLoaded", function(){
        pageStopwatch.readyTime = new Date().getTime();
    });
    addListener(window, "load", function(){
        pageStopwatch.loadTime = new Date().getTime();
    })

    var Stopwatch = pageStopwatch.Stopwatch = function Stopwatch() {
        if (!pageStopwatch.supported) {
            throw new Error('pageStopwatch not supported on this browser (MutationObserver not found)');
        }
        this.resources = {};
        this.notify = {};
    };

    Stopwatch.prototype.start = function() {
        this.startTime = new Date().getTime();
        this.resources = {};
        this.rootNode = document.querySelector('html');
        monitorResources(this);
        return this;
    };

    Stopwatch.prototype.stop = function() {
        if (!this.observer) {
            return this;
        }
        this.observer.disconnect();
        this.observer = null;
        return this;
    };

    Stopwatch.prototype.notifyConsole = function() {
        this.notify.console = true;
        return this;
    };

    Stopwatch.prototype.notifyGA = function() {
        this.notify.ga = true;
        return this;
    };

    Stopwatch.prototype.drawAt = function(container) {
        var ce = function(tagName){ return document.createElement(tagName) };
        var div = ce('div');
        div.setAttribute('style', 'position: relative;');
        var resources = [];
        var minStart = 99999;
        for (var url in this.resources) {
            var resource = this.resources[url];
            resources.push({
                url: url,
                start: resource[0],
                elapsed: resource[1]
            });
            var minStart = Math.min(minStart, resource[0]);
        }
        resources.sort(function(res1, res2) {
            return res1.start - res2.start;
        });
        var bar;
        if (pageStopwatch.readyTime) {        
            var readyTime = (pageStopwatch.readyTime - this.startTime) / 1000;
            if (pageStopwatch.readyTime > minStart) {
                bar = ce('div');
                bar.setAttribute('style', 'left: ' + (readyTime - minStart) * 100 + 'px; width: 3px; height: 100%; background: #ff3; display: block; position: absolute;');
                bar.setAttribute('title', 'document ready');
                bar.innerHTML = '&nbsp;';
                div.appendChild(bar);
            }
        }
        if (pageStopwatch.loadTime) {        
            var loadTime = (pageStopwatch.loadTime - this.startTime) / 1000;
            if (pageStopwatch.loadTime > minStart) {
                bar = ce('div');
                bar.setAttribute('style', 'left: ' + (loadTime - minStart) * 100 + 'px; width: 3px; height: 100%; background: #f33; display: block; position: absolute;');
                bar.setAttribute('title', 'document loaded');
                bar.innerHTML = '&nbsp;';
                div.appendChild(bar);
            }
        }
        for (var i = 0; i < resources.length; i++) {
            var resource = resources[i];
            bar = ce('div');
            bar.setAttribute('style', 'left: ' + (resource.start - minStart) * 100 + 'px; width: ' + resource.elapsed * 100 + 'px; height: 6px; border: 2px solid #ddf; background: #99f; display: block; position: relative;');
            bar.setAttribute('title', 'start: ' + resource.start + ', elapsed: ' + resource.elapsed + ', url: ' + resource.url);
            bar.innerHTML = '&nbsp;';
            div.appendChild(bar);
        }
        container.appendChild(div);
        return this;
    };

    var monitorResourceNode = function(stopwatch, node) {
        //var creationTime = new Date().getTime();
        node.__pageStopwatchStart = new Date().getTime();
        var onload = function() {
            var url = node.getAttribute('src') || node.getAttribute('href');
            if (!url) {
                return;
            }
            var startTime = stopwatch.startTime;
            var start = node.__pageStopwatchStart - startTime;
            var end = new Date().getTime() - startTime;
            var elapsed = end - start;
            stopwatch.resources[url] = [start / 1000, elapsed / 1000];

            if (stopwatch.notify.console) {
                if (window.console && window.console.log) {
                    console.log([node.tagName, ' loaded. start: ', start / 1000, ', elapsed: ', elapsed / 1000, ', url: ', url].join(''));
                }
            }
            if (stopwatch.notify.ga) {
                if (!window._gaq) {
                    window._gaq = [];
                }
                if (elapsed > 0 && elapsed < 60000) {
                    _gaq.push(['_trackTiming', 'pageStopwatchElapsed', url, elapsed]);
                }
                if (start > 0 && start < 60000) {
                    _gaq.push(['_trackTiming', 'pageStopwatchStart', url, start]);
                }
            }

        };

        // most browsers
        node.onload = onload;
        // IE 6, 7
        node.onreadystatechange = function() {
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                onload();
            }
        };
    };

    var monitorResourceNodes = function(stopwatch, nodes) {
        var nodesLength = nodes && nodes.length;
        if (!nodesLength) {
            return;
        }
        for (var i = 0; i < nodesLength; i++) {
            var node = nodes[i];
            if (node.tagName === 'SCRIPT' || node.tagName === 'IMG' || node.tagName === 'LINK') {
                monitorResourceNode(stopwatch, node);
            }
        }
    };

    var monitorResources = function(stopwatch) {
        var root = stopwatch.rootNode;
        stopwatch.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes') {
                    if (mutation.target.__pageStopwatchStart) {
                        mutation.target.__pageStopwatchStart = new Date().getTime();
                    }
                } else if (mutation.type === 'childList') {
                    monitorResourceNodes(stopwatch, mutation.addedNodes);
                }
            });
        });
        monitorResourceNodes(root.querySelectorAll('script,img,link'));
        var config = {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['src', 'href']
        };
        stopwatch.observer.observe(root, config);
    };

})();


pageStopwatch.start().notifyConsole();