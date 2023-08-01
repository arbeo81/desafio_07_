import { cartsModel } from "../models/carts.js";
import { productsModel } from "../models/products.js";
import  UserModel  from "../models/user.js";

export class CartsDataBase {
    constructor() { }

    getCarts = async () => {
        const data = await cartsModel.find();
        const carts = data.map((cart) => cart.toObject());
        return carts;
    };

    getCartById = async (cid) => {
        const carts = await this.getCarts();
        const cart = carts.find((u) => u._id == cid);
        return cart;
    };

    addCart = async (cart) => {
        const carts = await this.getCarts();
        let cartIndex = carts.findIndex((c) => c._id == cart.id);
        if (cartIndex === -1) {
            cartIndex = carts.length;
            carts.push({
                products: [],
            });
        } else {
            carts[cartIndex].products = cart.products;
        }
        const createdCart = await cartsModel.create(cart);
        return createdCart.toObject();
    };

    getUser = async () => {
        const data = await UserModel.find();
        const user = data.map((user) => user.toObject());
        return user;
    }

    addProducts = async (productId, carritoId, quantity) => {
        try {
            const carritos = await this.getUser(); // Asumiendo que esta línea obtiene los carritos correctamente

            // Busca el carrito por su ID
            const carrito = carritos.find((e) => e.cart._id.toString() === carritoId);

            if (!carrito) {
                throw new Error(`No se encontró el carrito con id ${carritoId}`);
            }

            // Busca el producto en la colección de productos
            const product = await productsModel.findById(productId);

            if (!product) {
                throw new Error(`No se encontró el producto con id ${productId}`);
            }

            // Verifica si el producto ya existe en el carrito
            const indiceProduct = carrito.cart.products.findIndex(
                (e) => e.product._id.toString() === productId
            );

            if (indiceProduct !== -1) {
                // Si el producto ya existe en el carrito, actualiza su cantidad
                carrito.cart.products[indiceProduct].quantity += quantity;
            } else {
                // Si el producto no existe en el carrito, agrégalo
                carrito.cart.products.push({
                    quantity: quantity,
                    product: product,
                });
            }

            // Guarda los cambios del carrito en la base de datos
            const updatedCart = await UserModel.findByIdAndUpdate(
                carrito._id,
                carrito,
                { new: true }
            );

            return updatedCart.toObject();
        } catch (error) {
            // Manejo de errores
            console.error(error);
            throw error; // Relanza el error para manejarlo en el código que llama a esta función
        }
    };

    eliminarProducto = async (productId, cartId) => {
        try {
            const carts = await this.getUser();
            const cart = carts.find((e) => e.cart._id.toString() === cartId);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }
    
            const productIndex = cart.cart.products.find((p) => p.product._id.toString() === productId);
    
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito`);
            }
    
            cart.cart.products.splice(productIndex, 1);
    
            const updatedCart = await UserModel.findByIdAndUpdate(cart._id, cart, { new: true });
    
            return updatedCart.toObject();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    editarCart = async (cartID, newProducts) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((c) => c._id == cartID);
        if (cartIndex === -1) {
            throw new Error("El carrito no existe");
        }
        const cart = carts[cartIndex];
        cart.products = newProducts;
        const updatedCart = await cartsModel.findByIdAndUpdate(
            cart._id,
            { products: newProducts },
            { new: true }
        );
        return updatedCart.toObject();
    };

    updateProductQuantity = async (productID, cartID, quantity) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((c) => c._id == cartID);
        if (cartIndex === -1) {
            throw new Error("El carrito no existe");
        }
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex((p) => p._id == productID);
        if (productIndex === -1) {
            throw new Error("El producto no existe en el carrito");
        }
        cart.products[productIndex].quantity = quantity;
        const updatedCart = await cartsModel.findByIdAndUpdate(cart._id, cart, {
            new: true,
        });
        return updatedCart.toObject();
    };
}
