require.config({
    //urlArgs: "cachebust=" +  (new Date()).getTime(),
    paths: {
        //glMatrix: 'gl-matrix-min',
        jquery: "../lib/jquery/jquery-2.1.1.min",
        glMatrix: "../lib/gl-matrix-min",
        text: "../lib/text" // plugin for loading plain-text files
    }
});

require(['main'], function(main){


});