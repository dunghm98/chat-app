let userNameInput = document.querySelector('.username');
let passwordInput = document.querySelector('.password');
let showPasswordButton = document.querySelector('.password-button');
let face = document.querySelector('.face')

function hideEye(){
    document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.add('hide');
    });
}
function breath(){
    document.querySelector('.tongue').classList.add('breath');
}
function holdBreath(){
    document.querySelector('.tongue').classList.remove('breath');
}
function openEye(){
    document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.remove('hide');
        hand.classList.remove('peek');
        hand.classList.remove('hang');
    });
}
function rotateHead(faceDeg){
    face.style.setProperty('--rotate-head',`${-faceDeg}deg`);
}
function checkHand(length){
    if(length==0){
        document.querySelectorAll('.hand--left').forEach(hand => {
            hand.classList.remove('hang'); 
        });
    }
    if(length>=1 && length <15){
        document.querySelectorAll('.hand--left').forEach(hand => {
            hand.classList.add('hang'); 
        });
        document.querySelectorAll('.hand--right').forEach(hand => {
            hand.classList.remove('hang'); 
        });
    }
    else if(length>=15){
        document.querySelectorAll('.hand--right').forEach(hand => {
            hand.classList.add('hang'); 
        })
    }
}
function peek(){
    document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.remove('hide');
        hand.classList.remove('hang');
        hand.classList.add('peek');
        breath();
    });
}
function coverEyes(){
    document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.add('hide');
        hand.classList.remove('peek');
        hand.classList.remove('hang');
        holdBreath();
    });
}

passwordInput.addEventListener('focus', function(event){
    hideEye();
    holdBreath();
});

passwordInput.addEventListener('blur', function(event){
    openEye();
    breath();
});

userNameInput.addEventListener('focus', event => {
    openEye();
    let faceDeg =  Math.min(userNameInput.value.length - 16 , 19);
    rotateHead(faceDeg);
});

userNameInput.addEventListener('blur', event => {
    rotateHead(0);
    openEye();
});

userNameInput.addEventListener('input', event => {    
    let length = userNameInput.value.length;
    let faceDeg =  Math.min(length - 16 , 19);
    checkHand(length);
    rotateHead(faceDeg);
});

showPasswordButton.addEventListener('click', event => {
    if (passwordInput.type==='text'){
        showPasswordButton.innerHTML = 'Show';
        passwordInput.type = 'password';
        coverEyes();
    } else if (passwordInput.type==='password'){
        showPasswordButton.innerHTML = 'Hide';
        passwordInput.type = 'text';
        peek();
    }
});