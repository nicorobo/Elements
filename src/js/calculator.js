

function toggleCalculator(){
        if(modes['calc']) {
            changeMode('trad');
            $('.status').css('background-color', 'transparent')
                        .css('border-top', 'none');
        }
        else {
            changeMode('calc');
            $('.status').css('background-color', typeColors['other-nonmetal'].alpha(0.6).css())
                        .css('border-top', '1px solid black');

        }
}

function calcHoverColor(self, color){
        self.css('background-color', color);
}

function calcUnhoverColor(self, color, elementID){
        grayElements(elementID);
}