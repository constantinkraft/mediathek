$(document).ready(function() {

    // module pattern as described here:
    // https://learn.jquery.com/code-organization/concepts#the-module-pattern
    var gallery = (function() {

        // URL of XML data containing collection
        var data_url = "/mediathek/data/sample.xml";
        var container = $("div#container");
        
        var init = function(config) {
            // do init stuff
        };

        var getRecordsFromServer = function(callback) {
            console.log("bar!");
            $.get(data_url, showMediaFiles);
        };

        var showGallery = function() {
            console.log("foo!");
            getRecordsFromServer(showMediaFiles);
        };

        var showMediaFiles = function(data) {
            $xml = $( $.parseXML(data) );

            $root = $xml.find("collection");
            console.log($root.find('image'));
            //~ console.log($data);
            //~ $.each(data, function(val) {
                //~ console.log(val)
            //~ });
        };

        
        // return publicly accessible methods
        return {
            showGallery: showGallery
        };
        
    })();

    gallery.showGallery();
});
