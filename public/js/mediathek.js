$(document).ready(function() {

    // module pattern as described here:
    // https://learn.jquery.com/code-organization/concepts#the-module-pattern
    var gallery = (function() {

        // URL of XML data containing collection
        var data_url = "/mediathek/data/sample.xml";
        var container = $("div#container");
        var items;
        
        var init = function(config) {
            // do init stuff
        };

        var getRecordsFromServer = function(callback) {
            console.log("bar!");
            $.get(data_url, callback);
        };

        var showGallery = function() {
            console.log("foo!");
            // TODO: nach init() verschieben, callback sollte images nach HTML
            // übertragen
            getRecordsFromServer(showMediaFiles);
        };

        var showMediaFiles = function(data) {
            // TODO: Anforderung == Dateien *anzeigen*
            // weitere Anforderung: Holen, in HTML übertragen
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

        
        // return publicly accessible methods
        return {
            showGallery: showGallery
        };
        
    })();

    gallery.showGallery();
});
