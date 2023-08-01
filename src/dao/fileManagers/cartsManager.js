import fs from "fs";
import __dirname from "../../utils.js";

class CartsManager {
    constructor() {
        this.cartJSON = __dirname + "/files/Carts.json"
    }

    getCarts = async () => {
        if (fs.existsSync(this.cartJSON)) {
            const data = await fs.promises.readFile(this.cartJSON, "utf-8");
            const result = JSON.parse(data);
            return result;
        } else {
            return [];
        }
    }

    getCartById = async(cid) => {
        const carts = await this.getCarts();
        const cart = carts.find((u) => u.id == cid);
        return cart;
    }

    addCart = async (cart) => {
        const carts = await this.getCarts();
        let cartIndex = carts.findIndex(c => c.id === cart.id);
        if (cartIndex === -1) {
            cartIndex = carts.length;
            carts.push({
                id: cartIndex + 1,
                products: [],
            });
        } else {
            carts[cartIndex].products = cart.products;
        }
        await fs.promises.writeFile(
            this.cartJSON,
            JSON.stringify(carts, null, "\t")
        );
        return carts[cartIndex];
    }

    addProducts = async (productID, carritoID, quantity, product)=>{
        const carritos = await this.getCarts();
        const indiceCart = carritos.findIndex((e) => e.id == carritoID);
        const indiceProduct = carritos[indiceCart].products.findIndex((e) => e.id == productID);

        if (!quantity) {
            carritos[indiceCart].products[indiceProduct].quantity++
        }
        if (indiceProduct !== -1) {
            carritos[indiceCart].products[indiceProduct].quantity += quantity
        }
        else {
            carritos[indiceCart].products.push(product)
        }

        await fs.promises.writeFile(
            this.cartJSON,
            JSON.stringify(carritos, null, "\t")
        );
        const resultado = carritos[indiceCart]
        return resultado;
    }

}
export default CartsManager;