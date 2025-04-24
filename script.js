const CATEGORIAS = {
    altura: {
      "sumamente apto": { min: 400, max: 800 },
      "moderadamente apto": [{ min: 0, max: 400 }, { min: 801, max: 999 }],
      "marginalmente apto": { min: 1000, max: 1200 },
      "no apto": { min: 1201, max: Infinity }
    },
    profundidad: {
      "sumamente apto": { min: 100, max: Infinity },
      "moderadamente apto": { min: 50, max: 100 },
      "marginalmente apto": { min: 25, max: 50 },
      "no apto": { min: 0, max: 25 }
    }
  };

  let numTerrenos = 0;
  let terrenos = [];
  
  document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('iniciar').addEventListener('click', iniciarAnalisis);
      document.getElementById('calcular').addEventListener('click', calcularResultados);
  });
  function iniciarAnalisis() {
    numTerrenos = parseInt(document.getElementById('lecturas').value);
    
    if (isNaN(numTerrenos) || numTerrenos < 1) {
        alert('Por favor ingrese un número válido de terrenos');
        return;
    }
    
    const container = document.getElementById('terrenos-container');
    container.innerHTML = '';
    container.classList.remove('hidden');
    
    for (let i = 0; i < numTerrenos; i++) {
        container.innerHTML += `
            <div class="terreno">
                <h3>Terreno ${i + 1}</h3>
                <label>Altura (m.s.n.m):</label>
                <input type="number" class="altura" step="0.01">
                
                <label>Profundidad efectiva (cm):</label>
                <input type="number" class="profundidad" step="0.01">
            </div>
        `;
    }
    
    document.getElementById('calcular').classList.remove('hidden');
}
function clasificar(valor, tipo) {
    const categorias = CATEGORIAS[tipo];
    
    for (const [categoria, rangos] of Object.entries(categorias)) {
        if (Array.isArray(rangos)) {
            for (const rango of rangos) {
                if (valor >= rango.min && valor <= rango.max) {
                    return categoria;
                }
            }
        } else {
            if (valor >= rangos.min && valor <= rangos.max) {
                return categoria;
            }
        }
    }
    
    return "no apto"; 
}
function clasificar(valor, tipo) {
    const categorias = CATEGORIAS[tipo];
    
    for (const [categoria, rangos] of Object.entries(categorias)) {
        if (Array.isArray(rangos)) {
            for (const rango of rangos) {
                if (valor >= rango.min && valor <= rango.max) {
                    return categoria;
                }
            }
        } else {
            if (valor >= rangos.min && valor <= rangos.max) {
                return categoria;
            }
        }
    }
    
    return "no apto"; 
}
function calcularResultados() {
    const terrenosDivs = document.querySelectorAll('.terreno');
    terrenos = [];
    
    terrenosDivs.forEach(terrenoDiv => {
        const altura = parseFloat(terrenoDiv.querySelector('.altura').value);
        const profundidad = parseFloat(terrenoDiv.querySelector('.profundidad').value);
        
        if (isNaN(altura) || isNaN(profundidad)) {
            alert('Por favor complete todos los campos correctamente');
            return;
        }
        
        terrenos.push({ altura, profundidad });
    });
    
    const resultados = procesarTerrenos(terrenos);
    mostrarResultados(resultados);
}
function procesarTerrenos(terrenos) {
    let sumaAlturas = 0;
    let sumaProfundidades = 0;
    const conteoCategorias = {
        "sumamente apto": 0,
        "moderadamente apto": 0,
        "marginalmente apto": 0,
        "no apto": 0
    };
    
    terrenos.forEach(terreno => {
        sumaAlturas += terreno.altura;
        sumaProfundidades += terreno.profundidad;
        
        const catAltura = clasificar(terreno.altura, 'altura');
        const catProfundidad = clasificar(terreno.profundidad, 'profundidad');
        const categoriaFinal = determinarPeorCategoria(catAltura, catProfundidad);
        
        conteoCategorias[categoriaFinal]++;
    });
    
    return {
        promedioAltura: sumaAlturas / terrenos.length,
        promedioProfundidad: sumaProfundidades / terrenos.length,
        categorias: conteoCategorias
    };
}
function determinarPeorCategoria(cat1, cat2) {
    const prioridad = {
        "no apto": 0,
        "marginalmente apto": 1,
        "moderadamente apto": 2,
        "sumamente apto": 3
    };
    
    return prioridad[cat1] < prioridad[cat2] ? cat1 : cat2;
}
function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById('resultados-contenido');
    resultadosDiv.innerHTML = `
        <p><strong>Promedio de altura:</strong> ${resultados.promedioAltura.toFixed(2)} m.s.n.m</p>
        <p><strong>Promedio de profundidad:</strong> ${resultados.promedioProfundidad.toFixed(2)} cm</p>
        <h3>Conteo de categorías:</h3>
        <ul>
            <li>Sumamente apto: ${resultados.categorias["sumamente apto"]}</li>
            <li>Moderadamente apto: ${resultados.categorias["moderadamente apto"]}</li>
            <li>Marginalmente apto: ${resultados.categorias["marginalmente apto"]}</li>
            <li>No apto: ${resultados.categorias["no apto"]}</li>
        </ul>
    `;
    
    document.getElementById('resultados').classList.remove('hidden');
}