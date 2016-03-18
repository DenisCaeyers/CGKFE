$(document).ready(function(){var i="buildinfo.json";$.getJSON(i,function(i){$.each(i.builds[0].deploy,function(i,n){$(".deploy-build-information").append("<p>"+this.date+"</p>")}),$.each(i.builds[1].prd,function(i,n){$(".prd-build-information").append("<p>"+this.date+"</p>")})}).fail(function(){console.log("error while reading build info file")})});
//# sourceMappingURL=init.js.map
