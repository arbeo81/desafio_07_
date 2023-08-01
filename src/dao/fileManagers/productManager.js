import fs from "fs";
import __dirname from "../../utils.js";

class ProductManager {
    constructor() {
        this.productJSON = __dirname + "/files/Products.json"
    }

    getProducts = async (limit) => {
        try {
            const data = await fs.promises.readFile(this.productJSON, "utf-8");
            const products = JSON.parse(data);
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los productos");
        }
    }

    checkProductCode = async (code) => {
        const products = await this.getProducts();
        const codigoProducto = products.some(product => product.code === code);
        return codigoProducto;
    }

    getProductById = async (id) => {
        const productos = await this.getProducts();
        const producto = productos.find((product) => product.id == id);
        if (!producto) {
            throw new Error('No se encontró el producto seleccionado');
        }
        return producto;
    }

    validateProductData(title, description, price, stock, category) {
        if (!title) {
            throw new Error("El título del producto es requerido");
        }
        if (!description) {
            throw new Error("La descripción del producto es requerida");
        }
        if (!price || isNaN(price)) {
            throw new Error("El precio del producto es obligatorio y debe ser un número.");
        }
        if (!stock || isNaN(stock) || parseInt(stock) < 0) {
            throw new Error("El stock del producto es obligatorio y debe ser un número.");
        }
        if (!category) {
            throw new Error("La categoría del producto es requerida");
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
        this.validateProductData(title, description, price, stock, category);
        const productos = await this.getProducts()
        const codigo = await this.checkProductCode(code)
        if (codigo) {
            throw new Error(`El código "${code}" ya existe`);
        }
        const newProduct = {
            id: productos.length + 1,
            title: title.trim(),
            description: description.trim(),
            price: parseFloat(price),
            thumbnail: thumbnail || [],
            code: code.trim(),
            stock: parseInt(stock),
            status: stock < 1 ? false : true,
            category: category.trim(),
        }
        productos?.push(newProduct)

        await fs.promises.writeFile(
            this.productJSON,
            JSON.stringify(productos, null, "\t")
        );
        return newProduct;
    }

    editarProducto = async (id, changes) => {
        const productos = await this.getProducts();
        const productIndex = productos.findIndex((product) => product.id == id);

        if (productIndex === -1) {
            throw new Error(`No se encontró el producto con ID ${id}`);
        }

        const updatedProduct = {
            ...productos[productIndex],
            ...changes,
            price: parseFloat(changes.price),
            stock: parseInt(changes.stock),
            status: changes.stock < 1 ? false : true,
        };
        productos[productIndex] = updatedProduct;

        await fs.promises.writeFile(
            this.productJSON,
            JSON.stringify(productos, null, "\t")
        );

        return updatedProduct;
    }

    eliminarProducto = async (id) => {
        const productos = await this.getProducts();
        const index = productos.findIndex((p) => p.id == id);

        if (index === -1) {
            throw new Error(`No se encontró el producto con ID ${id}`);
        }
        productos.splice(index, 1);

        await fs.promises.writeFile(
            this.productJSON,
            JSON.stringify(productos, null, "\t")
        );

        return `Se eliminó el producto ${id} correctamente`;
    }
}
export default ProductManager;