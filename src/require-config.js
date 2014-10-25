require.config({
    //urlArgs: "cachebust=" +  (new Date()).getTime(),
    paths: {
        //glMatrix: 'gl-matrix-min',
        jquery: "../lib/jquery/jquery-2.1.1.min",
        glMatrix: "../lib/gl-matrix-min",
        cannon: "../lib/cannon.min.js",

        text: "../lib/text", // plugin for loading plain-text files
        image: "../lib/image" // plugin for loading images
    }
});

require(['main'], function(main){


});