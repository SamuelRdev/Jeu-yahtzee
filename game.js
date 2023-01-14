$(document).ready(function(){
    // GAME INITIALISATION + LAUNCHER TILL STEP 2
    // const header = $('header')
    // const headerButton = $('header h1')
    // const content = $('main')
    const body = $('body')
    // const textHeaderButton = $('header > div > h1').html()
    var imgDice = $('.render-view img')
    var imagesArray = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png','./img/5.png', './img/6.png']

    // body.addClass('step-1')
    // header.css('height', '100vh')
    // content.hide()
    // headerButton.click(function(){
    //     body.removeClass('step-1').addClass('step-2')
    //     header.animate({height:100}, 400)
    //     if(body.hasClass('step-2')){
    //         content.show()
    //     }
    // })

    // headerButton.hover(function(){
    //     $(this).toggleClass('launcher')
    //     if(body.hasClass('step-1')){
    //         if($(this).hasClass('launcher')){
    //             $(this).html('Jouer')
    //             $(this).css({
    //                 'cursor' : 'pointer',
    //             })
    //         }else{
    //             $(this).html(textHeaderButton)
    //         }
    //     }else{
    //         $('header h1').html(textHeaderButton).css({
    //             'cursor':'unset'
    //         })
    //     }
    // })

    //IN GAME FUNCTIONS  
    var numberThrow = 0;
    $('.button-start').click(function(){
        numberThrow+=1
        let numberOfDice = 6; 
        let diceValue = []
        if(numberThrow <= 2){
            for(let i = 0; i<numberOfDice - 1; i++){
                const diceThrowed = DiceThrow(1,6)
                const arrayKey = diceThrowed - 1
                const imageCollec = imagesArray[arrayKey]
                diceValue.push(diceThrowed)
                imgDice[i].src = imageCollec
                imgDice[i].parentNode.setAttribute('data-number', diceThrowed)
            }
            console.log(diceValue)
        }
        if(numberThrow === 1 && body.hasClass('step-2')){
            body.removeClass('step-2').addClass('step-3')
        }else if(numberThrow === 2 && body.hasClass('step-3')){
            body.removeClass('step-3').addClass('step-4')
        }else if(numberThrow === 3){
            $('.button-start').after('<span style="padding-left: 20px; color: red;">Vous n\'avez plus de lancés disponibles</span>')
        }

        if(numberThrow === 1){
            $(".dice").click(function(){
                $(this).toggleClass("selected-dice")
                console.log(numberThrow)
            })
        }else{
            console.log("NON")
            if($(".dice").hasClass("selected-dice")){
                $(".dice").removeClass("selected-dice")
            }
        }
    })


    function DiceThrow(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


})