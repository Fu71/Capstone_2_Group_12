class Product {
    constructor(
        id,
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        description,
        type
    ) {
        this.id = id;
        this.name = name;
        this.price = Number(price) || 0;
        this.screen = screen || "";
        this.backCamera = backCamera || "";
        this.frontCamera = frontCamera || "";
        this.img = img || "https://via.placeholder.com/300";
        this.description = description || "";
        this.type = type || "";
    }
}