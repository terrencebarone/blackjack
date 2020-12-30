//bet component
const betComponent=document.getElementById('bet-container');
//game (hit or stay) component
const gameControls=document.getElementById('game-container');
//play again component
const anotherRound=document.getElementById('another-round');
//header result message
let resultMessage=document.getElementById("result-message");
//holds user and comp physical cards
const userCards= document.getElementById('user-cards');
const compCards=document.getElementById('comp-cards');
//user and computer bank used to change visual 
const userBank=document.getElementById("user-money");
const compBank=document.getElementById("comp-money");
//bet amount
let betAmount;


document.getElementById("set-bet").addEventListener('click' ,()=>{
     //user and computer money used to change value
    let userMoney=userBank.getAttribute("value");
    let compMoney=compBank.getAttribute("value");
    //gets how much bet is made for
     betAmount=Number(document.getElementById("bet-amount").value);
        
     //determines if both user and computer have enough money for the bet
     if(userMoney<betAmount){
         document.getElementById('bet-message').innerHTML=
             "You Do Not Have Enough Money For That Bet";
     }
     else if(compMoney<betAmount){
         document.getElementById('bet-message').innerHTML=
             "Computer Does Not Have Enough Money For That Bet";
     }
     //both user and computer have enough money for bet
     else{
         //sets new bank for user and comp
         userBank.innerText=userMoney-betAmount;
         userBank.setAttribute("value",userMoney-betAmount);
         compBank.innerText=compMoney-betAmount;
         compBank.setAttribute("value",compMoney-betAmount);
         //remove bet-container and displays game-container
         betComponent.style.display="none";
         gameControls.style.display="flex";
         startBlackJack(deckID);
     }
});

let deckID;
async function getDeck(){
    fetch("https://deckofcardsapi.com/api/deck/new/")
    .then(response=>response.json())
    .then(data=> {
         deckID=data.deck_id;
         shuffleDeck(deckID);
    });
     
}
 getDeck();

 function shuffleDeck(deckID){
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
    .then(response=>response.json())
    .then(data=>console.log("Deck Shuffled"));
}

//string that is used to show computer physical cards
let compHand;
//array that hold all cards value for comp
let compHandArray=[];
//count for the computer hand count
let compHandCount=0;
//count for the shown number for comp
let compHandShown=0;
//count for how many aces comp has
let compAces=0;
//variable that hold the comps first card image
let compFirstCardImage;
//string that is used to show user physical cards
let userHand;
//array that hold all cards value for user
let userHandArray=[];
//variable that hold the users first card image
let userFirstCardImage;
//count for the shown number for user
let userHandShown=0;
//count for the users total count
let userHandCount=0;
//count for how many aces user has
let userAces=0;
//checks if first card is ace so we can update visible count correctly
//considering first card is face down and user has no clue 
let firstCardAce=false;
//variable that holds how many cards in the deck
let deckCount;
//array that hold the cards for the current round after shuffling
let cardArray=[];
function checkUserAce(card){
    if(card===11){
        userAces++;
    }
}
function checkCompAce(card){
    if(card===11){
        compAces++;
    }
}
//function that is used to start a round of black jack
//will be triggered when bet is set and submitted
function startBlackJack(deckID){
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`)
    .then(response=>response.json())
    .then(data=>{
       //puts remaining cards in array so we do not have to keep calling
       //API to pull one cards
       let j=0
       for(let i =0; i<data.cards.length*2;i+=2){
           if(data.cards[j].value==="ACE"){
               cardArray[i]=11;
               cardArray[i+1]=data.cards[j].image;
               j++;
           }
           else if( data.cards[j].value==='JACK' || data.cards[j].value==='QUEEN' || data.cards[j].value==='KING'){
               cardArray[i]=10;
               cardArray[i+1]=data.cards[j].image;
               j++;
           }
           else{
               cardArray[i]=Number(data.cards[j].value);
               cardArray[i+1]=data.cards[j].image;
               j++;
           }
           
       }
       //update userHandCount and userFirstImage
       userHandCount=cardArray.shift();
       if(userHandCount===11){
         firstCardAce=true;
         userAces++;
       }
       userHandArray.push(userHandCount);
       userFirstCardImage=cardArray.shift();
       //update compHandCount and compFirstImage
       compHandCount=cardArray.shift();
       checkCompAce(compHandCount);
       compHandArray.push(userHandCount);
       compFirstCardImage=cardArray.shift();
       //update user and comp handShown & second image & handCount
       userHandArray.push(cardArray.shift());
       userHandShown=userHandArray[1];
       checkUserAce(userHandShown);
       userHandCount+=userHandShown;
       let userSecondCardImage=cardArray.shift();

       compHandArray.push(cardArray.shift());
       compHandShown=compHandArray[1];
       checkCompAce(compHandShown);
       compHandCount+=compHandShown;
       let compSecondCardImage=cardArray.shift();
       //update userHand to show user cards they have
       userHand=`<img src="images/cardBack.jpg">
        <img  src=${userSecondCardImage}>
       `;
       userCards.innerHTML=userHand;
       //update compHand to show user comp cards
       compHand=`<img src="images/cardBack.jpg">
       <img  src=${compSecondCardImage}>
      `;
       compCards.innerHTML=compHand;
       //update user and comp handShown on HTML
       document.getElementById('user-count-num').innerText=`${userHandShown}`;
       document.getElementById('comp-count-num').innerText=`${compHandShown}`;
    });
}

//Adds event to hit button
document.getElementById("hit").addEventListener('click',()=>{
        //get card value and image for the hit
        let cardValue=cardArray.shift();
        let cardImage=cardArray.shift()
        //update userHand
        userHand+=`
        <img  src=${cardImage}>
       `;
        userCards.innerHTML=userHand;
        //gets card value and updates userHand Count&Shown
        userHandShown+=cardValue;
        userHandCount+=cardValue;
        //checks if card is an ace
        checkUserAce(cardValue);
        //adds element to userHandArray
        userHandArray.push(cardValue);
        //update user hand shown
        updateHandShown(userHandShown);
});

//Adds event to the bet again button
//1. will reset users handShown,Count,userAces, and firstCard Boolean
//2. will reset computerHandCount,compAces
//3. shuffles deck
//4. hides play again and shows bet console
document.getElementById('play-again').addEventListener('click',()=>{
    //1
    userHandShown=0;
    userHandCount=0;
    userAces=0;
    firstCardAce=false;
    userHandArray=[];
    //2
    compHandCount=0;
    compHandShown=0;
    compAces=0;
    compHandArray=[];
    //3
    shuffleDeck(deckID);
    //4
    anotherRound.style.display='none';
    betComponent.style.display="block";
});

//Adds event to the stay button
//1.shows first card and updates count
document.getElementById("stay").addEventListener("click", async ()=>{
    if(userHandCount>21){
        userAces=0;
        for(let i =0; i < userHandArray.length;i++){
            if(userHandArray[i]===11){
                userAces++;
            }
        }
        while(userAces>0 && userHandCount>21){
            userHandCount-=10;
            userAces--;
        }
        //user still busts after checking aces and now will do the following:
        //1.tell use they bust
        //2.remove game console and show play another round console
        //3.add money to comp bank
        //4.shows user and comps face of their down card
        //5.update count for both user and comp
        if(userHandCount>21){
         //1.
         document.getElementById('user-count-num').innerText="BUST!";
         //2.
         anotherRound.style.display="flex";
         gameControls.style.display="none";
         //3.
         updateCompBank();
         //4.
         userCards.firstChild.setAttribute("src",userFirstCardImage);
         compCards.firstChild.setAttribute("src",compFirstCardImage);
         document.getElementById('comp-count-num').innerText=`${compHandCount}`;
         resultMessage.innerText=`You Lost!`;
        }
        //runs when user does not bust after removing aces
        else{
            compHit();
        }
    }
    //runs when user does not bust
    else{
        compHit();
    }
    
});



//function to update hand shown
function updateHandShown(userHandShown){
    //runs when user busts 
    if(userHandShown>=21){
        //checks to see if user has aces
        while(userAces>1 && firstCardAce===true && userHandShown>21 || userAces>0 && firstCardAce===false && userHandShown>21){
            userHandShown=userHandShown-10;
            userAces--;
        }
        //user still busts after checking aces and now will do the following:
        //1.tell use they bust
        //2.remove game console and show play another round console
        //3.add money to comp bank
        //4.shows user and comps face of their down card
        if(userHandShown>=21){
         //1.
         document.getElementById('user-count-num').innerText="BUST!";
         //2.
         anotherRound.style.display="flex";
         gameControls.style.display="none";
         //3.
         let compMoney=compBank.getAttribute("value");
         compBank.innerText=(Number(compMoney)+(betAmount*2));
         compBank.setAttribute("value",(Number(compMoney)+(betAmount*2)));
         //4.
         userCards.firstChild.setAttribute("src",userFirstCardImage);
         compCards.firstChild.setAttribute("src",compFirstCardImage);

        }
        else{
            document.getElementById('user-count-num').innerText=`${userHandShown}`;
        }
    }
    //runs when user does not bust
    else{
        document.getElementById('user-count-num').innerText=`${userHandShown}`;
    }
   
}

//computer won and updates bank
function updateCompBank(){
    let compMoney=compBank.getAttribute("value");
    compBank.innerText=(Number(compMoney)+(betAmount*2));
    compBank.setAttribute("value",(Number(compMoney)+(betAmount*2)));
}
//user won and updates bank
function updateUserBank(){
    let userMoney=userBank.getAttribute("value");
    userBank.innerText=(Number(userMoney)+(betAmount*2));
    userBank.setAttribute("value",(Number(userMoney)+(betAmount*2)));
}

//tie and both user and comp get money back
function tieUpdateBank(){
    //user
    let userMoney=userBank.getAttribute("value");
    userBank.innerText=(Number(userMoney)+(betAmount));
    userBank.setAttribute("value",(Number(userMoney)+(betAmount)));
    //comp
    let compMoney=compBank.getAttribute("value");
    compBank.innerText=(Number(compMoney)+(betAmount));
    compBank.setAttribute("value",(Number(compMoney)+(betAmount)));
}

function compHit(){
    while(compHandCount<17 ){
        let cardValue=cardArray.shift();
        let cardImage=cardArray.shift();
        compHandArray.push(cardValue);
        checkCompAce(cardValue);
        compHand+=`
        <img  src=${cardImage}>
       `;
       compCards.innerHTML=compHand;
       compHandCount+=cardValue;
       while(compHandCount>21 && compAces>0){
            compHandCount-=10;
            compAces--;
       }
    }
    //comp wins
    if(compHandCount<=21 && compHandCount>userHandCount){
        //1.
        resultMessage.innerText="You Lost!";
        //2.
        anotherRound.style.display="flex";
        gameControls.style.display="none";
        //3.
        updateCompBank();
        //4.
        userCards.firstChild.setAttribute("src",userFirstCardImage);
        compCards.firstChild.setAttribute("src",compFirstCardImage);
        document.getElementById('comp-count-num').innerText=`${compHandCount}`;
        document.getElementById('user-count-num').innerText=`${userHandCount}`;
    }
    //tie
    else if(compHandCount===userHandCount){
        resultMessage.innerText="Tie!";
        anotherRound.style.display="flex";
        gameControls.style.display="none";
        tieUpdateBank();
        userCards.firstChild.setAttribute("src",userFirstCardImage);
        compCards.firstChild.setAttribute("src",compFirstCardImage);
        document.getElementById('comp-count-num').innerText=`${compHandCount}`;
        document.getElementById('user-count-num').innerText=`${userHandCount}`;
    }
    //user wins
    else{
        resultMessage.innerText="You win!";
        anotherRound.style.display="flex";
        gameControls.style.display="none";
        updateUserBank();
        userCards.firstChild.setAttribute("src",userFirstCardImage);
        compCards.firstChild.setAttribute("src",compFirstCardImage);
        document.getElementById('comp-count-num').innerText=`${compHandCount}`;
        document.getElementById('user-count-num').innerText=`${userHandCount}`;
    }
}


