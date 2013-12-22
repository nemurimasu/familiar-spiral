require.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'jszip': '../bower_components/jszip/jszip',
        'jszip-load': '../bower_components/jszip/jszip-load',
        'jszip-inflate': '../bower_components/jszip/jszip-inflate'
    },
    shim: {
        'jszip': {
            exports: 'JSZip'
        },
        'jszip-load': {
            deps: ['jszip'],
            exports: 'JSZip'
        },
        'jszip-inflate': {
            deps: ['jszip', 'jszip-load'],
            exports: 'JSZip'
        }
    }
});
