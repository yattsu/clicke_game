class Shop {
  constructor() {
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
  }

  toggle = ((event) => {
    if (!this.expanded) {
      this.element.style.flex = 0.6;
      this.menu.style.filter = 'opacity(1)';
      this.expanded = true;
      this.element.style.backgroundColor = 'rgba(224, 190, 206, 0.7)';
      this.element.style.boxShadow = '-10px 0px 20px rgba(0, 0, 0, 0.1)';
    } else {
      this.element.style.flex = 0;
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
        this.categories[i].classList.remove('hidden');
        continue;
      }

      this.categories[i].classList.add('hidden');
    }
  });
}

const shop = new Shop();