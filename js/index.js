"use strict";

// elementos

const botonJugar = document.getElementById("jugar");

const contenedor = document.querySelector(".contenedor");

const juegoBloque = document.querySelector(".juegoBloque");

const teclado = document.querySelector(".teclado");

const tablero = document.getElementById("tablero");

const botonEnter = document.getElementById("enter");

const botonDel = document.getElementById("del");

const alerta = document.getElementById("alerta");

const mensajeAlerta = document.getElementById("mensajeAlerta");

const historial = document.getElementById("historial");

const botonReiniciar = document.getElementById("reiniciar");

// teclas

const teclas = document.querySelectorAll(".teclado button");

// variables

let filaActual = 0;

let letraActual = 0;

let palabra = "";

let intentosRealizados = [];

// boton jugar

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
      // guardar palabra

      palabra = datos[0].toUpperCase();

      console.log("Palabra:", palabra);

      // ocultar pantalla inicial

      contenedor.style.display = "none";

      // mostrar juego

      juegoBloque.style.display = "block";

      teclado.style.display = "flex";

      // limpiar tablero

      tablero.innerHTML = "";

      // reiniciar variables

      filaActual = 0;

      letraActual = 0;

      intentosRealizados = [];

      // limpiar colores teclado

      teclas.forEach(function (tecla) {
        tecla.classList.remove("correcta");

        tecla.classList.remove("presente");

        tecla.classList.remove("incorrecta");
      });

      // crear tablero

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

// mostrar alerta

function mostrarAlerta(mensaje) {
  mensajeAlerta.textContent = mensaje;

  alerta.style.display = "flex";
}

// escribir letra

function escribirLetra(letra) {
  const filas = document.querySelectorAll(".filaTablero");

  if (filaActual >= filas.length) {
    return;
  }

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  if (letraActual >= casillas.length) {
    return;
  }

  casillas[letraActual].textContent = letra;

  letraActual++;
}

// borrar letra

function borrarLetra() {
  if (letraActual === 0) {
    return;
  }

  const filas = document.querySelectorAll(".filaTablero");

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  letraActual--;

  casillas[letraActual].textContent = "";
}

// buscar tecla

function buscarTecla(letra) {
  let teclaEncontrada = null;

  teclas.forEach(function (tecla) {
    if (tecla.textContent.toUpperCase() === letra) {
      teclaEncontrada = tecla;
    }
  });

  return teclaEncontrada;
}

// actualizar teclado

function actualizarTeclado(palabraUsuario) {
  const letrasDisponibles = palabra.split("");

  // letras correctas

  for (let i = 0; i < palabra.length; i++) {
    const letra = palabraUsuario[i];

    const tecla = buscarTecla(letra);

    if (tecla === null) {
      continue;
    }

    if (letra === palabra[i]) {
      tecla.classList.remove("presente");

      tecla.classList.remove("incorrecta");

      tecla.classList.add("correcta");

      letrasDisponibles[i] = null;
    }
  }

  // letras presentes o incorrectas

  for (let i = 0; i < palabra.length; i++) {
    const letra = palabraUsuario[i];

    const tecla = buscarTecla(letra);

    if (tecla === null) {
      continue;
    }

    if (tecla.classList.contains("correcta")) {
      continue;
    }

    const posicion = letrasDisponibles.indexOf(letra);

    if (posicion !== -1) {
      tecla.classList.remove("incorrecta");

      tecla.classList.add("presente");

      letrasDisponibles[posicion] = null;
    } else {
      if (!tecla.classList.contains("presente")) {
        tecla.classList.add("incorrecta");
      }
    }
  }
}

// guardar partida

function guardarPartida(ganada) {
  const partida = {
    palabra: palabra,

    intentos: intentosRealizados,

    fecha: new Date().toLocaleString(),

    resultado: ganada ? "Ganada" : "Perdida",
  };

  let partidas = JSON.parse(localStorage.getItem("partidasWordle")) || [];

  partidas.unshift(partida);

  partidas = partidas.slice(0, 10);

  localStorage.setItem("partidasWordle", JSON.stringify(partidas));
}

// mostrar historial

function mostrarHistorial() {
  const partidas = JSON.parse(localStorage.getItem("partidasWordle")) || [];

  historial.innerHTML = "";

  if (partidas.length === 0) {
    historial.innerHTML = "<p>No hay partidas anteriores.</p>";

    return;
  }

  const titulo = document.createElement("h3");

  titulo.textContent = "Últimas partidas";

  historial.appendChild(titulo);

  partidas.forEach(function (partida) {
    const elemento = document.createElement("div");

    elemento.classList.add("partida");

    elemento.innerHTML =
      "<strong>Fecha:</strong> " +
      partida.fecha +
      "<br><strong>Palabra:</strong> " +
      partida.palabra +
      "<br><strong>Intentos:</strong> " +
      partida.intentos.join(", ") +
      "<br><strong>Resultado:</strong> " +
      partida.resultado;

    historial.appendChild(elemento);
  });
}

// terminar partida

function terminarPartida(ganada) {
  guardarPartida(ganada);

  // ocultar tablero

  juegoBloque.style.display = "none";

  // ocultar teclado

  teclado.style.display = "none";

  // mostrar resultado

  if (ganada) {
    mensajeAlerta.textContent = "¡Has acertado! La palabra era " + palabra + ".";
  } else {
    mensajeAlerta.textContent = "Has perdido. La palabra era " + palabra + ".";
  }

  // mostrar historial

  mostrarHistorial();

  // mostrar alerta

  alerta.style.display = "flex";
}

// comprobar intento

function comprobarIntento() {
  const filas = document.querySelectorAll(".filaTablero");

  if (filaActual >= filas.length) {
    return;
  }

  const casillas = filas[filaActual].querySelectorAll(".casilla");

  // comprobar palabra completa

  if (letraActual < casillas.length) {
    alert("Completa la palabra antes de pulsar Enter.");

    return;
  }

  // crear palabra usuario

  let palabraUsuario = "";

  for (let i = 0; i < casillas.length; i++) {
    palabraUsuario += casillas[i].textContent;
  }

  palabraUsuario = palabraUsuario.toUpperCase();

  // guardar intento

  intentosRealizados.push(palabraUsuario);

  // comprobar palabra correcta

  if (palabraUsuario === palabra) {
    for (let i = 0; i < casillas.length; i++) {
      casillas[i].classList.add("correcta");
    }

    actualizarTeclado(palabraUsuario);

    terminarPartida(true);

    return;
  }

  // letras disponibles

  const letrasDisponibles = palabra.split("");

  // letras correctas

  for (let i = 0; i < casillas.length; i++) {
    const letra = palabraUsuario[i];

    if (letra === palabra[i]) {
      casillas[i].classList.add("correcta");

      letrasDisponibles[i] = null;
    }
  }

  // letras presentes o incorrectas

  for (let i = 0; i < casillas.length; i++) {
    if (casillas[i].classList.contains("correcta")) {
      continue;
    }

    const letra = palabraUsuario[i];

    const posicion = letrasDisponibles.indexOf(letra);

    if (posicion !== -1) {
      casillas[i].classList.add("presente");

      letrasDisponibles[posicion] = null;
    } else {
      casillas[i].classList.add("incorrecta");
    }
  }

  // actualizar teclado

  actualizarTeclado(palabraUsuario);

  // siguiente fila

  filaActual++;

  letraActual = 0;

  // comprobar derrota

  if (filaActual >= filas.length) {
    terminarPartida(false);
  }
}

// teclado virtual

teclas.forEach(function (tecla) {
  tecla.addEventListener("click", function () {
    if (tecla.id === "enter") {
      comprobarIntento();

      return;
    }

    if (tecla.id === "del") {
      borrarLetra();

      return;
    }

    const letra = tecla.textContent.toUpperCase();

    escribirLetra(letra);
  });
});

// teclado fisico

document.addEventListener("keydown", function (event) {
  if (juegoBloque.style.display !== "block") {
    return;
  }

  const tecla = event.key.toUpperCase();

  if (/^[A-ZÑÁÉÍÓÚÜ]$/.test(tecla)) {
    escribirLetra(tecla);

    return;
  }

  if (event.key === "Enter") {
    comprobarIntento();

    return;
  }

  if (event.key === "Backspace") {
    borrarLetra();

    return;
  }
});

// boton enter

botonEnter.addEventListener("click", function () {
  comprobarIntento();
});

// boton delete

botonDel.addEventListener("click", function () {
  borrarLetra();
});

// boton reiniciar

botonReiniciar.addEventListener("click", function () {
  // ocultar alerta

  alerta.style.display = "none";

  // mostrar pantalla inicial

  contenedor.style.display = "flex";

  // ocultar juego

  juegoBloque.style.display = "none";

  // ocultar teclado

  teclado.style.display = "none";

  // limpiar tablero

  tablero.innerHTML = "";

  // reiniciar variables

  filaActual = 0;

  letraActual = 0;

  palabra = "";

  intentosRealizados = [];

  // limpiar teclado

  teclas.forEach(function (tecla) {
    tecla.classList.remove("correcta");

    tecla.classList.remove("presente");

    tecla.classList.remove("incorrecta");
  });
});
