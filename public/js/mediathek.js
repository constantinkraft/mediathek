$(document).ready(function() {

    // module pattern as described here:
    // https://learn.jquery.com/code-organization/concepts#the-module-pattern
    var gallery = (function() {
        var config = {
            data_url: "/mediathek/data/sample.xml",
            container: $( '<div class="container"></div>' ),
            files_basepath: "/mediathek/public/img/",
            files_thumbspath: "/mediathek/public/img/thumbnails/"
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
            
            // setup html container
            // getRecordsFromServer(callback)
            getRecordsFromServer(processXML);

            // 
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
            var $xml = $( $.parseXML(data) );

            //~ $root = $xml.find("collection");
            // Elemente holen
            // TODO: selector feintunen: nur media-objects
            $elements = $xml.find('image, document');

            $.each($elements, function( idx, el ) {
                $el = $(el);
                console.log($el);
                var filename = $el.find("filename").text();
                // DEBUG
                console.log("filename: " + filename);

                var infoTableView;
                $.each($el.children(), function( idx, el ) {
                    console.log($(el).tagName);
                    // Kind-Elemente von MediaObjekt mit infoTableView mergen:
                    // $.extend
                });
                var mediaObjectsView = {
                    "filename": filename,
                    "thumbfile": function() {
                        if( infoTableView.filetype == "image/jpeg" ) {
                            return config.file_thumbspath + this.filename;
                        } else {
                            return config.file_thumbspath + "defaultthumbnail.png";
                        }
                    }
                };
                
                // 1) Über alle Elemente iterieren
                // 2) Daten in Template einfügen
                // 3) Templates rendern
            });


        };

        init( {} );
        setup();
        
        // return publicly accessible methods
        return {
            //~ init: init,
            showGallery: showGallery
        };
        
    })();

    gallery.showGallery();
});
