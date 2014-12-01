(function(){

    
    for(ratioList in ratios){
        dynamicDimensions(ratioList, ratios[ratioList]);
    }

    $(window).on('resize', function(){
        for(ratioList in ratios){
            dynamicDimensions(ratioList, ratios[ratioList]); 
        } 
    });

    function dynamicDimensions(selector, properties){
        console.log($('#candy-wrapper').css('width'));
        var windowWidth = window.innerWidth;
        var theSelector = $(selector);
        for(property in properties){
            var style = property;
            var ratio = properties[property];
            newDimension = windowWidth*ratio
            theSelector.css(style, newDimension); 
        } 
    }
    
    
})();