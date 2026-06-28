class CartItem {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.price = Number(product.price);
        this.img = product.img;
        this.quantity = 1;
    }

    getTotal() {
        return this.price * this.quantity;
    }
}

