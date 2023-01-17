$(document).ready(function(){
    // GAME INITIALISATION + LAUNCHER TILL STEP 2
    const header = $('header')
    const headerButton = $('header h1')
    const content = $('main')
    const body = $('body')
    const textHeaderButton = $('header > div > h1').html()
    var imgDice = $('.render-view img')
    var imagesArray = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png','./img/5.png', './img/6.png']

    body.addClass('step-1')
    header.css('height', '100vh')
    content.hide()
    headerButton.click(function(){
        body.removeClass('step-1').addClass('step-2')
        header.animate({height:100}, 400)
        if(body.hasClass('step-2')){
            content.show()
        }
    })

    headerButton.hover(function(){
        $(this).toggleClass('launcher')
        if(body.hasClass('step-1')){
            if($(this).hasClass('launcher')){
                $(this).html('Cliquer pour jouer')
                $(this).css({
                    'cursor' : 'pointer',
                })
            }else{
                $(this).html(textHeaderButton)
            }
        }else{
            $('header h1').html(textHeaderButton).css({
                'cursor':'unset'
            })
        }
    })

    //IN GAME FUNCTIONS  
    var numberThrow = 0
    var diceValue = []
    var finalDices = []
    $('.button-start').click(function(){
        numberThrow+=1
        var numberOfDice = 6
        if(numberThrow <= 2){
            if(!body.hasClass("reroll-init")){
                diceValue = []
                for(let i = 0; i<numberOfDice - 1; i++){
                    const diceThrowed = diceThrow(1,6)
                    const arrayKey = diceThrowed - 1
                    const imageCollec = imagesArray[arrayKey]
                    diceValue.push(diceThrowed)
                    imgDice[i].src = imageCollec
                    imgDice[i].parentNode.setAttribute('data-number', diceThrowed)
                }
                finalDices = diceValue
            }else{
                finalDices = rerollDice()
                for(let i = 0; i<numberOfDice - 1; i++){
                    imgDice[i].src = `./img/${finalDices[i]}.png`
                    imgDice[i].parentNode.setAttribute('data-number', finalDices[i])
                }
            }
            finalDices = [1,2,3,4,5]
            var throwScore = checkPoints(finalDices)
            console.log(throwScore)
            var structured =  throwScore.structured
            var simple =  throwScore.simple
            animateStructured(structured)
            animateSimple(simple)
            $("#chance").addClass('disp-score')
        }

        if(numberThrow === 1 && body.hasClass('step-2')){
            body.removeClass('step-2').addClass('step-3')
        }else if(numberThrow === 2 && body.hasClass('step-3')){
            body.removeClass('step-3').addClass('step-4')
        }else if(numberThrow === 3){
            if(!$(".only-once").length){
                $('.button-start').after('<span style="padding-left: 20px; color: red;" class="only-once">Vous n\'avez plus de lancés disponibles</span>')
            }
        }
    })

    $('.dice').each(function(){
        $(this).click(function(){
            if(body.hasClass("step-3")){
                $(this).toggleClass("selected-dice")
                if($(this).hasClass("selected-dice")){
                    body.addClass('reroll-init')
                }else{
                    body.removeClass('reroll-init')
                }
            }else{
                if(!$(".only-once").length){
                    if(!body.hasClass("step-2")){
                        $('.button-start').after('<span style="padding-left: 20px; color: red;" class="only-once">Vous n\'avez plus de lancés disponibles</span>')
                    }
                }
            }
        })
    })


    function diceThrow(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function rerollDice() {
        var selectedDice = $(".selected-dice");
        var finalValues = []
        selectedDice.each(function() {
            var dicePosition = parseInt($(this).attr('id') - 1)
            var diceNewValue = diceThrow(1,6)   
            diceValue.splice(dicePosition, 1, diceNewValue);
            // console.log('position :' + dicePosition + ' devient ' + diceNewValue)
        });
        finalValues = diceValue
        return finalValues
    }
})

function countOccurences(arr) {
    var counts = {};
    for (var i = 1; i <= 6; i++) {
        counts[i] = 0;
    }
    for (var i = 0; i < arr.length; i++) {
        counts[arr[i]]++;
    }
    return counts;
}

function checkPoints(arr) {
    var counts = countOccurences(arr);
    var userScores = []
    var scoreSimples = []
    var structuredScores = []
    var scoreChance = 0
    for (var i = 1; i <= 6; i++) {
        if (counts[i] == 2) {
            for (var j = 1; j <= 6; j++) {
                if (i !== j && counts[j] == 3) {
                    structuredScores.push('full')
                }
            }
        }else if (counts[i] === 3) {
            structuredScores.push('brelan')
        }else if(counts[i] === 4){
            structuredScores.push('carre')
        }else if(counts[i] === 5){
            structuredScores.push('yahtzee')
        }
        scoreChance += counts[i] * i
    }
    for (var i = 0; i < arr.length - 3; i++) {
        if (arr[i] + 1 == arr[i+1] && arr[i+1] + 1 == arr[i+2] && arr[i+2] + 1 == arr[i+3]) {
            structuredScores.push('petite suite')
            break;
        }
    }
    for (var i = 0; i < arr.length - 4; i++) {
        if (arr[i] + 1 == arr[i+1] && arr[i+1] + 1 == arr[i+2] && arr[i+2] + 1 == arr[i+3] && arr[i+3] + 1 == arr[i+4]) {
            structuredScores.push('grande suite')
            break;
        }
    }
    scoreSimples.push(calculatePoints(arr))
    userScores["structured"] = structuredScores
    userScores["simple"] = scoreSimples
    userScores["chance"] = scoreChance
    return userScores
}

function calculatePoints(arr) {
    var counts = countOccurences(arr);
    var points = {};
    for (var i = 1; i <= 6; i++) {
        points[i] = i * counts[i];
    }
    return points;
}

function animateStructured(arr){
    for(let i = 0; i<arr.length; i++){
        if(arr[i] === "brelan"){
            $('#brelan').addClass("disp-score")
        }else{
            $('#brelan').removeClass("disp-score")
        }
        if (arr[i] === "full"){
            $('#full').addClass("disp-score")
        }else{
            $('#full').removeClass("disp-score")
        }
        if (arr[i] === "petite suite" || (arr[i] === "petite suite" && arr[i] === "grande suite")){
            $('#petite-suite').addClass("disp-score")
        }else{
            $('#petite-suite').removeClass("disp-score")
        }
        if (arr[i] === "grande suite"){
            $('#grande-suite').addClass("disp-score")
        }else{
            $('#grande-suite').removeClass("disp-score")
        }
        if (arr[i] === "carre"){
            $('#carre').addClass("disp-score")
        }else{
            $('#carre').removeClass("disp-score")
        }
        if (arr[i] === "yahtzee"){
            $('#yahtzee').addClass("disp-score")
        }else{
            $('#yahtzee').removeClass("disp-score")
        }
    }
}

function animateSimple(arr){
    for(let i = 0; i<arr.length; i++){
        console.log(arr[i])
        if(arr[i][1] > 0){
            $('#score-one').addClass('disp-score')
        }else{
            $('#score-one').removeClass('disp-score')
        }
        if(arr[i][2] > 0){
            $('#score-two').addClass('disp-score')
        }else{
            $('#score-two').removeClass('disp-score')
        }
        if(arr[i][3] > 0){
            $('#score-three').addClass('disp-score')
        }else{
            $('#score-three').removeClass('disp-score')
        }
        if(arr[i][4] > 0){
            $('#score-four').addClass('disp-score')
        }else{
            $('#score-four').removeClass('disp-score')
        }
        if(arr[i][5] > 0){
            $('#score-five').addClass('disp-score')
        }else{
            $('#score-five').removeClass('disp-score')
        }
        if(arr[i][6] > 0){
            $('#score-six').addClass('disp-score')
        }else{
            $('#score-six').removeClass('disp-score')
        }
    }
}