function generarColorHSL() {
  const h = Math.round(Math.random() * 360);
  return "hsl(" + h + ", 90%, 35%)";
}

function hslToHex(h, s, l) {
    l = l / 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = function (n) {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, "0");
    };
    return "#" + f(0) + f(8) + f(4);
}

function crearSwatch(colorHSL, colorHEX, nombre, bloqueadoInicial = false) {
  const swatch = document.createElement("article");
  swatch.className = "swatch";

  const color = document.createElement("div");
  color.className = "swatch__color";
  color.style.background = colorHSL;

  const candado = document.createElement("button");
  candado.className = "candado";
  candado.textContent = "🔓";
  let bloqueado = bloqueadoInicial;

  if (bloqueado) {
    candado.textContent = "🔐";  
    swatch.style.outline = "4px solid gold"; 
    swatch.dataset.bloqueado = true;
  }

  candado.addEventListener("click", (event) => {
    event.stopPropagation();

    bloqueado = !bloqueado;
    swatch.dataset.bloqueado = bloqueado;

    if (bloqueado) {
        candado.textContent = "🔐";  
        swatch.style.outline = "4px solid gold"; 
    } else {
        candado.textContent = "🔓";
        swatch.style.outline = "none";
    }
  });

  const info = document.createElement("div");
  info.className = "swatch__info";
  
  const elNombre = document.createElement("p");
  elNombre.className = "swatch__nombre";
  elNombre. textContent = nombre;

  const elCodigo = document.createElement("p");
  elCodigo.className = "swatch__codigo";
  
  if (colorHEX === colorHSL) {
    elCodigo.textContent = colorHEX;
  } else {
    elCodigo.textContent = colorHEX + " . " + colorHSL;
  }

  info.append(elNombre, elCodigo);
  
  swatch.append(candado, color, info);

  swatch.addEventListener("click", function () {
    navigator.clipboard.writeText(colorHEX);
    const toast = document.getElementById("toast");

    toast.textContent = "✔ COLOR COPIADO: " + colorHEX;
    toast.classList.add("mostrar");

    setTimeout(function () {
      toast.classList.remove("mostrar");
    }, 3000);
  });

  return swatch;
}

function generarColor() {
  const h = Math.round(Math.random() * 360);
  const hsl = "hsl(" + h + ", 90%, 35%)";
  const hex = hslToHex(h, 70, 60);

  return { hsl: hsl, hex: hex };
}

const galeria = document.getElementById("galeria");

function renderPaleta(cantidad) {
    
    const bloqueados = [];

    document.querySelectorAll(".swatch").forEach((swatch, index) => {
        if (swatch.dataset.bloqueado === "true") {
            const color =
                swatch.querySelector(".swatch__color").style.background;

            bloqueados.push({
              indice: index,
              color: color   
            });
        }
    });

    galeria.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {

        const bloqueado = bloqueados.find(
          item => item.indice === i
        );

        if (bloqueado) {

            const swatch = crearSwatch(
                bloqueado.color,
                bloqueado.color,
                "Color" + (i + 1),
                true
            );

            galeria.appendChild(swatch);

        } else {

            const color = generarColor();

            const swatch = crearSwatch(
                color.hsl,
                color.hex,
                "Color" + (i + 1)
            );

            galeria.appendChild(swatch);
        }
    }
}

const boton = document.getElementById("generar");
const botonGuardar = document.getElementById("guardar");
const selector = document.getElementById("cantidad");
const linkGuardadas = document.querySelector('a[href="#guardadas"]');
const titulo = document.getElementById("titulo");

if (boton) {
  boton.addEventListener("click", function () {
    titulo.textContent = "Crea tu paleta aleatoria";

    const cantidad = Number(selector.value);
    renderPaleta(cantidad);
});

} else {
    console.log("No encontre el boton generar");
}

botonGuardar.addEventListener("click", function () {
    const colores = [];

    document.querySelectorAll(".swatch__color").forEach((swatch) => {
        colores.push(swatch.style.background);
    });

    localStorage.setItem(
        "paletaGuardada",
        JSON.stringify(colores)
    );

    const toast = document.getElementById("toast");

    toast.textContent = "✔ Paleta Guardada"
    toast.classList.add("mostrar");

    setTimeout(function () {
        toast.classList.remove("mostrar");
    }, 3000);
});

linkGuardadas.addEventListener("click", function (event) {
    event.preventDefault();

    titulo.textContent = "Paleta Guardada";

    const paleta = JSON.parse(
        localStorage.getItem("paletaGuardada")
    );

    galeria.innerHTML = "";

    paleta.forEach((colorGuardado, index) => {
        
        const swatch = crearSwatch(
            colorGuardado,
            colorGuardado,
            "Color" + (index + 1)
        );

        galeria.appendChild(swatch);
    });
});

const linkGenerador = document.querySelector('a[href="#generador"]');

linkGenerador.addEventListener("click", function (event) {
    event.preventDefault();

    titulo.textContent = "Crea tu paleta aleatoria";

    const cantidad = Number(selector.value);

    renderPaleta(cantidad);
});

selector.addEventListener("change", function () {
    const cantidad = Number(selector.value);
    renderPaleta(cantidad);
})

renderPaleta(6);


