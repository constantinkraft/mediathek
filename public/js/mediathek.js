$(document).ready(function() {
  // module pattern as described here:
  // https://learn.jquery.com/code-organization/concepts#the-module-pattern
  
  var gallery = (function() {
    var config = {
      data_url: "/mediathek/data/sample.xml",
      edit_url: "/mediathek/backend/edit.php",
      files_basepath: "/mediathek/public/img/",
      files_thumbspath: "/mediathek/public/img/thumbnails/"
    }
    
    var templatePaths = [
      'templates/info-table.html',
      'templates/media-object.html',
      'templates/edit-modal.html'
    ];
    
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

      // load Mustache templates
      $.each(templatePaths, function(idx, tpl) {
        $.Mustache.load(tpl)
          .done(function() {
            console.log('template ' + tpl + ' loaded…');
          });
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
      // TODO: further decouple view logic and actual presentation of images
      // iterate XML elements
      $.each($mediaObjectsXML, function( idx, el ) {
        // 1) Über alle Elemente iterieren
        // 2) Views vorbereiten
        // 3) Templates rendern
        $el = $(el);
        var filename = $el.find("filename").text();
        // TODO: stattdessen über XML-Elemente
        // iterieren, da hässlich, redundant 
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
        $('.info-modal').hide();
        
        // bind event handlers
        $('a.more-link').click(showInfoModal);
        $('a.iconbutton-edit').click(showEditModal);
      });
    };
    
    var showInfoModal = function() {
      // DEBUG
      console.debug("showInfoModal()");
      // TODO: prevent modal from being shown > 1x
      //if ($('.info-modal:visible, .edit-modal:visible').length > 0) {
      //  return false;
      //}
      // Get index of current item to access info-container in hidden div
      idx = $(this).parent().index();
      // TODO: attach handler to button -> inline editing
      $('#hidden-infos div.info-modal').eq(idx).fadeIn('slow')
        .find('.closebutton')
        .click(function(){
          $(this).parent().fadeOut('fast');
        });
      
    };
    
    var showEditModal = function() {
      if ($('.edit-modal').length > 0) {
        return false;
      }
      // TODO: combine with showInfoModal function to one generic showModal(tpl, data )
      // function
      // DEBUG
      console.debug("showEditModal()");
      // TODO: decouple from representation layer
      
      // TODO: get corresponding view data
      // FIXME: dependent on view structure
      var idx = $('.container').find($(this)).parent().index();
      $mediaObject = $mediaObjectsXML.eq(idx);
      // DEBUG
      console.debug($mediaObject);
      var viewData = {
        "filename": "",
        "title": "",
        "description": "",
        "keywords": [],
        "country": "",
        "city": "",
        "author": "",
      };
      // TODO: DRY out
      for (var property in viewData) {
        if (property == "keywords") {
          $.each($mediaObject.find('keyword'), function(idx, val) {
            viewData[property].push($(val).text());
          });
        } else {
          viewData[property] = $mediaObject.find(property).text();
        }
      }
      
      $('body').mustache('edit-modal', viewData)
        .fadeIn('fast')
        .find('.closebutton')
        .click(function(){
          $(this).parent().fadeOut('fast')
          .remove();
        });
      $('#edit-form').submit(processForm);
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
      
      // FIXME: shouldn't be called here -> single responsibility!
      showGallery();
    };
    
    var processForm= function( event ) {
      // prevent form from being submitted normally
      event.preventDefault();
      // DEBUG
      console.debug("form submitted");
      // AJAX request
      $.post(config.edit_url, $( "#edit-form" ).serialize())
        .done(function( data ) {
          console.debug(data);
          // TODO: show success message
        })
        .fail(function() {
          // TODO: show error msg
          console.error("request failed!");
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

  //gallery.showGallery();
});
