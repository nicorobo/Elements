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
 ////////////  Event Handlers  //////////////
////////////////////////////////////////////


$('#candy-wrapper').on('mouseover', '.element', function(){
        var $self = $(this);
        var elementID = getID($self);
        var color = typeColors[theElements[elementID].type];
        if(tradMode){
            hoverColor($self, color);
            writeToBox(elementID);
        } else if(calcMode){
            calcHoverColor($self, color);
        }

    })
                       .on('mouseout', '.element', function(){
        var $self = $(this);
        var elementID = getID($self);
        var color = typeColors[theElements[elementID].type];
        if(tradMode){
            unhoverColor($self, color);
            clearBox();
        } else if(calcMode){
            calcUnhoverColor($self, color, elementID);
        }
    });


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
            $('#'+elementID[i]).css('background-color', grayscale(color).css());
        }
    }

    function grayscale(color, amount){
        if(!amount) var amount = 1;
        var color = color.rgba();
        // Luma Algorithm
        gray = color[0]*0.3+color[1]*0.59+color[2]*0.11;
        return chroma((color[0]*(1-amount))+gray*amount, (color[1]*(1-amount))+gray*amount, (color[2]*(1-amount))+gray*amount, color[3]);
    }
    
    function hoverColor(self, color){
        // self.css('background-color', color);
        $(self).find('.symbol').css('color', 'white');
        $('.status').css('background-color', color.alpha(0.6).css())
                    .css('border-top', '1px solid black');
        // $('body').css('background-color', color.alpha(0.8).css());
    }
    
    function unhoverColor(self, color){
        self.css('background-color', color.alpha(0.8).css());
        $(self).find('.symbol').css('color', '#3e3e3e');
        $('.status').css('background-color', 'white')
                    .css('border-top', 'none');
        // $('body').css('background-color', 'white');
    }

    //
    // Calculator Mode Styles
    //

    function calcHoverColor(self, color){
        self.css('background-color', color);
       $('.status').css('background-color', color.alpha(0.8).css());
        // $('body').css('background-color', color.alpha(0.8).css());
    }

    function calcUnhoverColor(self, color, elementID){
        grayElements(elementID);
       $('.status').css('background-color', 'white');
        // $('body').css('background-color', 'white');
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

    function writeToBox(elementID){
        dataDisplay(elementID, '#box-symbol', 'symbol', '', '');
        dataDisplay(elementID, '#box-name', 'name', '', '');
        dataDisplay(elementID, '#box-number', 'number', 'Number:', '');
        dataDisplay(elementID, '#box-mass', 'mass', 'Mass:', ' g/mol');
        dataDisplay(elementID, '#box-density', 'density', 'Density:', ' g/cm<sup>3</sup>');
        dataDisplay(elementID, '#box-electro', 'electronegativity', 'Electronegativity:', '');
        dataDisplay(elementID, '#box-melting', 'melting', 'Melting:', ' K');
        dataDisplay(elementID, '#box-boiling', 'boiling', 'Boiling:', ' K');
        dataDisplay(elementID, '#box-specific', 'specificheat', 'Specific:', ' J/g&#8226;K');
        dataDisplay(elementID, '#box-type', 'type', '', '');

    }

    function clearBox(){
        $('.box-data').each(function(){$(this).html('');});
    }

    function dataDisplay(elementID, selector, dataType, title, prefix){
        var data = theElements[elementID][dataType];
        if(data=='' || data== null) {
            data = '<span class="nodata">no data</span>'; 
            prefix = ''; }
        if(dataType == 'name') data = capitalize(data);
        if(dataType == 'mass') data = Math.round(data * 1000) / 1000;
        $(selector).html('<span class="data-title">'+title+'</span> '+data+prefix);
    }


   
  ////////////////////////////////////////////
 //////////  Dimension Functions  ///////////
////////////////////////////////////////////

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



    function forEachElement(aFunction, arguments){
        if(!arguments) var arguments = [];
        for(element in theElements){
            aFunction.apply(this, [element].concat(arguments));
        }
    }
    
    function getID(element){
        return $(element).attr('id');
    }

    function capitalize(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    
})();