enum state {
    passive = 0,
    started = 1,
    running = 2
}
let scoreA: number = 0;
let scoreB: number = 0;
let gameState: number = state.passive;
let waitTime: number;
let miliConvert: number = 1000;

function preEval (a: boolean, b: boolean) {
    if(a && b) {
        basic.showIcon(IconNames.Sad)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerDown), music.PlaybackMode.InBackground)
        gameState = state.passive
    } else if (a) {
        control.runInBackground(() => music.playTone(600, 200))
        basic.showString("B")
        gameState = state.passive
    } else if (b) {
        control.runInBackground(() => music.playTone(600, 200))
        basic.showString("A")
        gameState = state.passive
    }
}
function eval (a: boolean, b: boolean) {
    if(a && b){
        basic.showIcon(IconNames.Square)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerDown), music.PlaybackMode.InBackground)
        gameState = state.passive
        basic.pause(1000)
        scoreA += 1
        scoreB += 1
    }else if(a){
        control.runInBackground(() => music.playTone(600, 200))
        basic.showString("A")
        scoreA += 1
        gameState = state.passive
    }else if(b){
        control.runInBackground(() => music.playTone(600, 200))
        basic.showString("B")
        scoreB += 1
        gameState = state.passive
    }else {
        basic.pause(30)
    }
    
}

function showHourglass ():void {
    basic.clearScreen()
    led.plot(0, 0)
    led.plot(1, 0)
    led.plot(2, 0)
    led.plot(3, 0)
    led.plot(4, 0)
    led.plot(1, 1)
    led.plot(2, 1)
    led.plot(3, 1)
    led.plot(2, 2)
    led.plot(1, 3)
    led.plot(2, 3)
    led.plot(3, 3)
    led.plot(0, 4)
    led.plot(1, 4)
    led.plot(2, 4)
    led.plot(3, 4)
    led.plot(4, 4)

}

input.onButtonPressed(Button.AB, function() {
    if(gameState === state.passive){
        gameState = state.started
        let pressedA = false;
        let pressedB = false;
        showHourglass()
        control.runInBackground(() => music.playTone(440, 200))
        waitTime = randint(3, 6) * miliConvert
        basic.pause(waitTime)
        pressedA = input.buttonIsPressed(Button.A)
        pressedB = input.buttonIsPressed(Button.B)
        preEval(pressedA, pressedB)
        if(gameState === state.passive){
            return;
        }
        gameState = state.running
        control.runInBackground(() => music.playTone(222, 200))  // 440 Hz, 200 ms
        basic.showIcon(IconNames.Pitchfork)
        while(gameState === state.running){
            pressedA = input.buttonIsPressed(Button.A)
            pressedB = input.buttonIsPressed(Button.B)
            eval(pressedA, pressedB)
        }
    }
})

input.onButtonPressed(Button.A, function() {
    if(gameState === state.passive){
        whaleysans.showNumber(scoreA)
    }
})

input.onButtonPressed(Button.B, function () {
    if (gameState === state.passive) {
        whaleysans.showNumber(scoreB)
    }
})

input.onLogoEvent(TouchButtonEvent.Pressed, function() {
    if(gameState === state.passive){
        scoreA = 0
        scoreB = 0
    }
})