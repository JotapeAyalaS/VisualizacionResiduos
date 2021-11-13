// Cargar las librerías
const { log } = require("console"); // Para mensajes por consola (terminal)
const fs = require("fs"); // Para lecturas/escrituras de archivos
const path = require("path"); // Para acceso a directorios
const XLSX = require("xlsx"); // Para manejo de archivos Excel (XLS, XLSX)
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // Para generar archivo CSV

// Definir archivo de origen
const xlsx = path.resolve("src/ckan_muni_2019.xlsx"); // Obtiene la ruta absoluta al archivo

// Definir filtros
const REGION = ["Antofagasta", "Araucanía", "Arica y Parinacota", "Atacama", "Aysén del Gral. Carlos Ibáñez del Campo", "Biobío", "Coquimbo", "Libertador Gral. Bernardo O'Higgins", "Los Lagos", "Los Ríos", "Magallanes y de la Antártica Chilena", "Maule", "Metropolitana de Santiago", "Ñuble", "Tarapacá", "Valparaíso"];

// Definir la GEO-Posición por región
const GEO = {
    "Antofagasta": [-23.536, -69.119],
    "Araucanía": [-38.649, -72.275],
    "Arica y Parinacota": [-18.497, -69.628],
    "Atacama": [-27.396, -69.910],
    "Aysén del Gral. Carlos Ibáñez del Campo": [-46.415, -73.256],
    "Biobío": [-37.499, -72.394],
    "Coquimbo": [-30.619, -70.861],
    "Libertador Gral. Bernardo O'Higgins": [-34.435, -71.046],
    "Los Lagos": [-42.042, -72.896],
    "Los Ríos": [-40.004, -72.574],
    "Magallanes y de la Antártica Chilena": [-52.489, -71.879],
    "Maule": [-35.621, -71.446],
    "Metropolitana de Santiago": [-33.605, -70.627],
    "Ñuble": [-36.646, -71.975],
    "Tarapacá": [-20.216, -69.393],
    "Valparaíso": [-32.733, -71.388],
};

// Leer los datos del archivo origen
var buf = fs.readFileSync(xlsx); // Leer archivo
var wb = XLSX.read(buf, { type: 'buffer' }); // Interpreta el formato Excel desde la lectura
var hoja = wb.Sheets["ckan_muni_2019_02"]; // Accede a una hoja por su nombre, "Hoja1" por defecto al existir solo una
var hoja_json = XLSX.utils.sheet_to_json(hoja); // Convierte la hoja a formato JSON

// Muestra por consola el contenido de la primera fila
log("Encabezados en Hoja", hoja_json[0]);

// Preparar variable donde se mantendrá la transformación, en formato JSON
var output_data = {} // Objeto JSON "vacío", es decir sin datos

// Ciclo para recorrer todas las filas de la hoja
for (let idx = 0; idx < hoja_json.length; idx++) {
    /*
    obs: al recorrer cada fila, está se referencia por la variable "idx"
    hoja_json[idx] = [][][][]
    Extraer datos de acuerdo a filtros:
      - REGION
      - COMUNAS
    */
    let region_hoja = hoja_json[idx].Región; // Obtiene el valor de la columna REGION

    // Obtener el registro desde la variable donde se mantendrá la transformación
    let data_region = output_data[region_hoja];

    if (data_region) {
        // Si existe el registro, se aumentan los contadores
        data_region['DATA']['RESIDUOS'] += hoja_json[idx]['Cantidad (Toneladas)'];
    } else {
        // Al no existir registro, se establece los contadores
        data_region = {};
        data_region['REGIÓN'] = hoja_json[idx]['Región'];
        data_region['DATA'] = {};
        data_region['DATA']['RESIDUOS'] = hoja_json[idx]['Cantidad (Toneladas)'];
        data_region['DATA']['GEO_LAT'] = GEO[region_hoja][0];
        data_region['DATA']['GEO_LON'] = GEO[region_hoja][1];
    }

    // Se almacena en la variable la información procesada
    output_data[region_hoja] = data_region;
    
}

// Muestra por consola el contenido de información procesada
log("Data de Salida", output_data);

/*
Generar archivo JSON
*/
// Definir archivo de salida (JSON)
const json_file = path.resolve("docs/js/residuos-region.json");
// Guardar en JSON los datos transformados 
fs.writeFileSync(json_file, JSON.stringify(output_data));
