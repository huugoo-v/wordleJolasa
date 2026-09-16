const botonJugar = document.getElementById("jugar");

botonJugar.addEventListener("click", function () {

    const contenedor = document.querySelector(".contenedor");
    const juegoBloque = document.querySelector(".juegoBloque");
    const teclado = document.querySelector(".teclado");

    contenedor.style.display = "none";
    juegoBloque.style.display = "block";
});
