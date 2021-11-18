class Game {
  constructor() {
    this.scoreObj = document.querySelector('.score');
    this.character = document.querySelector('.character');
    this.purchaseButtons = document.querySelectorAll('.purchase');
    this.combo = 0;
    this.score = 0;
    this.multipliers = {
      click: 1,
      second: 0 
    };
    this.prices = {
      click: 2.5,
      second: 1.7 
    };
    this.settings = {
      tapSound: true,
      music: true
    };

    //document.addEventListener('keyup', (e) => {
      //let element = document.querySelector('.character').click();
    //});
    this.character.addEventListener('click', this.click);
    this.character.addEventListener('click', this.playTap);
    this.scoreObj.addEventListener('animationend', () => {
      this.scoreObj.classList.remove('twitch');
    });
    for (let i = 0; i < this.purchaseButtons.length; i++) {
      this.purchaseButtons[i].addEventListener('click', this.purchase);
    }

    this.everySecond();
    this.comboRefresh();
  }

  formatPts(amount) {
    let pts = amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    return pts;
  }

  incrementScore(amount) {
    this.score += amount;
    this.scoreObj.classList.add('twitch');
    this.scoreObj.innerHTML = this.formatPts(this.score) + ' pts';
  }

  passiveIncrement() {
    if (this.multipliers.second > 0) {
      this.incrementScore(this.multipliers.second);
    }
  }

  saveGameObject() {
    localStorage.setItem('gameObject', JSON.stringify(this));
  }

  everySecond() {
    setInterval(() => {
      this.updateScore();
      this.passiveIncrement();
      this.checkPrices();
      this.saveGameObject();
    }, 1000);
  }

  updateScore() {
    if (this.score == 0) {
      return;
    }
    this.scoreObj.innerHTML = this.formatPts(this.score) + ' pts';
  }

  comboRefresh() {
    const tax = 0.5;
    const overlay = document.querySelector('.combo_overlay');

    setInterval(() => {
      if (this.combo > 0) {
        if (this.combo == 0 || (this.combo - tax) <= 0) {
          this.combo = 0;
        } else {
          this.combo -= tax;
        }

        overlay.style.filter = `opacity(${this.combo / 150})`;
      }
    }, 25);
  }

  comboAdd() {
    const amount = 4;
    if (this.combo >= 100 || (this.combo + amount) > 100) {
      this.combo = 100;
      return;
    }

    this.combo += amount;
  }

  click = (event) => {
    this.incrementScore(this.multipliers.click);
    this.comboAdd();

    let clientX = event.clientX;
    let clientY = event.clientY;
    const floatingElement = new floatingText('+' + this.multipliers.click, clientX, clientY);
  }

  playTap = (event) => {
    if (!this.settings.tapSound) {
      return;
    }

    const tapObj = document.querySelector('.character .tap');
    tapObj.currentTime = 0;
    tapObj.play();
  }

  calculatePrice(id) {
    let price = Math.floor(Math.pow(this.multipliers[id], this.prices[id]));

    if (this.multipliers[id] == 0) {
      price = 1;
    }

    return price;
  }

  checkPrices() {
    const items = document.querySelectorAll('.shop .items');

    for (let i = 0; i < items[0].children.length; i++) {
      const item = items[0].children[i];
      const id = item.id;
      const status = item.children[1];
      const priceObj = item.children[2];
      const button = item.children[3];

      const price = this.calculatePrice(id);

      priceObj.innerHTML = `Price: ${this.formatPts(price)} pts`;
      if (this.multipliers[id] == 0) {
        status.innerHTML = `Current: ${this.formatPts(this.multipliers[id])}<br> Next: ${this.formatPts((this.multipliers[id] + 1) * 2)}`;
      } else {
        status.innerHTML = `Current: ${this.formatPts(this.multipliers[id])}<br> Next: ${this.formatPts(this.multipliers[id] * 2)}`;
      }
      if (this.score < price) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }
    }
  }

  purchase = (event) => {
    const id = event.target.parentElement.id;
    const price = this.calculatePrice(id);

    if (this.score < price) {
      return;
    }

    this.score -= price;
    if (this.multipliers[id] == 0) {
      this.multipliers[id]++;
    }

    this.multipliers[id] *= 2;
  }
}

class floatingText {
  constructor(content, clientX, clientY) {
    this.content = content;
    this.clientX = clientX;
    this.clientY = clientY;
    this.parent = document.querySelector('.main');

    this.createElement();
  }

  createElement() {
    const element = document.createElement('div');
    const minDeg = -20;
    const maxDeg = 20;
    let degrees = (Math.random() * (maxDeg - 1 - (minDeg) + (minDeg))).toFixed(2);
    if (Math.floor(Math.random() * 2) == 0) {
      degrees *= (-1);
    }

    element.classList.add('floating_text');
    element.style.left = `${this.clientX}px`;
    element.style.top = `${this.clientY - 50}px`;
    element.style.transform = `translateX(${degrees}%) rotate(${degrees}deg)`;
    element.innerHTML = this.content;

    this.parent.appendChild(element);
    element.addEventListener('animationend', this.removeElement);
  }

  removeElement(event) {
    event.target.remove();
  }
}

let game = new Game();
let savedGame = JSON.parse(localStorage.getItem('gameObject'));
if (savedGame) {
  game.score = savedGame.score;
  game.multipliers = savedGame.multipliers;
  game.settings = savedGame.settings;
}