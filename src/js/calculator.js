
var myMolecule = [];
var totalList = [];
var elementsList = [];

$('#candy-wrapper').on('mousedown','.element', handleClick);
$('#molecule-text').on('keyup change', handleType);
$('#molecule-clear').on('click', initiateCalculator)
                    .on('mouseover', clearHover)
                    .on('mouseout', clearUnhover);

                    
function toggleCalculator(){
        if(modes['calc']) {
            // changeMode('trad');
            // $('.status').css('background-color', 'transparent')
            //             .css('border-top', 'none');
            // clearBox();
        }
        else {
            changeMode('calc');
            $('.element').css('cursor', 'pointer');
            $('.status').css('background-color', typeColors['other-nonmetal'].alpha(0.6).css())
                        .css('border-top', '1px solid black');
            initiateCalculator();
        }
}


function handleClick(event){
    if(modes['calc']){
        var elementID = getID(this);
        var button = event.which;
        modifyMolecule(elementID, button);
        displayMolecule();  
    }
}

function handleType(){
    var content = $('#molecule-text').val();
    if(!hasUnpairedParentheses(content)){
        myMolecule = readMolecule(content);
        displayMolecule();
    }
}

function displayMolecule(dontChangeText){
    var mass = moleculeMass(myMolecule);
    if(isNaN(mass)) incorrectInput(mass);
    else correctInput(mass, dontChangeText);
}

function incorrectInput(mass){
    myMolecule=[];
    $('#molecule-formula').html('');
    $('#molecule-mass').html('');
    $('#molecule-name').html('');
    $('#mass-percent').html('mass percentages');
    elementsList = [];
    var content = $('#molecule-text').val();
    var match = findMatch(properLowerCase(content));
    if(match.length<1 && content.length<4) $('#molecule-error').html(mass+' is not an element');
    else if(match.length<1 && content.length>=4)$('#molecule-error').html(content+' is not a compound');
    else {
        myMolecule = $.extend(true, [], match[1]);
        displayMolecule(true);
    }
    match = [];
}

function correctInput(mass, dontChangeText){
    // if(!dontChangeText) mass = moleculeMass(myMolecule);
    $('#molecule-error').html('');
    $('#molecule-mass').html(mass.toFixed(4));
    elementsTotal = getElementsTotal(myMolecule,1);
    elementsList = getElementsList(elementsTotal);
    colorElements();
    colorfulElements(elementsList);
    $('#molecule-formula').html(htmlifyMolecule(myMolecule));
    if(!dontChangeText) $('#molecule-text').val(uglifyMolecule(myMolecule));
    if(myMolecule.length<1) $('#mass-percent').html('mass percentages');
    else $('#mass-percent').html(getPercents(elementsTotal, mass));
    var matches = findMatch(elementsTotal);
    if(matches.length > 0) $('#molecule-name').html(matches[0]);
    else $('#molecule-name').html('');
}

function calcHoverColor(self, color){
        self.css('background-color', color.alpha(0.8).css());
}

function calcUnhoverColor(self, color, elementID){
        if(elementsList.indexOf(elementID)==-1) grayElements(elementID);
}

function clearHover(){
    $('#molecule-clear').css('color', 'white');
}
function clearUnhover(){
    $('#molecule-clear').css('color', '');
}

function initiateCalculator(){
    myMolecule = [];
    displayMolecule();
    $('#molecule-text').val('');
    $('#molecule-clear').html('clear');
    $('#mass-percent').html('mass percentages');
}

function getElementsList(totals){
    var list = [];
        for(var i=0; i<totals.length; i++){
            list.push(totals[i][0]);
        }
        return list;
}

function getElementsTotal(molecule, ratio){
        var total = [];
        var index = -1;
        for(var i=0; i<molecule.length; i++){
            var element = molecule[i];
            if(typeof element[0] == "object") total = total.concat(getElementsTotal(element[0], element[1]));
            else{
                for(var h=0; h< total.length; h+=1){
                    if(total[h][0]==element[0]){
                        index = h;
                    }
                }
                if(index!=-1){
                    var newQuantity = parseInt(total[index][1])+(parseInt(element[1])*ratio);
                    total[index][1] = newQuantity;
                }
                else{
                    total.push([element[0], element[1]*ratio]);
                }
            }
            index = -1;
        }
        return total;
    }

function modifyMolecule(elementID, button){
        var index = elementIndex(elementID);
        if(button == 1){
            if (index != -1){
                myMolecule[index][1]++;
                return true;
            } else{
                myMolecule.push([elementID, 1]);
            }
        } else if(button == 3){
            if (index != -1){
                myMolecule[index][1]--;
                if(myMolecule[index][1]<1){
                    myMolecule.splice(index, 1);
                }
                return true;
            } 
        }
    }

function elementIndex(symbol){
    for(var i=0; i<myMolecule.length; i++){
        if(myMolecule[i][0] == symbol) return i;
    }
    return -1;
}

function htmlifyMolecule(molecule){
        // We'll build the htmlified molecule through concatenation... is that how you spell it?
        var htmlMolecule = ''
        for(var i=0; i<molecule.length; i++){
            //If the symbol variable of this array is another array, we have a parentheses block.
            // Run htmlifyMolecule agin with just this array and place parentheses around it.
            if(typeof molecule[i][0] =="object") htmlMolecule+="("+htmlifyMolecule(molecule[i][0])+")";
            //Everything is good, display the symbol variable!
            else htmlMolecule += molecule[i][0]
            // If the quantity variable is 1, don't display anything. Otherwise add subscript.
            if(molecule[i][1] > 1) htmlMolecule +='<sub>'+molecule[i][1]+'</sub>';
        }
        return htmlMolecule;
    }

function uglifyMolecule(molecule){
        var uglyMolecule = ''
        for(var i=0; i<molecule.length; i++){
            if(typeof molecule[i][0] =="object") uglyMolecule+="("+uglifyMolecule(molecule[i][0])+")";
            else uglyMolecule += molecule[i][0];
            if(molecule[i].length === 3) uglyMolecule +=molecule[i][1];
            else if(molecule[i][1] > 1) uglyMolecule +=molecule[i][1];
        }
        return uglyMolecule;
    }

function moleculeMass(molecule){
        mass = 0;
        for(var i=0; i<molecule.length; i++){
            var mySymbol = molecule[i][0];
            if(typeof mySymbol == "object") mass+=moleculeMass(mySymbol)*molecule[i][1];
            else {
                var assoc = elementsAssoc("symbol", mySymbol, "mass");
                if(assoc == false) return mySymbol;
                else mass += parseFloat(assoc)*molecule[i][1];
            }
        }
        return mass;
    }

function getPercents(totals, mass){
    var percentList = '';
    for(var i=0; i<totals.length; i++){
        var partialMass = ((moleculeMass([totals[i]])/mass)*100);
        partialMass = Math.round(partialMass * 100) / 100;
        percentList+=totals[i][0]+'('+partialMass+'%) ';
    }
    return percentList;
}
// Takes a type of chemical formula from user and formats it in a way that my program can read it. Returns a molecule object.
function readMolecule(theString){
    var molecule = [];
    var index = -1;
    var firstNum = true;
    theString = theString.charAt(0).toUpperCase()+theString.slice(1); 
    theString = theString.replace("[", "(");
    theString = theString.replace("]", ")");
    for(var i=0; i<theString.length; i++){
        var current = theString.charAt(i);
        var isNumber = !isNaN(current);
        if(!isNumber){
            if(current == "("){
                var parenSpan =findParenSpan( theString.slice(i+1), 1);    
                if(parenSpan== 0) return true;
                var parenBlock = theString.slice(i+1, i+parenSpan-1);
                molecule.push([readMolecule(parenBlock), 1]);
                firstNum=true;
                index++;
                i+=parenSpan-1;
            }
            else if(current === current.toUpperCase()){
                molecule.push([current, 1]);
                firstNum=true;
                index++;
            } 
            else{
                if(molecule[index][1] == 1 && molecule[index].length != 3){
                    molecule[index][0]+=current;
                } 
                else{
                    molecule.push([current.toUpperCase(), 1]);
                    firstNum=true;                
                    index++;
                }

            }
        } else if(isNumber){
            if(firstNum && current === '1')molecule[index].push('deliberate');
            if(firstNum) molecule[index][1]=current;
            else molecule[index][1]+=current;
            firstNum=false;
        }
    }
    return molecule;
}

// Finds the length that a parentheses block spans.
function findParenSpan(theString, starting){
    var length = starting;
    var order = 1;
    for(var i=0; i< theString.length; i++){
        var current = theString.charAt(i);
        length++; 
        if(current == "(") order++;
        else if(current ==")") order--;
        if(order==0) return length;
    }
    return 0;
}

function findMatch(total){
    var searchName = false;
    if(typeof total == 'string') searchName = true;
    var matches = [];
    for(compound in theCompounds){
        if(searchName){
            if(theCompounds[compound].name == total) {
                matches.push(theCompounds[compound].name);
                matches.push(theCompounds[compound].chemicalArray);
            }
        } else{
            var compoundTotal = getElementsTotal(theCompounds[compound].chemicalArray, 1);
            compoundTotal =getElementsTotal(compoundTotal, 1);
            if(arraySame(total, compoundTotal)) matches.push(theCompounds[compound].name);
        }
    }
    return matches;
}

function arraySame(a, b){
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    a = a.sort();
    b = b.sort();
    for (var i = 0; i < a.length; i++) {
        for(var j = 0; j<a[i].length; j++){
            if (a[i][j] != b[i][j]) return false;
        }
        
    }
    return true;
}
