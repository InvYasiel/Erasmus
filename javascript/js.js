///Yasiel Hernández Rodríguez
var contenedor = document.getElementById("datos");

var markers = [];

var map = null;

var cargar = document.getElementById('Cargar');

cargar.addEventListener('click', filtrar, false);
///Funcion para limpiar el contenido despues de cargar los datos
function limpiar(){
    contenedor.innerHTML = '';
}
///Función para filtrar 
function filtrar() {
    contenedor.innerHTML = '';

    var tipoBusqueda = document.getElementById('tipoBusqueda');
    var tipoBusquedaValue = '';

    var tipoMovilidad = document.getElementById('tipoMovilidad');
    var tipoMovilidadValue = tipoMovilidad.value;
    var ar = []
    ///el toogle tiene la funcionalidad de un checked con lo cual vemos si esta o no checked y en tal caso filtramos por ciclo o pais
    if (tipoBusqueda.checked) {
        tipoBusquedaValue = 'ciclo'
    } else {
        tipoBusquedaValue = 'pais'
    }
    ///Si es pais
    if (tipoBusquedaValue == 'ciclo') {
        ///Bucle que recorre los elementos añadiendo a un array los ciclos del json usamos indexOf para que no se repitan y poder añadir 
        for (let i = 0; i < Erasmus.length; i++) {
            const element = Erasmus[i];
            if (element.tipo == tipoMovilidadValue) {
                if (ar.indexOf(element.ciclo) == -1) {
                    ar.push(element.ciclo);
                }
            }
        }
        ///Bucle que usa el array antes creado para añadir los ciclos con sus repectivos ckekbox 
        for (let i = 0; i < ar.length; i++) {
            const element = ar[i];
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "ciclos";
            checkbox.name = "ciclos";
            checkbox.value = element;
            var label = document.createElement('label')
            label.appendChild(document.createTextNode(element));

            contenedor.appendChild(checkbox);
            contenedor.appendChild(label);
            contenedor.appendChild(document.createElement("br"));
        }

    } else {
        ///Si no es ciclos significa que filtraremos por paises, usando un bucle para añadir al array los paises igual que como hicimos con los ciclos
        for (let i = 0; i < Erasmus.length; i++) {
            const element = Erasmus[i];
            if (element.tipo == tipoMovilidadValue) {
                if (ar.indexOf(element.pais) == -1) {
                    ar.push(element.pais);
                }
            }
        }
        ///creamos un select donde le añadiremos luego mediante un buble los países del json
        var select = document.createElement('select');
        select.id = 'pais';
        select.className = 'custom-select ciclos'
        contenedor.appendChild(select);
        for (let i = 0; i < ar.length; i++) {
            const element = ar[i];
            var opcion = document.createElement('option');
            opcion.value = element;
            opcion.innerText = element;
            select.appendChild(opcion);
        }
    }

}
///Pasamos ah agregar la api de GoogleMaps
var agregarMaps = document.getElementById('BuscarMaps');
var txt2 = document.getElementById('texto2');
agregarMaps.addEventListener('click', agregar, false);
///Agregamos los marcadores al hacer click en el boton de buscar
function agregar() {
    for (let i = 0; i < markers.length; i++) {
        const element = markers[i];
        element.setMap(null);
    }
    ///Para añadir nuevos marcadores tenemos que volver a filtrar como anteriormente hicimos
    var tipoBusqueda = document.getElementById('tipoBusqueda');
    var tipoBusquedaValue = '';

    var tipoMovilidad = document.getElementById('tipoMovilidad');
    var tipoMovilidadValue = tipoMovilidad.value;
    var ar = []

    if (tipoBusqueda.checked) {
        tipoBusquedaValue = 'ciclo'
    } else {
        tipoBusquedaValue = 'pais'
    }
    if (tipoBusquedaValue == 'ciclo') {
        ///Creamos un array de los elementos checkeados y agregamos al array "ar" cada elemnto
        var checked = document.querySelectorAll("input[name='ciclos']:checked");
        for (let i = 0; i < Erasmus.length; i++) {
            const element = Erasmus[i];
            if (element.tipo == tipoMovilidadValue) {
                for (let i = 0; i < checked.length; i++) {
                    const ciclo = checked[i].value;
                    if (element.ciclo == ciclo) {
                        ar.push(element);
                    }
                }
            }

        }

    } else {
        ///En el caso de que filtremos por paises añadimos el pais seleccionado al array "ar"
        var pais = document.getElementById('pais')
        console.log(pais.value)
        for (let i = 0; i < Erasmus.length; i++) {
            const element = Erasmus[i];
            if (element.tipo == tipoMovilidadValue && element.pais == pais.value) {
                ar.push(element);
            }
        }
        
    }
    txt2.innerHTML = ' ';
    ///Una vez tengamos en el array los elementos seleccionados para crear los marcadores 
    ///Procedemos a buscar dentro de ese array la ciudad y el país
    ///Gracias a geocoder podremos transformar esas la ciudad y el pais en las cordenadas pasandole una direccion "adress" 
    ///Pocicionará el marcador en las coordenadas, al marcador le añadimos una animación 
    ///Fuente: https://developers.google.com/maps/documentation/javascript/adding-a-google-map?hl=es-419
    for (let i = 0; i < ar.length; i++) {
        const element = ar[i];
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            "address": element.ciudad+', '+element.pais
        }, function (results) {
            var myCenter = new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
            var marker = new google.maps.Marker({position:myCenter,
                animation:google.maps.Animation.BOUNCE});
                
                ///Agregamos texto a los marcadores al hacer click
                marker.addListener('click', function mostrar() {
                    var Texto = "<h3>"+element.ciudad+"</h3>"+'<br>El ciclo es '+element.ciclo;
                    var infowindow = new google.maps.InfoWindow({
                        content: Texto,
                        timeout: 1000,
                      });
                      infowindow.open(map, marker);
                   ///He agregado un framework para notificaciones cada vez que hagamos click en un marcador aparecerá una notificación:
                   ///Al hacer click en la notificación se abrirá una ventana con la información del erasmus del Cesar Manrique
                   Push.create("Saber más" ,{
                    body: " CLICK AQUÍ ",
                    timeout: 2000,
                    onClick: function(){
                        window.open('https://cifpcesarmanrique.es/category/erasmus/')
                    }
                })
                });
            marker.setMap(map);
            markers.push(marker);
            
        });
    }
}
///cargar el mapa con las longitudes y el zoom que queremos que aparaezca desde un principio
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(48.0246288, 13.2086173, 16),
        zoom: 4,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

