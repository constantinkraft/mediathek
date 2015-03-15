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
    
    private $editor;
    private $request_type;
    
    public function __construct($editor) {
        // TODO: decide on GET or POST    
        $this->request_type = 'POST';
        $this->request = $this->request_type == 'GET' ? $_GET : $_POST;
        $this->editor = $editor;
        // TODO: do API init stuff
        
        // TODO: authentication
        
        $this->handleCall();
    }
    
    private function delete($title) {
        // TODO: delete element matching title
    }
    
    private function edit($filename) {
        // TODO: edit element matching $filename
        // TODO: decouple view templates from internal logic -> field names
        // TODO: data as argument, keyword-handling: test val for array -> call
        //      recursively
        // get <media-object> element
        //$this->logToFile(var_dump($request));
        $request = $this->request;
        $el = $this->editor->getMediaObjectByFilename($filename);
        foreach ($request['data'] as $key => $value) {
            // TODO: handle keywords
            $this->logToFile("key: ". $key . " val: " . $value);
            if($key != "keyword") {
                $this->editor->writeMediaObjectProperty($el, $key, $value);
            } else {
                foreach($val as $kw) {
                    $this->logToFile("Keyword key: ". $val . " val: " . $kw);
                    $this->editor->writeMediaObjectProperty($el, $val, $kw);   
                }
            }
        }
        $this->editor->save();
    }
    
    private function save() {
        $this->editor->save();
    }
    
    private function giveJSONResponse($data) {
        // give apropriate JSON response
        
        header("Content-Type: application/json");
        echo json_encode($data);
    }
    
    private function handleCall() {
        // TODO: vielleicht $request_type als Parameter?
        //$this->request
        $err = FALSE;
        // route call to method
        $this->logToFile($this->request['action']);
        switch($this->request['action']) {
            // Edit form submitted
            case "edit":
                // TODO: improve error handling
                try {
                    $this->logToFile("case: edit");
                    $this->edit($this->request['filename']);
                    //$this->save();
                } catch (Exception $e) {
                    $err  = "Something went wrong: ";
                    $err .= $e.getMessage();
                }
                break;
        }
        // TODO: set error var in response in case of exception / error
        // send JSON response
        if($err !== FALSE) {
            $this->request['error_msg'] = $err;
        }
        $this->giveJSONResponse($this->request);
    }
    
    private function logToFile($msg)
    {
        $filename = "../data/log.log";
        // open file
        $fd = fopen($filename, "a");
        // write string
        fwrite($fd, $msg . "\n");
        // close file
        fclose($fd);
    }
}

/**
 * Class for manipulating XML data
 *
 * TODO: implement validation routines
 */
class XMLEditor {
    
    private $xmlPath;
    private $domDocument;
        
    public function __construct($xmlPath) {
        $doc = new DOMDocument();
        $doc->load($xmlPath);
        
        // gültig und wohlgeformt?
        if($doc->schemaValidate("../data/sample.xsd")) {
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
     * @return DOMElement DOMElement for *first* matching node; otherwise empty
     */
    public function getMediaObjectByFilename($filename) {
        // TODO: make method private again
        $query = "//collection/media-object/filename[text() = '$filename']/..";
        $xpath = new DOMXPath($this->domDocument);
        $result = $xpath->query($query);
        return $result->item(0);
    }
    
    public function removeMediaObject($filename) {
        // TODO: remove media object by given filename
        // TODO: make method private again
        // get media-object element
        $el = $this->getMediaObjectByFilename($filename);
        if(count($el) > 0) {
            $this->domDocument->documentElement->removeChild($el);
        } else {
            throw new Exception("Element with filename " . $filename . " not found");
        }
    }
    
    private function insertMediaObject($data_array) {
        // TODO: insert media object
    }
    
    /**
     * Modify the value of media-object's property
     * 
     * @param DOMElement $media_object DOMElement to be modified
     * @param String $property name of the property to be modified
     * @param String $value value with which to replace original property value
     * @return object  Description              
     */
    public function writeMediaObjectProperty($media_object, $property, $value) {      
        $old_node = $media_object->getElementsByTagName($property)[0];
        if( count($old_node) > 0) {
            $new_node = $this->domDocument->createElement($property);
            $new_node->appendChild($this->domDocument->createTextNode($value));
            $media_object->replaceChild($new_node, $old_node);
        } else {
            throw new Exception("Property ".$property." doesn't exist!");
        }
        // TODO: save changes
        //$this->save();
    }
    
    /**
     * Write XML to disk
     * 
     * @return Boolean FALSE in case an error occurred
     */
    public function save() {
        return $this->domDocument->save($this->xmlPath);
    }
    
    public function __destruct() {
        unset($this->domDocument);
    }
}

//try {
//    $ed = new XMLEditor("../data/sample.xml");
//    echo "<p>Dokument validiert!<p>";
//    //$ed->removeMediaObject("IMAG0006.JPG");
//    $el = $ed->getMediaObjectByFilename("IMAG0006.JPG");
//    $ed->writeMediaObjectProperty($el, "description", "Ein Rotkehlchen im Garten meiner Eltern, geschossen vor über 5 Jahren…");
//    echo "<pre>";
//    print_r($ed->getMediaObjectByFilename('IMAG0006.JPG'));
//    echo "</pre>";
//    var_dump($ed->save());
//
//} catch (Exception $e) {
//    echo "bar!";
//    echo "Fehler: " . $e->getMessage();
//}

try {
    // handle API calls
    $ed = new XMLEditor("../data/sample.xml");
    $api = new BackendApi($ed);
    
} catch (Exceptio $e) {
    echo $e.getMessage();
}

?>