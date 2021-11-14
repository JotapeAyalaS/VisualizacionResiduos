var the_markers = [];

// Se define constante GLOBAL con referencia al Mapa
const mapEnergia = new mapboxgl.Map({
    container: 'MapaEnergia',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-70.380778312683, -23.586520272071],
    zoom: 7
});

function Energia(valor_max = 1000) {

    Plotly.d3.json("js/energia-region.json", function (err, json_data) {
        if (err) {
            console.log("Error al leer JSON", err);
            return;
        }

        for(idx_m = 0; idx_m < the_markers.length; idx_m++){
            the_markers[idx_m].remove();
        }

        console.log("JSON", json_data);

        // Agregar Marcadores.
        let communes_keys = json_data.length;
        /*
        [
         0 =   [0][1][2][3][4][5]...,
         1 =   [0][1][2][3][4][5]...,
         2 =   [0][1][2][3][4][5]...,
         3 =   [0][1][2][3][4][5]...,
         ....
         99 =  [0][1][2][3][4][5]...,
        ]
        */
        // communes_keys = 100
        for (let communes = 0; communes < communes_keys; communes++) {
            let distribuidor = json_data[communes];
            let nombre = distribuidor[2];
            let valor = parseInt(distribuidor[14]);

            if (valor < valor_max) {


                // Create a DOM element for each marker.
                const el = document.createElement('div');
                // <div class="marker" style="border-radius...></div>
                const width = 25;
                const height = 25;
                el.className = 'marker';
                el.style.borderRadius = "5px";
                el.style.backgroundImage = `url(${distribuidor[11]})`;
                el.style.width = `${width}px`;
                el.style.height = `${height}px`;
                el.style.backgroundSize = '100%';
                el.style.backgroundColor = 'green';
                /*
                if(json_data[communes].DATA["GASTO (M$)"] > json_data[communes].DATA["SALDO (M$)"]){
                    el.style.backgroundColor = 'red';
                }
                */

                el.addEventListener('click', () => {
                    let msg = `
                El distribuidor ${nombre}, \n
                tiene un valor de: ${valor}, \n
                Para la gasolina de 93 Octanos.
                `;
                    window.alert(msg);
                });

                console.log(nombre, valor, distribuidor[15], distribuidor[16]);

                // Add markers to the map.
                let mark = new mapboxgl.Marker(el)
                    .setLngLat([parseFloat(distribuidor[16]), parseFloat(distribuidor[15])])
                    .addTo(mapEnergia);
                
                the_markers.push(mark);
            }

        }

    })
}

Energia(2000);

document.getElementById("boton_filtrar").addEventListener("click", () => {
    let p_max = document.getElementById("precio_max");
    console.log("Precio MAX:", p_max);

    if (p_max.value > 100) {
        Energia(p_max.value)
    } else {
        alert("Debes indicar un precio máximo mayor a 100");
    }
})
