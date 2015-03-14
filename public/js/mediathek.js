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
    
    var $mediaObjectsXML = {};
    
    var init = function( settings ) {
      // do init stuff
      // DEBUG
      console.debug("init()");
      
      // Einstellungen können überschrieben werden
      $.extend( config, settings );
      // DEBUG
      //~ console.log(config);
    };

    var setup = function() {
      // DEBUG
      console.debug("setup()");
      // Container versteckt halten
      config.container.hide();
      
      // load Mustache template
      $.Mustache.load('templates/info-table.html')
          .done(function() {
              console.log('template loaded…');
          });
      $.Mustache.load('templates/media-object.html')
          .done(function() {
              console.log('template loaded…');
          });
          
      // setup html container
      // getRecordsFromServer(callback)
      getRecordsFromServer(processXML);
    }

    var getRecordsFromServer = function(callback) {
      console.debug("getRecordsFromServer()");
      // TODO: AJAX request error handling
      $.get(config.data_url, callback);
    };

    var showGallery = function() {
      console.debug("showGallery()");
      // TODO: nach init() verschieben, callback sollte images nach HTML
      // übertragen
      // iterate XML elements
      //console.log($mediaObjectsXML);
      $.each($mediaObjectsXML, function( idx, el ) {
        // 1) Über alle Elemente iterieren
        // 2) Views vorbereiten
        // 3) Templates rendern
        $el = $(el);
        var filename = $el.find("filename").text();
        // TODO: stattdessen über XML-Elemente
        // iterieren, da hässlich, redundandt 
        var infoTableView = {
            "filetype": "",
            "filedate": "",
            "filename": "",
            "filesize": "",
            "title": "",
            "description": "",
            "camera-make": "",
            "camera-model": "",
            "resolution": "",
            "iso-speed": "",
            "exposure-time": "",
            "flash-used": "",
            "keywords": "",
            "city": "",
            "country": "",
            "author": "",
        }
        for (var property in infoTableView) {
            infoTableView[property] = $el.find(property).text();                    // TODO: handle <keywords> seperately
        }

        console.debug(infoTableView);
        
        var mediaObjectsView = {
            "filename": filename,
            "thumbfile": function() {
                if( infoTableView.filetype == "image/jpeg" ) {
                    // FIXME: config-Variablen nicht im scope
                    //return config.file_thumbspath + this.filename;
                    return "/mediathek/public/img/thumbnails/" +
                        this.filename;
                } else {
                    return "/mediathek/public/img/thumbnails/" +
                        "defaultthumbnail.png";
                }
            }
        };
        var $item = $($.Mustache.render('media-object', mediaObjectsView));
        // render info table
        var infoTable = $($.Mustache.render('info-table', infoTableView));
        
        infoTable.appendTo('#hidden-infos');
        //console.log($item.html());
        
        // TODO: bind event handler
        $('div#content .container').append($item);
        $('.info-container').hide();
        // bind event handler
        $('a.more-link').click(showInfoModal);
      });
    };
    
    var showInfoModal = function() {
      // DEBUG
      console.debug("showModalInfo()");
      // Get index of current item to access info-container in hidden div
      idx = $(this).parent().index();
      // TODO: attach handler to button -> inline editing
      $('#hidden-infos div').eq(idx).fadeIn('slow')
        .find('.closebutton')
        .click(function(){
          $(this).parent().fadeOut('fast');
        });
      
    };

    var processXML = function(data) {
      // DEBUG
      console.debug("processXML()");
      //console.debug(this.)
      // XML in HTML übertragen
      var $xml = $( $.parseXML(data) );

      //~ $root = $xml.find("collection");
      // Elemente holen
      // TODO: selector feintunen: nur media-objects
      console.log(config);
      console.log($mediaObjectsXML);
      $mediaObjectsXML = $xml.find('media-object');
      console.log($mediaObjectsXML);
      
      // FIXME: call to this shouldn't be here!
      showGallery();
    };

    var showEditModal = function() {
      // DEBUG
      console.debug("showEditModal()");
      // TODO: decouple from representation layer
      
    }
    
    init( {} );
    setup();
    
    // return publicly accessible methods
    return {
        //~ init: init,
        showGallery: showGallery
    };
      
  })();

  //gallery.showGallery();
});
