
requirejs.config({
    waitSeconds: 20,
    paths: {
        threejs: 'http://cdnjs.cloudflare.com/ajax/libs/three.js/r58/three.min',
        handlebars: 'http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min',
        angular: 'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.5/angular.min',
        'angular-strap': 'http://cdnjs.cloudflare.com/ajax/libs/angular-strap/0.7.4/angular-strap.min',
        boostrap: 'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min',
        bean: 'http://cdnjs.cloudflare.com/ajax/libs/bean/1.0.3/bean.min' 
    },
    shim: {
        'angular-strap': {
            deps: ['angular', 'boostrap']
        },
        threejs: {
            deps: ['bean']
        }
    }
});

requirejs.onError = function (err) {
    //do something here to log errors
    if (typeof window.console == 'undefined') return;
    window.console.log('error loading modules: ', err);
};

require(['angular-strap', 'handlebars'], function(){
    require(['threejs'], function(){
        console.log('all modules loaded');
    });
});