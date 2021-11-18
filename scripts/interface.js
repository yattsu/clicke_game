class Shop {
  constructor() {
    this.expanded = false;

    this.element = document.querySelector('.shop');
    this.title = this.element.querySelector('.title');
    this.items = this.element.querySelector('.items');

    this.title.addEventListener('click', this.toggle);
  }

  toggle = ((event) => {
    if (!this.expanded) {
      this.element.style.flex = 0.4;
      this.items.style.filter = 'opacity(1)';
      this.expanded = true;
    } else {
      this.element.style.flex = 0;
      this.items.style.filter = 'opacity(0)';
      this.expanded = false;
    }
  });
}

const shop = new Shop();