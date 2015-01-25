

  ////////////////////////////////////////////
 ///////  Initialization Functions  /////////
////////////////////////////////////////////

    changeMode('trad');
    
    for(ratioList in ratios){
        dynamicDimensions(ratioList, ratios[ratioList]);
    }

    colorElements();


  ////////////////////////////////////////////
 ////////////  Event Handlers  //////////////
////////////////////////////////////////////


$('#candy-wrapper')
                        .on('mouseover', '.element', function(){
        var $self = $(this);
        var elementID = getID($self);
        var color = typeColors[theElements[elementID].type];
        if(modes['trad']){
            hoverColor($self, color);
            writeToBox(elementID);
        } else if(modes['calc']){
            calcHoverColor($self, color);
        } else if(modes['scale']){
            $self.find('.symbol').css('color', 'white');
        }

    })
                        .on('mouseout', '.element', function(){
        var $self = $(this);
        var elementID = getID($self);
        var color = typeColors[theElements[elementID].type];
        if(modes['trad']){
            unhoverColor($self, color);
            clearBox();
        } else if(modes['calc']){
            calcUnhoverColor($self, color, elementID);
        } else if(modes['scale']){
            $self.find('.symbol').css('color', '#3e3e3e');
        }
    })
                        .on('click', '#calc-button', toggleCalculator)
                        .on('click', '#scale-button', toggleScale)
                        .on('click', '#trad-button', toggleTrad);


  ////////////////////////////////////////////
 ///////////  Styling Functions  ////////////
////////////////////////////////////////////

    function colorElements(){
        if(modes['trad']) forEachElement(colorfulElements);
        if(modes['calc']) forEachElement(grayElements);
        if(modes['scale']) forEachElement(colorfulElements);
    }

    function colorfulElements(elementID){
        if(typeof elementID == 'string') elementID = [elementID];
        for(var i=0; i<elementID.length; i++){
            color = typeColors[theElements[elementID[i]].type];
            $('#'+elementID[i]).css('background-color', color.alpha(0.8).css());
        }
    }

    function grayElements(elementID){
        if(typeof elementID == 'string') elementID = [elementID];
        for(var i=0; i<elementID.length; i++){
            color = typeColors[theElements[elementID[i]].type];
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
        self.find('.symbol').css('color', 'white');
        $('.status').css('background-color', color.alpha(0.6).css())
                    .css('border-top', '1px solid black');
    }
    
    function unhoverColor(self, color){
        self.css('background-color', color.alpha(0.8).css());
        self.find('.symbol').css('color', '#3e3e3e');
        $('.status').css('background-color', 'transparent')
                    .css('border-top', 'none');
    }


    
  ////////////////////////////////////////////
 ///////////  Content Functions  ////////////
////////////////////////////////////////////
    
    forEachElement(writeToTable, ['number', 'number', false]);
    forEachElement(writeToTable, ['symbol','symbol', false]);
    forEachElement(writeToTable, ['mass', 'mass', true]);

    function writeToTable(element, container, property, doRound){
        var value = theElements[element][property];
        if(value == '') value = '';
        // else if(property == 'mass') value = Math.round(value * 100) / 100;
        else if(property == 'density') value = Math.round(value * 10000) / 10000;
        else if(doRound) value = Math.round(value * 1000) / 1000;
        $('#'+element+'>.'+container).html(value);
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
        $('.mode').find('.box-data').html('');
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
            newDimension = windowWidth*ratio;
            if(style == 'line-height') newDimension+='px';
            theSelector.css(style, newDimension); 
        } 
    }
    

  ////////////////////////////////////////////
 ///////////  Utility Functions  ////////////
////////////////////////////////////////////

    function toggleTrad(){
            if(!modes['trad']) {
                changeMode('trad');
                $('.element').css('cursor', 'default');
                $('.status').css('background-color', 'transparent')
                            .css('border-top', 'none');
                            clearBox();
            }
    }

    function changeMode(newMode){
        for (mode in modes){
            if(mode==newMode){
                modes[mode] = true;
                $('#'+mode+'-mode').show();
                $('#'+mode+'-button').css('text-decoration', 'underline');
            } 
            else {
                modes[mode] = false;
                $('#'+mode+'-mode').hide();
                $('#'+mode+'-button').css('text-decoration', '');
            }
        }
        forEachElement(writeToTable, ['mass', 'mass', true]);
        colorElements();
    }

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

    // Disable context menu when right-clicking an element.
    $('.element').bind('contextmenu', function() {
        return false;
    });

    // Searches for asociating values, for example, what is the mass of an element with symbol "Ni"?
    function elementsAssoc(search, searchValue, target){
        for(element in theElements){
            if(theElements[element][search] == searchValue) return theElements[element][target];
        }
        return false;
    }

    function hasUnpairedParentheses(theString){
        var stack = 0;
        for(var i=0; i<theString.length; i++){
            var current = theString.charAt(i);
            if(current == "(") stack++;
            else if(current == ")") stack--;
        }
        if(stack==0) return false;
        else return true;
    }

    function properLowerCase(theString){
        theString = theString.toLowerCase();
        var newString = '';
        var inParentheses = false;
        for(var i=0; i<theString.length; i++){
            var current = theString.charAt(i);
            if(current == '(') inParentheses = true; 
            else if(current == ')') inParentheses = false;
            else if(current == 'i' && inParentheses) current='I';
            else if(current == 'v' && inParentheses) current='V';
            newString+=current;
        }
        return newString;
    }
    
