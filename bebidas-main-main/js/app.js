
let productos = [
    { id: 1, nombre: 'Blue Label', cantidad: 0, genero: 'whiskey', desc: "Es una mezcla exquisita hecha con algunos de los whiskies más raros y excepcionales de Escocia.", precio: 44000, img: "./img/bluelabel.jpg" },
    { id: 2, nombre: 'Absolut', cantidad: 0, genero: 'vodka', desc: "es una de las bebidas alcohólicas qué en comparación con las demás, no cuenta con azúcar añadida y sus ingredientes son naturales.", precio: 2690, img: "./img/absolut.png" },
    { id: 3, nombre: 'Jägermeister', cantidad: 0, genero: 'otro', desc: "es un licor de hierbas endulzado, pero con un dejo amargo, el cual tiene 34,5% de contenido alcohólico. Es muy popular en Baja Sajonia en la ciudad de Wolfenbüttel (Alemania).", precio: 5400, img: "./img/jagger.jpg" },
    { id: 4, nombre: 'Red Label', cantidad: 0, genero: 'whiskey', desc: "un perfil dinámico de especias aromáticas canela y pimienta, una dulzura frutal manzana fresca o pera y notas de vainilla", precio: 4000, img: "./img/redlabel.jpg" },
    { id: 5, nombre: 'Smirnoff', cantidad: 0, genero: 'vodka', desc: "granos seleccionados, que se mezclan con agua desmineralizada y filtrada. Es obtenido por triple de destilación del alcohol de grano y filtrado en hasta diez ocasiones por carbón vegetal (charcoal).", precio: 1000, img: "./img/smirnoff.png" },
    { id: 6, nombre: "Jack Daniel's", cantidad: 0, genero: 'whiskey', desc: "whiskey Tennesse, y este tipo de destilado se diferencia en que su elaboración se filtra a través de carbon de madera de arce.", precio: 6000, img: "./img/jackdanields.jpg" },
]


const body = document.body;
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const contenedorCarrito = document.querySelector('#lista-carrito');

let resultado = document.getElementById('resultado');
let input = document.getElementById('input');
let boton = document.querySelector('#btn');

const carritoWrapper = document.getElementById("carrito-wrapper");
const carritoContainer = document.getElementById("carrito-container");
const imgCarrito = document.getElementById("img-carrito");
const totalPrice = document.getElementById("precioTotal");
const container = document.querySelector('#post-container')
const btnAnterior = document.querySelector('#anterior')
const btnSiguiente = document.querySelector('#siguiente')

let id = 1

const llamarPost = async () => {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const data = await resp.json()
    
    const {title, body, userId} = data

    container.innerHTML = `
    <div class="card text-bg-dark" style="max-width: 18rem;">
    <div class="card-header">${userId}</div>
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${body}</p>
    </div>
  </div>
            `
}

btnSiguiente.addEventListener('click', () => {
    id++
    llamarPost()
})

btnAnterior.addEventListener('click', () => {
    if (id === 1) { return }

    id--
    llamarPost()
})

llamarPost()

imgCarrito.addEventListener("mouseover", () => {
    carritoContainer.style.display = "block";
});

carritoWrapper.addEventListener("mouseleave", () => {
    carritoContainer.style.display = "none";
});

boton.addEventListener('click', mostrar)

document.addEventListener("DOMContentLoaded", () => {
    crearTarjetasHTML(productos)
    productos = JSON.parse(localStorage.getItem('carrito')) || []
    carritoHTML()
});

vaciarCarrito.addEventListener('click', () => {

    productos = productos.map((obj) => ({ ...obj, cantidad: 0 }));

    Toastify({
        text: `¡Vaciaste el carrito!`,
        duration: 3000,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, black, brown)",
        },
    }).showToast();

    carritoHTML();
})



function mostrar() {

    if (input.value == 'whiskey') {

        crearTarjetasHTML(productos.filter(producto => producto.genero === 'whiskey'))
    } else if (input.value == 'vodka') {

        crearTarjetasHTML(productos.filter(producto => producto.genero === 'vodka'))
    } else if (input.value == 'otro') {

        crearTarjetasHTML(productos.filter(producto => producto.genero === 'otro'))
    } else {

        crearTarjetasHTML(productos)
    }

    darEstilo();

}

function modificarCarrito(id, agregando = true) {
    const selected = productos.findIndex(producto => producto.id === id);

    const { nombre } = productos[selected];

    if (agregando) {
        productos[selected].cantidad++;
    } else {
        productos[selected].cantidad--;
    }

    carritoHTML();

    Toastify({
        text: agregando ? `Añadiste ${nombre} al carrito` : `eliminaste ${nombre} del carrito`,
        duration: 3000,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: {
            background: agregando ? "linear-gradient(to right, #000000, #141776)" : "linear-gradient(to right, #000000, #ce3030)",

        },
    }).showToast();

}

function crearTarjetasHTML(alcohol) {
    resultado.innerHTML = "";

    for (const producto of alcohol) {
        resultado.innerHTML += `
                                <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin:20px 0">
                                    <div class="card product-card" >
                                                <img src=${producto.img} class="card-img-top product-image">
                                        <div class="card-body">
                                                <h5 class="card-title">${producto.nombre}</h5>
                                                <p class="card-text">${producto.desc}</p>
                                                <p>Precio: $${producto.precio}</p>
                                                <button class="btn btn-primary add-to-cart agregar-carrito" onclick="modificarCarrito(${producto.id})">Añadir Carrito</button>
                                        </div>
                                    </div>
                                </div>    
                                `
    }
};




function carritoHTML() {
    //limpiar HTML
    limpiarHTML();

    let precioFinal = 0;

    //recorre el carrito y crea HTML
    productos.forEach(alcohol => {
        const { img, nombre, precio, cantidad, id } = alcohol;
        const precioProductos = precio * cantidad;
        precioFinal += precioProductos;

        if (cantidad > 0) {
            const row = document.createElement('div')
            row.classList.add("cart-item")
            row.innerHTML = `
            <img src="${img}" width="100" />
            <span> ${nombre} </span>
            <span> ${precioProductos} </span>
            <span> ${cantidad} </span>
            <span><div class="close-btn" onclick="modificarCarrito(${id},false)" >&times;</div></span>
        ` ;

            //agrega el HTML del carrito al tbody
            contenedorCarrito.appendChild(row);
        }
    });

    totalPrice.innerHTML = ` 
    <p>Precio final: $${precioFinal} </p>
    `

    //agregar el carrito al storage
    sincronizarStorage();

}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(productos))
}

function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
