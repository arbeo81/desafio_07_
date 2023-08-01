const socket = io();

socket.on('updateProducts', (productos) => {
    console.log("Productos actualizados:", productos);
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';
    productos.forEach((producto) => {
    const productoHTML = `
        <div style="width: 380px;position: relative;box-shadow: 0 2px 7px #dfdfdf;margin: 10px auto;background: #fafafa;">
            <div style="
                    position: absolute;
                    left: 0;
                    top: 20px;
                    text-transform: uppercase;
                    font-size: 13px;
                    font-weight: 700;
                    background: red;
                    color: #fff;
                    padding: 3px 10px;">
                Sale
            </div>
            <div style="display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 300px;
                        background: #f0f0f0">
                ${producto.thumbnail.map(thumb => `<img style="width: 100%;max-height: 100%;margin-right: 10px;" src=${thumb} alt="">`).join('')}
            </div>   
            <div style="padding: 30px;">
                <span style="
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #ccc;">
                ${producto.category}
                </span>
                <h4><a href="">${producto.title}</a></h4>
                <p>${producto.description}</p>
                <div style="
                    font-weight: 500;
                    display: block;
                    text-transform: uppercase;
                    color: #363636;
                    text-decoration: none;
                    transition: 0.3s;">
                <div style=" font-size: 18px;color: #fbb72c;font-weight: 600;"><small>$${producto.price}</small></div>
                <div>${producto.code}</div>
                <div>Stock: ${producto.stock}</div>
                </div>
            </div>
            </div>
        `;
        listaProductos.innerHTML += productoHTML;
        });
    });

socket.on('updateProducts', (idProducto) => {
    const listaProductos = document.getElementById('lista-productos');
    const productos = listaProductos.children;

    for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];

    if (producto.getAttribute('data-id') === idProducto) {
        producto.remove();
        break;
    }
    }
});

socket.on('updateProducts', (productoActualizado)=> {
    const listaProductos = document.getElementById('lista-productos');
    const productoAnterior = listaProductos.querySelector(`[data-id="${productoActualizado.id}"]`);
    if (productoAnterior) {
    productoAnterior.innerHTML = `
    <div style="width: 380px;position: relative;box-shadow: 0 2px 7px #dfdfdf;margin: 10px auto;background: #fafafa;">
        <div style="
                position: absolute;
                left: 0;
                top: 20px;
                text-transform: uppercase;
                font-size: 13px;
                font-weight: 700;
                background: red;
                color: #fff;
                padding: 3px 10px;">
            Sale
        </div>
        <div style="display: flex;
                align-items: center;
                justify-content: center;
                height: 300px;
                background: #f0f0f0">
            <img style="width: 100%;max-height: 100%;" src=${productoActualizado.thumbnail} alt="">
        </div>
        <div style="padding: 30px;">
            <span style="
                display: block;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                color: #ccc;">
                ${productoActualizado.category}
            </span>
            <h4><a href="">${productoActualizado.title}</a></h4>
            <p>${productoActualizado.description}</p>
            <div style="
                font-weight: 500;
                display: block;
                text-transform: uppercase;
                color: #363636;
                text-decoration: none;
                transition: 0.3s;">
                <div style=" font-size: 18px;color: #fbb72c;font-weight: 600;"><small>$${productoActualizado.price}</small></div>
                <div>${productoActualizado.code}</div>
                <div>Stock: ${productoActualizado.stock}</div>
            </div>
        </div>
    </div>
    `;
    }
});
