(function(){

  ////////////////////////////////////////////
 ///////  Initialization Functions  /////////
////////////////////////////////////////////

    var tradMode = true;
    var calcMode = false;
    
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
            $('#'+elementID[i]).css('background-color', color.alpha(0.8).css());
        }
    }

    function grayElements(elementID){
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
    
    $('#candy-wrapper').on('mouseover', '.element', function(){
        var self = this;
        if(tradMode){
            elementHover(self);
        } else if(calcMode){
            calcElementHover(self);
        }

    })
                       .on('mouseout', '.element', function(){
        var self = this;
        if(tradMode){
            elementUnhover(self);
        } else if(calcMode){
            calcElementUnhover(self);
        }
    });
    
    function elementHover(self){
        var elementID = getID(self);
        var color = typeColors[theElements[elementID].type]
        $(self).css('background-color', color);
        $('.status').css('background-color', color.alpha(0.5).css());
    }

    function calcElementHover(self){
        var elementID = getID(self);
        var color = typeColors[theElements[elementID].type];
        $(self).css('background-color', color);
        $('.status').css('background-color', color.alpha(0.5).css());
    }
    
    function elementUnhover(self){
        var elementID = getID(self);
        var color = typeColors[theElements[elementID].type]
        $(self).css('background-color', color.alpha(0.8).css());
        $('.status').css('background-color', 'white');
    }

    function calcElementUnhover(self){
        var elementID = getID(self);
        var color = typeColors[theElements[elementID].type];
        grayElements(elementID);
        $('.status').css('background-color', 'white');
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
 ///////////  Content Functions  ////////////
////////////////////////////////////////////
    
    forEachElement(writeToTable, ['number']);
    forEachElement(writeToTable, ['symbol']);
    forEachElement(writeToTable, ['mass']);

    function writeToTable(element, property){
        var value = theElements[element][property];
        if(property=='mass') value = Math.round(value * 100) / 100;
        $('#'+element+'>.'+property).html(value);
    }



  ////////////////////////////////////////////
 ///////////  Utility Functions  ////////////
////////////////////////////////////////////



    function forEachElement(aFunction, arguments){
        if(!arguments) var arguments = [];
        for(element in theElements){
            aFunction.apply(this, [element].concat(arguments));
        }
    }
    
    function getID(element){
        return $(element).attr('id');
    }
    
    
})();