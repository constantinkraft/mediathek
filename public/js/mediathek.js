$(document).ready(function() {

    // module pattern as described here:
    // https://learn.jquery.com/code-organization/concepts#the-module-pattern
    var gallery = (function() {

        var config = {
            data_url: "/mediathek/data/sample.xml",
            container: $( '<div class="container"></div>' ),
        }
        
        var init = function( settings ) {
            // do init stuff
            
            // Einstellungen können überschrieben werden
            $.extend( config, settings );
            // DEBUG
            //~ console.log(config);
        };

        var setup = function() {
            // Container versteckt halten
            config.container.hide();
            
            getRecordsFromServer(processXML);
            // setup html container
            // getRecordsFromServer(callback)
        }

        var getRecordsFromServer = function(callback) {
            console.log("bar!");
            $.get(config.data_url, callback);
        };

        var showGallery = function() {
            console.log("foo!");
            // TODO: nach init() verschieben, callback sollte images nach HTML
            // übertragen
            
        };

        var processXML = function(data) {
            // XML in HTML übertragen
            $xml = $( $.parseXML(data) );

            //~ $root = $xml.find("collection");
            $images = $xml.find('image');
            console.log($images);
            $.each($images, function(i, image) {
                //~ var title = $(image).find('title').text();
                //~ var description
                $.each($($(image).find("*")), function(i, v) {
                    console.log($(v).text());
                });
            });
        };

        init( {} );
        setup();
        
        // return publicly accessible methods
        return {
            init: init,
            showGallery: showGallery
        };
        
    })();

    gallery.showGallery();
});
