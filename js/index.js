"use strict";

const botonJugar = document.getElementById("jugar");

const contenedor = document.querySelector(".contenedor");

const juegoBloque = document.querySelector(".juegoBloque");

const teclado = document.querySelector(".teclado");

const tablero = document.getElementById("tablero");

const botonEnter = document.getElementById("enter");

const botonDel = document.getElementById("del");

const alerta = document.getElementById("alerta");

const mensajeAlerta = document.getElementById("mensajeAlerta");

const botonReiniciar = document.getElementById("reiniciar");

// VARIABLES

let filaActual = 0;
let letraActual = 0;

// PALABRA

let palabra = "";

// BOTÓN "JUGAR"

botonJugar.addEventListener("click", function () {
  const intentos = parseInt(document.getElementById("intentos").value);

  const letras = parseInt(document.getElementById("letras").value);

  // URL API

  const url =
    "https://random-word-api.herokuapp.com/word?number=1&length=" +
    letras +
    "&diff=1&lang=es";

  fetch(url)
    .then(function (respuesta) {
      return respuesta.json();
    })

    .then(function (datos) {
      // Guardar palabra
      palabra = datos[0].toUpperCase();

      console.log("Palabra:", palabra);

      // OCULTAR PANTALLA INICIAL

      contenedor.style.display = "none";

      // MOSTRAR JUEGO

      juegoBloque.style.display = "block";

      teclado.style.display = "flex";

      // LIMPIAR TABLERO

      tablero.innerHTML = "";

      // REINICIAR POSICIONES

      filaActual = 0;

      letraActual = 0;

      // CREAR TABLERO

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
    })

    .catch(function (error) {
      console.error("Error al obtener la palabra:", error);

      alert("No se ha podido obtener una palabra.");
    });
});

// FUNCIÓN PARA MOSTRAR ALERTA

function mostrarAlerta(mensaje) {
  mensajeAlerta.textContent = mensaje;

  alerta.style.display = "flex";
}

// BOTÓN "VOLVER A JUGAR"

botonReiniciar.addEventListener("click", function () {
  // Ocultar alerta
  alerta.style.display = "none";

  // Mostrar pantalla inicial
  contenedor.style.display = "flex";

  // Ocultar juego
  juegoBloque.style.display = "none";

  // Ocultar teclado
  teclado.style.display = "none";

  // Limpiar tablero
  tablero.innerHTML = "";

  // Reiniciar variables
  filaActual = 0;

  letraActual = 0;

  palabra = "";
});

// TECLADO

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

// BOTÓN DELETE

botonDel.addEventListener("click", function () {
  // Si no hay ninguna letra
  if (letraActual === 0) {
    return;
  }

  const filas = document.querySelectorAll(".filaTablero");

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  // Retroceder
  letraActual--;

  // Borrar letra
  casillas[letraActual].textContent = "";
});

// BOTÓN ENTER

botonEnter.addEventListener("click", function () {
  const filas = document.querySelectorAll(".filaTablero");

  // Comprobar que quedan intentos
  if (filaActual >= filas.length) {
    return;
  }

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  // COMPROBAR PALABRA COMPLETA

  if (letraActual < casillas.length) {
    alert("Completa la palabra antes de pulsar Enter.");

    return;
  }

  // CREAR PALABRA DEL USUARIO

  let palabraUsuario = "";

  for (let i = 0; i < casillas.length; i++) {
    palabraUsuario += casillas[i].textContent;
  }

  // Pasar a mayúsculas
  palabraUsuario = palabraUsuario.toUpperCase();

  // COMPROBAR SI HA GANADO

  if (palabraUsuario === palabra) {
    // Todas las letras verdes
    for (let i = 0; i < casillas.length; i++) {
      casillas[i].classList.add("correcta");
    }

    mostrarAlerta("¡Has acertado!");

    return;
  }

  // COMPROBAR LETRAS

  // Copia de la palabra secreta
  // para controlar letras repetidas
  let letrasDisponibles = palabra.split("");

  for (let i = 0; i < casillas.length; i++) {
    const letra = palabraUsuario[i];

    if (letra === palabra[i]) {
      casillas[i].classList.add("correcta");

      // Marcar la letra como utilizada
      letrasDisponibles[i] = null;
    }
  }

  for (let i = 0; i < casillas.length; i++) {
    // Si ya es correcta, no hacemos nada
    if (casillas[i].classList.contains("correcta")) {
      continue;
    }

    const letra = palabraUsuario[i];

    const posicion = letrasDisponibles.indexOf(letra);

    // La letra existe en otra posición
    if (posicion !== -1) {
      casillas[i].classList.add("presente");

      // Consumir esa letra
      letrasDisponibles[posicion] = null;
    }

    // La letra no existe
    else {
      casillas[i].classList.add("incorrecta");
    }
  }

  filaActual++;

  letraActual = 0;

  if (filaActual >= filas.length) {
    mostrarAlerta("Has perdido. La palabra era " + palabra + ".");
  }
});
