$(document).ready(function(){
    $("#game-finished").hide()
    // GAME INITIALISATION + LAUNCHER TILL STEP 2
    const header = $('header')
    const headerButton = $('header h1')
    const content = $('main')
    const body = $('body')
    const textHeaderButton = $('header > div > h1').html()
    var imgDice = $('.render-view img')
    var imagesArray = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png','./img/5.png', './img/6.png']
    var numberThrow = 0
    var diceValue = []
    var finalDices = []
    var numberOfTurn = 1
    var totalOfValues = 13
    if($('.locked_score').length === 0){
        localStorage.clear()
    }

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
    $('.button-start').click(function(){
        numberThrow+=1
        var numberOfDice = 6
        var validatedValue = []
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
                if($('.selected-dice').length === 0){
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
            }
            $('*').removeClass('disp-score')
            var throwScore = checkPoints(finalDices)
            var structured =  throwScore.structured
            var simple =  throwScore.simple
            animateStructured(structured, throwScore, finalDices)
            animateSimple(simple, throwScore)
            if(!$('#chance').hasClass('locked-score')){
                $("#chance").addClass('disp-score')
                $("#chance").children().last().attr('data-value', throwScore.chance)
            }
            if($('.disp-score').length > 0){
                $('.disp-score').each(function(){
                    $(this).click(function(){
                        if($(this).hasClass('disp-score')){
                            if($('.locked-score').length<numberOfTurn || $('.locked-score').length + $('.wasted').length < numberOfTurn){
                                $(this).addClass('locked-score')
                                $(this).children().last().text($(this).children().last().attr('data-value'))
                            }
                        }
                    })
                })
            }else{
                $('tbody > tr').each(function(){
                    if(!$(this).hasClass('locked-score') && !$(this).hasClass('disp-score')){
                        if(!$(this).hasClass('wasted')){
                            $(this).click(function(){
                                if($('.locked-score').length + $('.wasted').length < numberOfTurn && numberThrow > 1){
                                    $(this).addClass('wasted')
                                    $(this).children().last().text("0")
                                }
                            })
                        }
                    }
                })
            }
            /*Réinitialise tout pour le tour suivant*/
            $('.button-continue').click(function(){
                var STPlayer = 0
                var scoreRight = 0
                if($('.locked-score').length == numberOfTurn || $('.wasted').length + $('.locked-score').length == numberOfTurn){
                    numberOfTurn++
                    numberThrow = 0
                    $('.only-once').remove()
                    $('*').removeClass('selected-dice')
                    body.removeClass('reroll-init')
                    $('*').removeClass('disp-score')
                    body.removeClass('step-3')
                    body.removeClass('step-4')
                    body.addClass('step-2')
                    $('.dice').each(function(){
                        $(this).removeAttr('data-number')
                    })
                    $('.score-left tbody tr.locked-score').each(function(){
                        STPlayer += parseInt($(this).children().last().attr('data-value'))
                    })
                    if($('.score-left tbody tr.locked-score').length === 6 || $('.score-left tbody tr.locked-score').length + $('.score-left tbody tr.wasted').length === 6){
                        if(STPlayer > 63){
                            STPlayer += 35
                            $(".score-left #prime").children().last().text('35').css('font-weight', 'bold')
                        }else{
                            $(".score-left #prime").children().last().text('0').css('font-weight', 'bold')
                        }
                        $(".score-left #total-left").children().last().text(STPlayer).css('font-weight', 'bold')
                    }
                    $(".score-left #ST").children().last().text(STPlayer).css('font-weight', 'bold')

                    $('.score-right tbody tr.locked-score').each(function(){
                        scoreRight += parseInt($(this).children().last().attr('data-value'))
                    })

                    $(".score-right #total-combinaisons").children().last().text(scoreRight).css('font-weight', 'bold')
                    $(".score-right #total-jeu").children().last().text(scoreRight + STPlayer).css('font-weight', 'bold')

                    if($('.locked-score').length + $('.wasted').length === 13){
                        $(".locked-score").each(function(){
                            var index = $(this).attr("data-index")
                            var value = $(this).children().last().attr('data-value')
                            validatedValue.push({key:index, value:value})
                        })
                        var totalJoueur = parseInt(scoreRight) + parseInt(STPlayer)
                        saveToLocalStorage(validatedValue, totalJoueur)
                        console.log(localStorage)
                        $("#game-finished #finished-text").text(`Vous avez marqué ${scoreRight + STPlayer} points en ${numberOfTurn} tours de jeu.`)
                        $("#game-finished").show()
                        $('.button-continue').after('<button class="restart-button" onClick="window.location.reload();">Rejouer</button>')
                    }
                }
            })
        }

        if(numberThrow === 1 && body.hasClass('step-2')){
            body.removeClass('step-2').addClass('step-3')
        }else if(numberThrow === 2 && body.hasClass('step-3')){
            body.removeClass('step-3').addClass('step-4')
        }else if(numberThrow === 3){
            if(!$(".only-once").length){
                $('.button-continue').after('<span style="padding-left: 20px; color: red;" class="only-once">Vous n\'avez plus de lancés disponibles</span>')
            }
        }
    })

    $('.dice').each(function(){
        $(this).click(function(){
            if(body.hasClass("step-3")){
                $(this).toggleClass("selected-dice")
                body.addClass('reroll-init')
            }else{
                if(!$(".only-once").length){
                    if(!body.hasClass("step-2")){
                        $('.button-continue').after('<span style="padding-left: 20px; color: red;" class="only-once">Vous n\'avez plus de lancés disponibles</span>')
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
        });
        finalValues = diceValue
        return finalValues
    }
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
        var counts = countOccurences(arr)
        var sorted = arr.slice()
        sorted = sorted.sort()
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
                structuredScores.push('carre')
            }
            scoreChance += counts[i] * i
        }
        for (var i = 0; i < sorted.length - 3; i++) {
            if (sorted[i] + 1 == sorted[i+1] && sorted[i+1] + 1 == sorted[i+2] && sorted[i+2] + 1 == sorted[i+3]) {
                structuredScores.push('petite suite')
                break;
            }
        }
        for (var i = 0; i < sorted.length - 4; i++) {
            if (sorted[i] + 1 == sorted[i+1] && sorted[i+1] + 1 == sorted[i+2] && sorted[i+2] + 1 == sorted[i+3] && sorted[i+3] + 1 == sorted[i+4]) {
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
    
    function animateStructured(arr, throwScore, finalDices){
        for(let i = 0; i<arr.length; i++){
            if(arr[i] === "brelan"){
                if(!$('#brelan').hasClass('locked-score')){
                    $('#brelan').addClass("disp-score")
                    $('#brelan').children().last().attr('data-value', throwScore.chance)
                }
            }
            if (arr[i] === "full"){
                if(!$('#full').hasClass('locked-score')){
                    $('#full').addClass("disp-score")
                    $('#full').children().last().attr('data-value', "25")
                }
            }
            if (arr[i] === "petite suite"){
                if(!$('#petite-suite').hasClass('locked-score')){
                    $('#petite-suite').addClass("disp-score")
                    $('#petite-suite').children().last().attr('data-value', '30')
                }
            }
            if (arr[i] === "grande suite"){
                if(!$('#grande-suite').hasClass('locked-score')){
                    $('#grande-suite').addClass("disp-score")
                    $('#grande-suite').children().last().attr('data-value', '40')
                }
            }
            if (arr[i] === "carre"){
                if(!$('#carre').hasClass('locked-score')){
                    $('#carre').addClass("disp-score")
                    var carre_value = []
                    var occurencesCounter = countOccurences(finalDices)
                    var yahtzeeSoustr = 0
                    for(let i=1; i<6; i++){
                        carre_value.push(throwScore.simple[0][i])
                        if(occurencesCounter[i] !== 0){
                            yahtzeeSoustr = i
                        }
                    }
                    carre_value.sort()
                    var returnedValue = carre_value[carre_value.length - 1]
                    if($.inArray("yahtzee", throwScore.structured)){
                        $('#carre').children().last().attr('data-value', returnedValue - yahtzeeSoustr)
                    }else{
                        $('#carre').children().last().attr('data-value', returnedValue)
                    }
                }
            }
            if (arr[i] === "yahtzee"){
                if(!$('#yahtzee').hasClass('locked-score')){
                    $('#yahtzee').addClass("disp-score")
                    $('#yahtzee').children().last().attr('data-value', '50')
                }
            }
        }
    }
    
    function animateSimple(arr, throwScore){
        for(let i = 0; i<arr.length; i++){
            if(arr[i][1] > 0){
                if(!$('#score-one').hasClass('locked-score')){
                    $('#score-one').addClass('disp-score')
                    $('#score-one').children().last().attr('data-value', throwScore.simple[0][1])
                }
            }else{
                $('#score-one').removeClass('disp-score')
            }
            if(arr[i][2] > 0){
                if(!$('#score-two').hasClass('locked-score')){
                    $('#score-two').addClass('disp-score')
                    $('#score-two').children().last().attr('data-value', throwScore.simple[0][2])
                }
            }else{
                $('#score-two').removeClass('disp-score')
            }
            if(arr[i][3] > 0){
                if(!$('#score-three').hasClass('locked-score')){
                    $('#score-three').addClass('disp-score')
                    $('#score-three').children().last().attr('data-value', throwScore.simple[0][3])
                }
            }else{
                $('#score-three').removeClass('disp-score')
            }
            if(arr[i][4] > 0){
                if(!$('#score-four').hasClass('locked-score')){
                    $('#score-four').addClass('disp-score')
                    $('#score-four').children().last().attr('data-value', throwScore.simple[0][4])
                }
            }else{
                $('#score-four').removeClass('disp-score')
            }
            if(arr[i][5] > 0){
                if(!$('#score-five').hasClass('locked-score')){
                    $('#score-five').addClass('disp-score')
                    $('#score-five').children().last().attr('data-value', throwScore.simple[0][5])
                }
            }else{
                $('#score-five').removeClass('disp-score')
            }
            if(arr[i][6] > 0){
                if(!$('#score-six').hasClass('locked-score')){
                    $('#score-six').addClass('disp-score')
                    $('#score-six').children().last().attr('data-value', throwScore.simple[0][6])
                }
            }else{
                $('#score-six').removeClass('disp-score')
            }
        }
    }

    $('#close-it').click(function(){
        $('#game-finished').hide()
    })

    $('.restart-button').click(function(){
        localStorage.clear()
    })

    function saveToLocalStorage(validValue, total) {
        var saverObject = {}
        $.each(validValue, function(index, item) {
            saverObject[item.key] = item.value;
        });
        saverObject["Total du joueur"] = total;
        localStorage.setItem("Score joueurs", JSON.stringify(saverObject));
    }
})
