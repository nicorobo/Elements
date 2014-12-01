(function(){

  ////////////////////////////////////////////
 ///////  Initialization Functions  /////////
////////////////////////////////////////////
    
    for(ratioList in ratios){
        dynamicDimensions(ratioList, ratios[ratioList]);
    }

    forEachElement(colorElements);


  ////////////////////////////////////////////
 ///////////  Styling Functions  ////////////
////////////////////////////////////////////



    function colorElements(elementID){
        if(typeof elementID == 'string') elementID = [elementID];
        for(var i=0; i<elementID.length; i++){
            color = typeColors[theElements[elementID].type];
            $('#'+elementID[i]).css('background-color', color.hex());
        }
    }

    var grayElements = function(elementID){
        if(typeof elementID == 'string') elementID = [elementID];
        for(var i=0; i<elementID.length; i++){
            color = typeColors[theElements[elementID].type];
            $('#'+elementID[i]).css('background-color', grayscale(color).hex());
        }
    }

    function grayscale(color, amount){
        if(!amount) var amount = 1;
        var color = color.rgba();
        // Normal Averaging Algorithm
        // gray = (color[0]+color[1]+color[2])/3;
        // Luma Algorithm
        gray = color[0]*0.3+color[1]*0.59+color[2]*0.11;
        return chroma((color[0]*(1-amount))+gray*amount, (color[1]*(1-amount))+gray*amount, (color[2]*(1-amount))+gray*amount, color[3]);
    }
    
    $('#candy-wrapper').on('mouseover', '.element', elementHover);
    $('#candy-wrapper').on('mouseout', '.element', elementUnhover);
    
    function elementHover(){
        $(this).css('background', 'lightblue');
    }
    function elementUnhover(){
        var elementID = getID(this);
        var color = typeColors[theElements[elementID].type]
        $(this).css('background', color);
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



  ////////////////////////////////////////////
 ///////////  Utility Functions  ////////////
////////////////////////////////////////////



    function forEachElement(aFunction){
        for(element in theElements){
            aFunction(element);
        }
    }
    
    function getID(element){
        return $(element).attr('id');
    }
    
    
})();