if (mapboxgl) {
    const MAPBOX_KEY = "pk.eyJ1IjoianVhbnBhLWF5YWxhIiwiYSI6ImNrdjhyN3puajI2cnAydXFwMXA3YzlwMjUifQ.4Qamz6Wpdirrd1bvYbvgTw"; // Se debe obtener un Token desde Mapbox
    mapboxgl.accessToken = MAPBOX_KEY;

    // Se define constante GLOBAL con referencia al Mapa
    const map = new mapboxgl.Map({
        container: 'MapaRegion',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-70.627, -33.605],
        zoom: 6
    });

    Plotly.d3.json("js/residuos-region.json", function (err, json_data) {
        if (err) {
            console.log("Error al leer JSON", err);
            return;
        }


        console.log("JSON", json_data);

        // Agregar Marcadores.
        let regiones_keys = Object.keys(json_data);
        // communes_keys = ["VALPARAISO", "PETORCA", "LA LIGUA", "QUILLOTA", "LOS ANDES"]
        for (const regiones of regiones_keys) {
            // Create a DOM element for each marker.
            const el = document.createElement('div');
            // <div class="marker" style="border-radius...></div>
            const width = 25;
            const height = 25;
            el.className = 'marker';
            el.style.borderRadius = "5px";
            //el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = '100%';
            el.style.backgroundColor = 'brown';
            

            el.addEventListener('click', () => {
                let residuo = parseInt(json_data[regiones].DATA["RESIDUOS"]);
                let msg = `
                La Región de ${json_data[regiones].REGIÓN} \n
                tiene una generación de residuos de: ${residuo} toneladas \n
                `;
                window.alert(msg);
            });

            // Add markers to the map.
            new mapboxgl.Marker(el)
                .setLngLat([json_data[regiones].DATA.GEO_LON, json_data[regiones].DATA.GEO_LAT])
                .addTo(map);
        }

    })
}
