'use strict';

var tinderContainer = document.querySelector('.tinder');
var cardDeck = document.querySelector('.tinder--cards');
var allCards = Array.from(document.querySelectorAll('.tinder--card'));
var back = document.getElementById('back');
var next = document.getElementById('next');
var counter = document.getElementById('counter');

var count = 0;

class cardHistory {
  constructor(allCards) {
    this.data = [allCards];
    this.index = 0;

    this.recall = function() {
      var value = this.data[this.index].slice();
      if(this.index > 0) this.index--;
      if(this.index == 0) back.disabled = true;
      return value;
    }

    this.update = function(deck) {
      this.index++;
      back.disabled = false;
      this.data.splice(this.index, this.data.length - this.index);
      this.data.push(deck);
    }
  }
}

function initCards() {
  for(var i = 0; i < allCards.length - 1; i++){
    var card = allCards[i];
    setCard(card, i);
  }
  setTimeout(function(){
    var index = allCards.length - 1;
    setCard(allCards[index], index);
  }, 10)
}

function nextCard() {
  var moveOutWidth = document.body.clientWidth;
  var firstCard = allCards[0];
  firstCard.style.transform = 'translate(' + Math.min(400, moveOutWidth * 0.5) + 'px, -100px) rotate(30deg)';
  if(firstCard.classList.contains("rotated")) firstCard.classList.remove("rotated");
  shiftCards();
  setTimeout(initCards, 100);
}

function prevCard() {
  var moveOutWidth = document.body.clientWidth;
  allCards = hist.recall();
  var prevCard = allCards[0];
  prevCard.style.transform = 'translate(-' + Math.min(400, moveOutWidth) + 'px)';
  setTimeout(initCards, 100);
}

function rotateCard(el) {
  if(el.classList.contains("rotated")) el.classList.remove("rotated");
  else el.classList.add("rotated");
}

function shiftCards() {
  counter.innerHTML = ++count;
  hist.update(allCards.slice());
  var theCard = allCards.shift();
  var minDistance = 3;
  var newPosition = Math.floor(Math.random() * (allCards.length - minDistance + 1)) + minDistance;
  allCards.splice(newPosition, 0, theCard);
}

function setCard(card, index) {
  card.style.zIndex = allCards.length - index;
  card.style.opacity = index < 5 ? Math.min(1, 1 - (index - 1) / 5) : 0;
  card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + Math.min(120, 25 * index) + 'px)';
}

function detectTouch() {
  allCards.forEach(function (el) {

    var hammertime = new Hammer(el);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    hammertime.on('tap', function () {
      if(el == allCards[0]) rotateCard(el);
    });
  
    hammertime.on('pan', function (event) {

      if(el != allCards[0]) return;
      el.classList.add('moving');
      if (event.deltaX === 0) return;
      if (event.center.x === 0 && event.center.y === 0) return;
  
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * -yMulti;
  
      el.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });
  
    hammertime.on('panend', function (event) {

      if(el != allCards[0]) return;
      el.classList.remove('moving');
  
      var moveOutWidth = document.body.clientWidth;
      var keep = Math.abs(event.velocityX) < 0.1;
  
      if (keep) el.style.transform = '';
      else {
        var endX = Math.abs(event.velocityX) * 0.5 * moveOutWidth;
        var toX = event.deltaX > 0 ? endX : -endX;
        var endY = Math.abs(event.velocityY) * 0.5 * moveOutWidth;
        var toY = event.deltaY > 0 ? endY : -endY;
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;
  
        el.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
        if(el.classList.contains("rotated")) el.classList.remove("rotated");
        
        shiftCards();
        initCards();
      }
    });
  });
}

function createButtonListener(shift) {
  return function (event) {
    if (!allCards.length) return false;
    if (shift) nextCard();
    else prevCard();
    event.preventDefault();
  };
}

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowRight") nextCard();
    else if (event.key == "ArrowLeft") prevCard();
    else if (event.key == "ArrowDown" || event.key == "ArrowUp") rotateCard(allCards[0]);
});

setTimeout(initCards, 10)
detectTouch();

var hist = new cardHistory(allCards.slice());
var removeListener = createButtonListener(false);
var heartListener = createButtonListener(true);

back.addEventListener('click', removeListener);
next.addEventListener('click', heartListener);









// function addCardtoDeck(container, content) {
//   var newCard = document.createElement("div");
//   newCard.className = "tinder--card";
//   var text = document.createElement("h3");
//   text.innerHTML = content;
  
//   newCard.append(text);
//   container.append(newCard);
//   allCards.push(newCard);
// }
