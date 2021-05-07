// 1. performance.now() para conocer cuanto tarda en ejecutarse el código

// Otra manera de saber cuanto tardan los archivos en descargar. Es mirar 
// chrome - Inspeccionar - NetWork
// Pero si quieres saber cuanto tiempo demora una sección en ejecutar 
// el código performance.now(). Ir a la sección selectCriptomonedas y 
// consultarAPI para ver en acción

// 2. async o defer cual utilizar.
// Ir a index.html sección <script> para ver la explicación

// 3. Como utilizar debugger; ir a mostrarCotizacionHTML

// 4. Opciones para Ofuscar el código y ocultarlo
// JavaScript se sabe que el código puede verse en el cliente. Existe
// una forma para Ofuscar el códgido. Ir a la página javascript2img,
// esto hace que el código quede difícil de entender.
// Util para ocultar cierta parte del código.
// No se recomienda ofuscar todo el código debido al Performance

// 5. Otras Medidas de seguridad
// Seguridad en JavaScript. El DOM Scripting ya escapa de los datos
// es decir, algunas bulnerabilidades al usar innerHTML son evitadas
// usando el DOMScripting y evita riesgo de seguridad.
// Intentar usar textContent la mayoría de las veces

// Utiliza innerHTML solo cuando la fuente de los datos es segura
// Formularios: Valida en el cliente(JS) para retroalimentación
// en tiempo real, pero también en el servidor.

// Si deseas crear apss con Autenticación de usuarios puedes
// utilizar JWT(JSON Web Tokens), es la técnica más utilizada o
// si quieres menos programación utiliza Auth0.

// Otras Consideraciones. Cuando trabajes con dependencias, utiliza
// una herramienta para verificar vulnerabilidades como snyk.io
// Hashea información sesible con la líbreria de bcrypt
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

// Promises
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

// Consulta la API par aobtener un listado de Criptomonedas
function consultarCriptomonedas() {

    // Ir  AtoPLISTS Y Despues market capp 
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json()) // Consulta exitosa...
        .then( resultado => obtenerCriptomonedas(resultado.Data)) // 
        .then( criptomonedas  =>  selectCriptomonedas(criptomonedas) )
        .catch( error => console.log(error));
}

// llena el select 
function selectCriptomonedas(criptomonedas) {

    //Conocer el tiempo de ejecución
    const inicio = performance.now(); //Comienzo de medición performance

    // criptomonedas.forEach( cripto => {
    //     const { FullName, Name } = cripto.CoinInfo;
    //     const option = document.createElement('option');
    //     option.value = Name;
    //     option.textContent = FullName;
    //     // insertar el HTML
    //     criptomonedasSelect.appendChild(option);
    // });

    for (let index = 0; index < criptomonedas.length; index++) {
        const { FullName, Name } = criptomonedas[index].CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        // insertar el HTML
        criptomonedasSelect.appendChild(option);
        
    }

    const fin = performance.now();//Fin de medición performance
    console.log(fin - inicio);//resta los tiempos 0.244

}


function leerValor(e)  {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    // Extraer los valores
    const { moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }


    consultarAPI();
}


function mostrarAlerta(mensaje) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
       formulario.appendChild(divMensaje);

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
}


function consultarAPI() {

    const inicio = performance.now();

    const { moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)  
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
    
    const fin = performance.now();
    console.log(fin - inicio); 

}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();

    console.log(cotizacion);
    const  { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    // Para ver el dato que tiene PRICE 
    console.log(PRICE);//Podremos ves el dato que tiene

    //Otra forma de realizar es con debugger;
    // debugger mostrará todas las variables, sus valores y detiene la.
    // ejecución 
    // Ir a Chrome, usar el programa. Mostrará el Source y el Scope
    // Ahí estarán todas las variables y valores

    // debugger;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    // debugger;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    formulario.appendChild(resultado);
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

    resultado.appendChild(spinner);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
  }