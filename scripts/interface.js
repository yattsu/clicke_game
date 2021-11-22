class Shop {
  constructor(game) {
    this.game = game;
    this.expanded = false;

    this.element = document.querySelector('.shop');
    this.title = this.element.querySelector('.title');
    this.menu = this.element.querySelector('.menu');
    this.tags = this.element.querySelectorAll('.tag');
    this.categories = this.element.querySelectorAll('.category');
    this.items = this.element.querySelector('.items');

    this.title.addEventListener('click', this.toggle);
    for (let i = 0; i < this.tags.length; i++) {
      this.tags[i].addEventListener('click', this.clickTag);
    }
    for (let id in this.game.skins) {
      document.querySelector(`#${id} img`).addEventListener('click', this.selectSkin);
    }

    this.everySecond();
  }

  selectSkin = (event) => {
    if (!this.game.ownedSkins.includes(event.target.parentElement.id)) {
      return;
    }

    this.game.currentSkin = event.target.parentElement.id;
  }

  everySecond() {
    setInterval(() => {
      this.renderSkins();
    }, 1000);
  }

  toggle = ((event) => {
    if (!this.expanded) {
      this.element.querySelector('.menu').style.pointerEvents = 'all';
      this.element.style.flex = 0.6;
      this.element.pointerEvents = 'all';
      this.menu.style.filter = 'opacity(1)';
      this.expanded = true;
      this.element.style.backgroundColor = 'rgba(224, 190, 206, 0.7)';
      this.element.style.boxShadow = '-10px 0px 20px rgba(0, 0, 0, 0.1)';
    } else {
      this.element.querySelector('.menu').style.pointerEvents = 'none';
      this.element.style.flex = 0;
      this.element.pointerEvents = 'none';
      this.element.zIndex = -1;
      this.menu.style.filter = 'opacity(0)';
      this.expanded = false;
      this.element.style.backgroundColor = 'rgba(224, 190, 206, 0)';
      this.element.style.boxShadow = '-10px 0px 20px rgba(0, 0, 0, 0)';
    }
  });

  clickTag = ((event) => {
    const id = event.target.id;

    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == id) {
        if (this.categories[i].classList.contains('hidden')) {
          this.categories[i].classList.remove('hidden');
        }
        continue;
      }

      this.categories[i].classList.add('hidden');
    }
  });

  renderSkins() {
    let game = this.game;
    for (let skin in game.skins) {
      let id = skin;
      let name = game.skins[id].name;
      let price = game.skins[id].price;
      let owned = game.ownedSkins.includes(skin) ? true : false;
      let skinObj = document.querySelector(`#${id}`);

      skinObj.querySelector('.title').innerHTML = name;
      skinObj.querySelector('img').src = `media/skins/${id}.png`;
      document.querySelector('.price').innerHTML = game.formatPts(price) + ' pts';
      if (!owned) {
        continue;
      }
      skinObj.querySelector('.owned').innerText = 'Owned';
      try {
        skinObj.querySelector('button').remove();
      }
      catch(e) {}
    }
  }
}