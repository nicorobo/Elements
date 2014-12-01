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
        var windowWidth = window.innerWidth;
        var theSelector = $(selector);
        for(property in properties){
            var style = property;
            var ratio = properties[property];
            newDimension = windowWidth*ratio
            theSelector.css(style, newDimension); 
        } 
    }

    var findColor = function(elementID){
        var type = theElements[elementID].type;
        if(type=='alkali-metal') return alkaliColor;
        if(type=='alkaline-earth') return alkalineEarthColor;
        if(type=='transition-metal') return transitionColor;
        if(type=='post-transition-metal') return postTransitionColor;
        if(type=='metalloid') return metalloidColor;
        if(type=='other-nonmetal') return otherColor;
        if(type=='halogen') return halogenColor;
        if(type=='noble-gas') return nobleColor;
        if(type=='lanthanoid') return lanthanoidColor;
        if(type=='actinoid') return actinoidColor;
    }

    var colorElements = function(elementID){
        if(typeof elementID == 'string') elementID = [elementID];
        for(var i=0; i<elementID.length; i++){
            color = findColor(elementID[i]);
            $('#'+elementID[i]).css('background-color', color.hex());
        }
    }

    var grayscaleElements = function(elementID){
        if(typeof elementID == 'string') elementID = [elementID];
        for(var i=0; i<elementID.length; i++){
            color = findColor(elementID[i]);
            $('#'+elementID[i]).css('background-color', grayscale(color).hex());
        }
    }

    function grayscale(color){
        color = color.rgba();
        console.log(color);
        // Normal Averaging Algorithm
        // gray = (color[0]+color[1]+color[2])/3;
        // Luma Algorithm
        gray = color[0]*0.3+color[1]*0.59+color[2]*0.11;
        return chroma(gray, gray, gray, color[3]);
    }

    forEachElement(colorElements);

    function forEachElement(aFunction){
        for(element in theElements){
            aFunction(element);
        }
    }
    
    
})();