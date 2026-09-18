const botonJugar = document.getElementById("jugar");

const contenedor = document.querySelector(".contenedor");
const juegoBloque = document.querySelector(".juegoBloque");
const teclado = document.querySelector(".teclado");

const tablero = document.getElementById("tablero");

const botonEnter = document.getElementById("enter");
const botonDel = document.getElementById("del");

// Palabra

const palabraSecreta = "PERRO";

// Variables

let filaActual = 0;
let letraActual = 0;

// Boton "Jugar" index

botonJugar.addEventListener("click", function () {
  const intentos = parseInt(document.getElementById("intentos").value);

  const letras = parseInt(document.getElementById("letras").value);

  // Comprobar que el número de letras coincide
  if (letras !== palabraSecreta.length) {
    alert("Para esta prueba selecciona " + palabraSecreta.length + " letras.");

    return;
  }

  // Ocultar pantalla inicial
  contenedor.style.display = "none";

  // Mostrar juego
  juegoBloque.style.display = "block";

  // Mostrar teclado
  teclado.style.display = "flex";

  // Limpiar tablero
  tablero.innerHTML = "";

  // Reiniciar posiciones
  filaActual = 0;
  letraActual = 0;

  // Tablero Letras

  for (let i = 0; i < intentos; i++) {
    const filaTablero = document.createElement("div");

    filaTablero.classList.add("filaTablero");

    for (let j = 0; j < letras; j++) {
      const casilla = document.createElement("div");

      casilla.classList.add("casilla");

      filaTablero.appendChild(casilla);
    }

    tablero.appendChild(filaTablero);
  }
});

// Teclado

const teclas = document.querySelectorAll(".teclado button");

teclas.forEach(function (tecla) {
  tecla.addEventListener("click", function () {
    // Ignorar Enter y DEL
    if (tecla.id === "enter" || tecla.id === "del") {
      return;
    }

    const filas = document.querySelectorAll(".filaTablero");

    // Comprobar si quedan intentos
    if (filaActual >= filas.length) {
      return;
    }

    const casillas = filas[filaActual].querySelectorAll(".casilla");

    // Comprobar si la fila está llena
    if (letraActual >= casillas.length) {
      return;
    }

    // Obtener letra pulsada
    const letra = tecla.textContent;

    // Escribir letra
    casillas[letraActual].textContent = letra;

    // Pasar a la siguiente casilla
    letraActual++;
  });
});

// Boton Delete

botonDel.addEventListener("click", function () {
  if (letraActual === 0) {
    return;
  }

  const filas = document.querySelectorAll(".filaTablero");

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  // Retroceder
  letraActual--;

  // Borrar
  casillas[letraActual].textContent = "";
});

// Boton Enter

botonEnter.addEventListener("click", function () {
  const filas = document.querySelectorAll(".filaTablero");

  // Comprobar que quedan intentos
  if (filaActual >= filas.length) {
    return;
  }

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  // Comprobar que la palabra está completa
  if (letraActual < casillas.length) {
    alert("Completa la palabra antes de pulsar Enter.");

    return;
  }

  // Crear palabra

  let palabraUsuario = "";

  for (let i = 0; i < casillas.length; i++) {
    palabraUsuario += casillas[i].textContent;
  }

  // Pasar a mayúsculas
  palabraUsuario = palabraUsuario.toUpperCase();

  // Comprobar la palabra entera

  if (palabraUsuario === palabraSecreta) {
    // Todas las letras verdes
    for (let i = 0; i < casillas.length; i++) {
      casillas[i].classList.add("correcta");
    }

    alert("¡Has acertado!");

    return;
  }

  // Comprobar las letras

  for (let i = 0; i < casillas.length; i++) {
    const letra = palabraUsuario[i];

    // Letra y posición correctas
    if (letra === palabraSecreta[i]) {
      casillas[i].classList.add("correcta");
    }

    // La letra existe pero está en otra posición
    else if (palabraSecreta.includes(letra)) {
      casillas[i].classList.add("presente");
    }

    // La letra no existe
    else {
      casillas[i].classList.add("incorrecta");
    }
  }

  // Pasar intento

  filaActual++;

  letraActual = 0;

  // Comprobar si se han acabado los intentos
  if (filaActual >= filas.length) {
    alert("Has perdido. La palabra era " + palabraSecreta + ".");
  }
});
