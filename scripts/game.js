class Game {
  constructor() {
    this.scoreObj = document.querySelector('.score');
    this.character = document.querySelector('.character');
    this.purchaseButtons = document.querySelectorAll('.purchase');
    this.combo = 0;
    this.score = 0;
    this.rampage = false;
    this.rampageBonus = 0;
    this.multipliers = {
      click: 1,
      second: 0,
      rampage: 2 
    };
    this.prices = {
      click: 2,
      second: 1.7,
      rampage: 0.5 
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
      this.updatePrices();
      this.saveGameObject();
      this.updatePageTitle();
    }, 1000);
  }

  updatePageTitle() {
    document.title = this.formatPts(this.score + ' pts');
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
    this.incrementScore(this.multipliers.click + this.rampageBonus);
    this.comboAdd();

    let clientX = event.clientX;
    let clientY = event.clientY;
    const floatingElement = new floatingText('+' + (this.multipliers.click + this.rampageBonus), clientX, clientY);
  }

  playTap = (event) => {
    if (!this.settings.tapSound) {
      return;
    }

    const tapObj = document.querySelector('.character .tap');
    tapObj.currentTime = 0;
    tapObj.play();
  }

  flooredPow(x, y) {
    return Math.floor(Math.pow(x, y));
  }

  calculatePrice(id) {
    let price;

    switch (id) {
      case 'rampage':
        price = Math.floor(this.score * this.prices[id]);
        break;
      default:
        price = this.flooredPow(this.multipliers[id], this.prices[id]);
    }

    if (this.multipliers[id] == 0) {
      price = 1;
    }

    return price;
  }

  updatePrices() {
    const items = document.querySelectorAll('.shop .items');

    for (let i = 0; i < items[0].children.length; i++) {
      const item = items[0].children[i];
      const id = item.id;
      const status = item.querySelector('.status');
      const priceObj = item.querySelector('.price');
      const button = item.querySelector('.purchase');

      const price = this.calculatePrice(id);
      const nextPrice = this.multipliers[id] == 0 ? this.formatPts((this.multipliers[id] + 1) * 2) : this.formatPts(this.multipliers[id] * 2);

      if (this.score < price) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }

      priceObj.innerHTML = `Price: ${this.formatPts(price)} pts`;

      if (!status) {
        continue;
      }
      status.innerHTML = `Current: ${this.formatPts(this.multipliers[id])}<br> Next: ${nextPrice}`;
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

    switch (id) {
      case 'rampage':
        this.enableRampage();
        break;
      default:
        this.multipliers[id] *= 2;
        break;
    }
  }

  enableRampage() {
    document.querySelector('.rampage_overlay').style.filter = 'opacity(1)';
    document.querySelector('.mlg_glasses').style.transform = 'translate(-78%, 44%) rotate(3deg)';
    document.querySelector('.mlg_glasses').style.filter = 'opacity(1)';

    this.rampageBonus += this.rampageBonus;
    this.rampageBonus += this.multipliers.click;

    let timeSpent = 0;
    let timeAvailable = 10;

    let interval = setInterval(() => {
      timeSpent++;
      if (timeSpent > timeAvailable) {
        this.disableRampage();
        clearInterval(interval);
      }
    }, 1000);
  }

  disableRampage() {
    document.querySelector('.rampage_overlay').style.filter = 'opacity(0)';
    document.querySelector('.mlg_glasses').style.transform = 'translate(-78%, 0%) rotate(3deg)';
    document.querySelector('.mlg_glasses').style.filter = 'opacity(0)';

    let timeSpent = 0;
    this.rampageBonus -= this.multipliers.click;
    this.rampageBonus -= this.rampageBonus;
    if (this.rampageBonus < 0) {
      this.rampageBonus = 0;
    }
    return;
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