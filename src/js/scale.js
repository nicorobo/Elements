function toggleScale(){
    if(modes['scale']) {
        // changeMode('trad');
        // $('.status').css('background-color', 'transparent')
        //             .css('border-top', 'none');
        // clearBox();
    }
    else {
        changeMode('scale');
        $('.element').css('cursor', 'default');
        $('.status').css('background-color', typeColors['metalloid'].alpha(0.6).css())
                    .css('border-top', '1px solid black');
        initiateScale();
    }
}

function initiateScale(){
    $('#scale-title').html('Scales');
    $('#no-scale').html('no scale');
    $('#mass-scale').html('mass');
    $('#density-scale').html('density');
    $('#electro-scale').html('electronegativity');
    $('#melt-scale').html('melting point');
    $('#boil-scale').html('boiling point');
    $('#specific-scale').html('specific heat');
    setScale('noScale');
    $('#mass-scale').trigger('click');
}

$('.scale-data').on('click', function(){
    var scaleID = $(this).attr('id');
    if(scaleID == 'no-scale') setScale('noScale');
    if(scaleID == 'mass-scale') setScale('mass');
    if(scaleID == 'density-scale') setScale('density');
    if(scaleID == 'electro-scale') setScale('electronegativity');
    if(scaleID == 'melt-scale') setScale('melting');
    if(scaleID == 'boil-scale') setScale('boiling');
    if(scaleID == 'specific-scale') setScale('specificheat');
    $('.scale-data').css('color', '');
    $(this).css('color', 'white');
});

function setScale(property){
    colorCodeElements(property);
    if(property == 'noScale') {
        forEachElement(writeToTable, ['mass', 'mass', true]);
    }
    else {
        forEachElement(writeToTable, ['mass', property, true]);
    }
    setUnit(property);
}

function setUnit(property){
    var unitsString = ('* in ')
    if(property == 'noScale') $('#units').html('');
    if(property == 'mass') $('#units').html('* in g/mol');
    if(property == 'density') $('#units').html('* in g/cm<sup>3</sup>');
    if(property == 'electronegativity') $('#units').html('* Pauling Scale');
    if(property == 'melting') $('#units').html('* in Kelvin');
    if(property == 'boiling') $('#units').html('* in Kelvin');
    if(property == 'specificheat') $('#units').html('* in J/g&#8226;K');
}
function colorCodeElements(property){
    if(property == 'noScale') colorElements();
    else{
        var propertyStats = minMax(property);
        var scale = chroma.scale([typeColors['noble-gas'], typeColors['alkali-metal'], typeColors['metalloid']]);
        // var scale = chroma.scale(['#85f780','#f4ee64','#ff6060']);           
        // var scale = chroma.scale(['#000', '#ce60ff']);
        if (property == 'specificheat')scale.domain([propertyStats[0], propertyStats[1]], 118, 'log');
        else scale.domain([propertyStats[0], propertyStats[1]]);
        for(element in theElements){
            var value = parseFloat(theElements[element][property]);
            if(!isNaN(value)){
                $('#'+element).css('background-color', scale(value).alpha(0.8).css());
            } 
            else{
                $('#'+element).css('background-color', 'white');
            }
        }
    }
    return true;
}

function minMax(property){
    var min = 99999999999;
    var max = -99999999999;
    var sum = 0;
    var count = 0;
    for(element in theElements){
        var value = parseFloat(theElements[element][property]);
        if(!isNaN(value)){
            if(value>max) max = value;
            if(value<min) min = value;
            sum+= value;
            count++
        }
    }
    return [min, max, sum/count, sum];
}