$(document).ready(function() {

    var file = 'buildinfo.json';
    
    $.getJSON(file, function(data) {
        $.each(data.builds[0].deploy, function(key, val) {
            $(".deploy-build-information").append(
                "<p>" + 
                this.date + 
                "</p>"
                );
        });
        $.each(data.builds[1].prd, function(key, val) {
            $(".prd-build-information").append(
                "<p>" + 
                this.date + 
                "</p>"
                );
        });
    })
    .fail(function(){
        console.log("error while reading build info file");    
    });
});
