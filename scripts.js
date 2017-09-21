var jsonData;
var maxResults;
var results_idb;
var arr_phylum = [];
var arr_order = [];
var arr_class = [];
var arr_family = [];
var arr_genus = [];
var arr_sciNames = [];

$(document).ready(function() {


});

function getData(url,query,destination) {
    var nextDestination = "#wizard_results"
    $( destination ).empty();
    
    
    $( nextDestination + "_kingdom" ).empty();
    $( nextDestination + "_phylum" ).empty();
    $( nextDestination + "_class" ).empty();
    $( nextDestination + "_order" ).empty();
    $( nextDestination + "_family" ).empty();
    $( nextDestination + "_genus" ).empty();
    $( nextDestination + "_sciNames" ).empty();

    $( ".loader" ).removeClass("hidden").addClass("shown");

    maxResults = $("#searchMaximum").find(":selected").val();
    var limitString = "&limit=" + maxResults;

    $.get( url+query+limitString, function( data ) {
        jsonData = data;
        results_idb = data.results.idigbio_resolved;
        // add HTML to JSON tab
        if( typeof(data.counts) == "undefined") {
            $( destination ).append("<p>No results.  Please try a new search.");
        } else {
            $( destination ).append("<h4>" + results_idb.length + " results (" + data.counts.totalCount + " total)</h4>");
            $( destination ).append(renderjson(data));
            $("a.disclosure").eq(0).trigger("click");
            // enable wizard tab
            makeWizard(nextDestination);
        }

        $( ".loader" ).removeClass("shown").addClass("hidden");

    });
}

function makeWizard(destination) {
    // $( destination ).empty();

    var objHtml = '<div class="col col-xs-2"><div class="panel panel-default"><div class="panel-body wizard-object"><p id="****" class="wizard-object-icon"></p><p class="wizard-object-text">%%%%</p></div></div></div>';

    // create plucked array of kingdom
    arr_kingdom = _.map(results_idb,function(idb){ return idb['dwc:kingdom']; });
    arr_kingdom = _.uniq(arr_kingdom);
    arr_kingdom = _.without(arr_kingdom,"",null,"null");

    // create plucked array of phylum
    arr_phylum = _.map(results_idb,function(idb){ return idb['dwc:phylum']; });
    arr_phylum = _.uniq(arr_phylum);
    arr_phylum = _.without(arr_phylum,"",null,"null");

    // create plucked array of class
    arr_class = _.map(results_idb,function(idb){ return idb['dwc:class']; });
    arr_class = _.uniq(arr_class);
    arr_class = _.without(arr_class,"",null,"null");

    // create plucked array of order
    arr_order = _.map(results_idb,function(idb){ return idb['dwc:order']; });
    arr_order = _.uniq(arr_order);
    arr_order = _.without(arr_order,"",null,"null");

    // create plucked array of family
    arr_family = _.map(results_idb,function(idb){ return idb['dwc:family']; });
    arr_family = _.uniq(arr_family);
    arr_family = _.without(arr_family,"",null,"null");

    // create plucked array of genus
    arr_genus = _.map(results_idb,function(idb){ return idb['dwc:genus']; });
    arr_genus = _.uniq(arr_genus);
    arr_genus = _.without(arr_genus,"",null,"null");
    
    // create plucked array of genus/species (sciName)
    arr_sciNames = _.map(results_idb,function(idb){ return idb['dwc:scientificName']; });
    arr_sciNames = _.uniq(arr_sciNames);
    arr_sciNames = _.without(arr_sciNames,"",null,"null");
    arr_sciNames = _.difference(arr_sciNames,arr_genus);


//==================================================================================

    // create HTML for kingdom
    $( destination + "_kingdom" ).append("<h3>Kingdom:</h3><br />");
    _.forEach(arr_kingdom,function(idb,idx){
        var idb_title = commonLookup(idb,"kingdom");
        newHtml = objHtml.replace("%%%%",idb_title);
        newHtml = newHtml.replace("****","item_kingdom_"+idx);
        $( destination + "_kingdom" ).append(newHtml);
        findIcon(idb,"item_kingdom_"+idx);
    });

    // create HTML for phylum
    $( destination + "_phylum" ).append("<h3>Phylum:</h3><br />");
    _.forEach(arr_phylum,function(idb,idx){
        var idb_title = commonLookup(idb,"phylum");
        newHtml = objHtml.replace("%%%%",idb_title);
        newHtml = newHtml.replace("****","item_phylum_"+idx);
        $( destination + "_phylum" ).append(newHtml);
        findIcon(idb,"item_phylum_"+idx);
    });

    // create HTML for Class
    $( destination + "_class" ).append("<h3>Class:</h3><br />");
    _.forEach(arr_class,function(idb, idx){
        newHtml = objHtml.replace("%%%%",idb);
        newHtml = newHtml.replace("****","item_class_"+idx);
        $( destination + "_class" ).append(newHtml);
        findIcon(idb,"item_class_"+idx);
    });

    // create HTML for Order
    $( destination + "_order" ).append("<h3>Order:</h3><br />");
    _.forEach(arr_order,function(idb, idx){
        newHtml = objHtml.replace("%%%%",idb);
        newHtml = newHtml.replace("****","item_order_"+idx);
        $( destination + "_order" ).append(newHtml);
        findIcon(idb,"item_order_"+idx);
    });

    // create HTML for Family
    $( destination + "_family" ).append("<h3>Family:</h3><br />");
    _.forEach(arr_family,function(idb, idx){
        newHtml = objHtml.replace("%%%%",idb);
        newHtml = newHtml.replace("****","item_family_"+idx);
        $( destination + "_family" ).append(newHtml);
        findIcon(idb,"item_family_"+idx);
    });

    // create HTML for genus
    $( destination + "_genus" ).append("<h3>Genus:</h3><br />");
    _.forEach(arr_genus,function(idb, idx){
        newHtml = objHtml.replace("%%%%",idb);
        newHtml = newHtml.replace("****","item_genus_"+idx);
        $( destination + "_genus" ).append(newHtml);
        findIcon(idb,"item_genus_"+idx);
    });

    // create HTML for genus/species (sciName)
    $( destination + "_sciNames" ).append("<h3>Genus/Species (Scientific name):</h3><br />");
    _.forEach(arr_sciNames,function(idb, idx){
        newHtml = objHtml.replace("%%%%",idb);
        newHtml = newHtml.replace("****","item_sciNames_"+idx);
        $( destination + "_sciNames" ).append(newHtml);
        findIcon(idb,"item_sciNames_"+idx);
    });

}

function commonLookup(term,rank) {
    
    var targetRecord = _.find(common_names[rank],function(o){ return o.scientific.toLowerCase() == term.toLowerCase() });
    
    if( typeof(targetRecord) == "undefined") {
        return term;
    } else {
        return "<strong>" + term + "</strong><br />" + _.result(targetRecord,"common");
    }
 
}

function findIcon(txt,container) {
    // console.log("appending text " + txt + " to " + container);
    $("#" + container).html("<img src='ajax-loader-sm.gif' />");

    var pbdb_url = "https://paleobiodb.org/data1.2/taxa/single.json?name=%%%%&show=img";
        txt = txt.split(".").join("");
        txt = txt.split(",").join("");
        txt = txt.split("-").join(" ");
        txt = txt.split("$").join("");
        txt = txt.split("?").join("");
        txt = txt.split("/").join(" ");
        txt = txt.split(":").join("");
        txt = txt.split("@").join(" ");
        txt = txt.split("&").join(" ");
        txt = txt.split("#").join(" ");
        txt = txt.split("+").join(" ");

        txt = encodeURI(txt);
        // txt = encodeURIComponent(txt);
        pbdb_url = pbdb_url.replace("%%%%",txt);

    var jqxhr = $.getJSON( pbdb_url, function(data) {
        // console.log( "success" );
        // SUCCESS!
        var dataNum = data.records[0].img.split(":")[1];
        var phyloPic = '<img src="https://paleobiodb.org/data1.2/taxa/thumb.png?id=' + dataNum + '" />';
        $("#"+container).hide();
        $("#"+container).html(phyloPic);
        $("#"+container).fadeIn();        
    })
    .done(function() {
        // console.log( "second success" );
        console.log("query successful: " + pbdb_url);
    })
    .fail(function() {
        $("#"+container).hide();        
        $("#"+container).html("<span class='glyphicon glyphicon-question-sign'></span>");
        $("#"+container).fadeIn();
    })
    // .always(function() {
    //     console.log("query performed: " + pbdb_url);
    // });
    
    // Perform other work here ...
    
    // Set another completion function for the request above
    // jqxhr.complete(function() {
    // console.log( "second complete" );
    // });
        
}



function submitForm() {
    getData("https://api.epandda.org/taxonomy?fullTaxonomy=",$("#searchText").val(),"#panelcontent1");
}

function alpha(inputtxt)  {
 inputtxt = inputtxt.toString()[0]; 
 var letterNumber = /^[a-zA-Z]+$/;  
 if(inputtxt.match(letterNumber)){  
   return true;  
  } else  {   
   return false;   
  }  
}  