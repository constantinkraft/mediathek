<?php
/**
 * PHP-Backend zum Bearbeiten der XML-Datenbasis
 *
 * (c) 2015 Constantin Kraft <ckraft@smail.uni-koeln.de>
 */

/**
 * Class for handling API calls
 */
class BackendApi {
    #code
}

/**
 * Class for manipulating XML data 
 */
class XMLEditor {
    
    private $xmlPath;
    private $domDocument;
        
    public function __construct($xml_filename) {
        $document = new DOMDocument();
        $document->load($xml_filename);
        
        // gültig und wohlgeformt?
        if($doc->validate()) {
            $this->domDocument = $doc;
            $this->xmlPath = $xmlPath;
        }
        else {
            throw new Exception("Document did not validate");
        } 
    }
    
    /**
     * Get data array for given media object identified by file name
     * @param String $filename file name of media object
     * @return array  array of data describing found element; otherwise empty
     */
    private function getMediaObjectByFilename($filename) {
        $query = "//collection/media-object/file-name[text() = $filename]/..";
        
    }
    
    private function removeMediaObject($filename) {
        // TODO: remove media object by given filename
    }
    
    private function insertMediaObject($data_array) {
        // TODO: insert media object
    }
    
    private function writeMediaObjectProperty($property, $value) {
        // TODO: replace value of given property with given value
    }
    
    public function __destruct() {
        unset($this->domDocument);
    }
}


?>