//Dirección web api
const url = "services/DatosMapas";
//Variables inicialización API
var map;
var marker;
var marker_busqueda;
var dibujo;
var circle; 
var option = ['marker','circle'];
//Variables inicialización API modificar mapa
var map_e;
var marker_e;
var dibujo_e;
var circle_e; 

//Verifica el cambio de centro de un circulo.
var cambio = false;
//Verifica que solo una ventana infowindows este abierta
//circle
var prev_infowindow_c = false; 
//marker
var prev_infowindow_m = false; 
//
var autocomplete;
//Marker icon
var marker_icon;
/**
*  Load
*/
(MostrarDatos)();

/**
* Inicializacion API google maps
*/
function initMap() {
    //Creación mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 4.710988599999999, lng:  -74.072092 },
        zoom:12,
        mapTypeControl: false,
        streetViewControl:true
    });
    //Creación marca
    marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        //Habilita arrastre 
        draggable: true,
        //Habilita evento click
        clickable: true
    });
    //Creación circulo
    circle = new google.maps.Circle({
        //Color del borde
        strokeColor: '#FF0000',
        //Opacidad del borde
        strokeOpacity: 0.8,
        //Ancho borde
        strokeWeight:2,
        //Color de relleno
        fillColor: '#FF0000',
        //Habilita evento click
        clickable: true,
        //
        editable: true,
        //Habilita arrastre 
        draggable: true
    });
    // 
    dibujo = new google.maps.drawing.DrawingManager({

        drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
        ],
        drawingControl: true,
        drawingControlOptions: {
            //Posición del cuadro de herramientas drawing
            position: google.maps.ControlPosition.TOP_CENTER,
            //Opciones de dibujo
            drawingModes: ['marker', 'circle']
        },
        markerOptions: marker,
        circleOptions: circle
    });
    //
    google.maps.event.addListener(dibujo, 'overlaycomplete', function(event) {
        
        //Deshabilita modo de dibujo
        dibujo.setDrawingMode(null); 

        if (event.type == 'circle') {
            //Asigna las propiedades a la variable circle
            circle = event.overlay;

            $("#radio").val(parseInt(circle.getRadius()));
            $("#geographic").val(circle.getCenter());

            setRadiusCircle(parseInt(circle.getRadius()),'radio','geographic',circle);
            //Toma la posición en la que se encuentra el valor circle
            let index = option.indexOf('circle');
            //elimina el valor circle del array 
            delete option[index];

        }else if(event.type == 'marker'){
            let index = option.indexOf('marker');
            delete option[index];
            //Deshabilita modo de dibujo
            dibujo.setDrawingMode(null); 
            //Asigna las propiedades a la variable marker
            marker = event.overlay;

            if(marker_busqueda){
                //Elimina la marca creada por el campo de busqueda.
                marker_busqueda.setMap(null);
                $('#autocomplete').val('');
            }

            let position = (event.overlay.getPosition().toString());
            let str = position.split(",");
            let lat = str[0].substring(1, str[0].length);
            let lng = str[1].substring(0, str[1].length - 1);
            $("#lat").val(lat);
            $("#lng").val(lng);   

            //Retorna un JSON con las direcciones cercanas a las coordenadas dadas.
            let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng;
            
            getDirections(geocoding).then(function(data){
                $("#direccion").val(data.results[0].formatted_address);
            });
        }//fin else 
        dibujo.setOptions({ drawingControlOptions: {
            //Posición del cuadro de herramientas drawing
            position: google.maps.ControlPosition.TOP_CENTER,
            //Opciones de dibujo
            drawingModes: option
        }});
        //Reinicia array {filter devuelve un nuevo array con los elementos que cumnplen la condición}
        option = option.filter(function(){return true;});
    });//Fin overlaycomplete
    //
    google.maps.event.addListener(marker,'click',function(event) {
        let p = confirm('¿Esta seguro de eliminar esta marca?');
        if(p){
            marker.setMap(null);
            option.push('marker');
            $("#lat").val('');
            $("#lng").val('');
            $('#direccion').val('');

            dibujo.setOptions({ 
                drawingControlOptions: 
                    {//Posición del cuadro de herramientas drawing
                        position: google.maps.ControlPosition.TOP_CENTER,
                        //Opciones de dibujo
                        drawingModes: option}
            });
        }
    });
    //evento de arrastre
    google.maps.event.addListener(marker,'dragend',function(event) {
        $("#lat").val(event.latLng.lat());
        $("#lng").val(event.latLng.lng());

        
        let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng();
            
        getDirections(geocoding).then(function(data){
            $("#direccion").val(data.results[0].formatted_address);
        }).catch (function(error){});
    });
    //
    google.maps.event.addListener(circle, 'radius_changed', function(){
        let radius = parseInt(circle.getRadius());
        $("#radio").val(radius);
        
        setRadiusCircle(radius,'radio','geographic',circle);
    });
    //
    google.maps.event.addListener(circle,'center_changed',function(){
        $("#geographic").val(circle.getCenter());
    });
    //
    google.maps.event.addListener(circle,'click',function(){
        let p = confirm('¿Esta seguro de eliminar este circulo?');
        if(p){
            circle.setMap(null);
            option.push('circle');
            dibujo.setOptions({ 
                drawingControlOptions: 
                    {//Posición del cuadro de herramientas drawing
                     position: google.maps.ControlPosition.TOP_CENTER,
                    //Opciones de dibujo
                    drawingModes: option}
            });
            $("#radio").val('');
        }
    });
    //
    dibujo.setMap(map);
}
/**
* Inicializacion API google maps
*/
function initMap_e(lat_m,lng_m,radio_c,lat_c,lng_c) {
    //
    var myLatLng = {lat: lat_m, lng:lng_m};

    map_e = new google.maps.Map(document.getElementById('map_e'), {
        center: myLatLng,
        zoom:12
    });
    //
    marker_e = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        //Habilita arrastre 
        draggable: true,
        //Habilita evento click
        clickable: false,
        //
        position:myLatLng
    });
    //
    circle_e = new google.maps.Circle({
        //
        strokeColor: '#FF0000',
        //
        strokeOpacity: 0.8,
        //
        strokeWeight: 2,
        //
        fillColor: '#FF0000',
        //
        clickable: false,
        //
        editable: true,
        //
        draggable: true,
        radius: radio_c,
        center:{lat: lat_c, lng: lng_c}
    });
    //
    google.maps.event.addListener(marker_e,'dragend',function(event) {

        $("#lat_e").val(event.latLng.lat());
        $("#lng_e").val(event.latLng.lng());

        
        let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng();
            
        getDirections(geocoding).then(function(data){
            $("#direccion_e").val(data.results[0].formatted_address);
        }).catch (function(error){});
    });
    //
    google.maps.event.addListener(circle_e, 'radius_changed', function(){
        let radius = parseInt(circle_e.getRadius());
        $("#radio_e").val(radius);
        setRadiusCircle(radius,'radio_e','geographic_e',circle_e);
    });
    //
    google.maps.event.addListener(circle_e,'center_changed',function(){
        $("#geographic_e").val(circle_e.getCenter());
        cambio = true;
    });
    circle_e.setMap(map_e);
    marker_e.setMap(map_e);
}
/**
*
*/
async function initMap_todos(){
    let data = await GetDatos()
    .then(function(data){
        return data;
    });
    
    if(data != null){
        let map_t = new google.maps.Map(document.getElementById('map_t'), {
            center:{lat: 4.710988599999999, lng:  -74.072092 },
            zoom: 6
        });
        var cont = 0;
        for(let i in data){

            let str = data[i].Geographic.Geography.WellKnownText;
            let geo = str.substring(6,str.length); 
            let str_geo = geo.split(' ');
            let lat_c=  parseFloat(str_geo[0].substring(1, str_geo[0].length).replace(",", "."));
            let lng_c  = parseFloat(str_geo[1].substring(0, str_geo[1].length - 1).replace(",", "."));

            let circle_t = new google.maps.Circle({
                //
                strokeColor: '#FF0000',
                //
                strokeOpacity: 0.8,
                //
                strokeWeight: 2,
                //
                fillColor: '#FF0000',
                //
                clickable: true,
                //
                editable: false,
                //
                draggable: false,
                map: map_t,
                center:{lat: lat_c, lng: lng_c},
                radius: data[i].Radio
                
            }); 
            let image = {
                url: "../Image/flecha.abajo.png",
                //size: new google.maps.Size(200, 320)
            }
            let marker_t = new google.maps.Marker({

                animation: google.maps.Animation.DROP,
                draggable: false,
                clickable: true,
                title: data[i].Nombre,
                position:{lat: data[i].Lat, lng: data[i].Lng},
              //  icon: image,
                map: map_t
            });
            let contentMarker = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent">'+
            '<p><label>Nombre:</label> '
             +data[i].Nombre+
             '<br /><label>Descripción:</label> '
             +data[i].Descripcion+
            '<br /><label>Latitud:</label> '+data[i].Lat+
            '<br /><label>Longitud:</label> '+data[i].Lng+
            '<br /><label>Dirección:</label> '+data[i].Direccion+'</p>'+
            '</div>'+
            '</div>';

            let contentCircle = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent">'+
            '<p><label>Radio:</label> '+data[i].Radio+ 
            '<br /><label>Latitud:</label> '+lat_c+ 
            '<br /><label>Longitud:</label> '+lng_c+
            '<br /><label>Dirección:</label> '+data[i].Direccion+'</p>'+
            '</div>'+
            '</div>';

            let InfoWindowMarker = new google.maps.InfoWindow({
                content: contentMarker,
                maxWidth: 200
            });
            let InfoWindowCircle = new google.maps.InfoWindow({
                content: contentCircle,
                maxWidth: 200
            });

            marker_t.addListener('click',function(){
                //verifica si hay una ventana info
                if( prev_infowindow_m ) {
                    prev_infowindow_m.close();
                    prev_infowindow_c.close();
                }

                prev_infowindow_m = InfoWindowMarker;
                prev_infowindow_c = InfoWindowCircle;
                //Abre ventana info marker
                InfoWindowMarker.open(map_t, marker_t);

                //Abre ventana info circle
                InfoWindowCircle.setPosition({lat: lat_c, lng: lng_c});
                InfoWindowCircle.open(map_t);
                //Cambio zoom
                map_t.setCenter({lat: lat_c, lng: lng_c});
                map_t.setZoom(14);

                marker_icon = marker_t; 
            });
            circle_t.addListener('click',function(ev){
                //verifica si hay una ventana info
                if( prev_infowindow_c ) {
                    prev_infowindow_c.close();
                }

                prev_infowindow_c = InfoWindowCircle;
                //Abre ventana info circle
                InfoWindowCircle.setPosition(ev.latLng);
                InfoWindowCircle.open(map_t);
            });
        }
    }else{
        alert('No hay datos disponibles');
        location.reload();
    }
}
/**
*
*/
function initAutocomplete(){
    try{
        autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types:['address']});
        autocomplete.addListener('place_changed', search);
    }catch(err){
        alert(err);
    }
    
}
/**
*
*/
function search(){
    try{
        let place = autocomplete.getPlace();
        let lat = place.geometry.location.lat;
        let lng = place.geometry.location.lng;
        $('#lat').val(lat);
        $('#lng').val(lng);
        $('#direccion').val(place.formatted_address);
        if(marker){
            marker.setMap(null);
        }
        if(marker_busqueda){
            marker_busqueda.setMap(null);
        }
        marker_busqueda = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            //Habilita arrastre 
            draggable: true,
            //Habilita evento click
            clickable: false,
            //
            position: place.geometry.location,
            map:map
        });
        marker_busqueda.addListener('click',function(event) {
            let p = confirm('¿Esta seguro de eliminar esta marca?');
            if(p){
                marker_busqueda.setMap(null);
                option.push('marker');
                $("#lat").val('');
                $("#lng").val('');
                $('#direccion').val('');

                dibujo.setOptions({ 
                    drawingControlOptions: 
                        {//Posición del cuadro de herramientas drawing
                            position: google.maps.ControlPosition.TOP_CENTER,
                            //Opciones de dibujo
                            drawingModes: option}
                });
            }
        });
        //
        marker_busqueda.addListener('dragend',function(event) {
            $("#lat").val(event.latLng.lat());
            $("#lng").val(event.latLng.lng());

        
            let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng();
            
            getDirections(geocoding).then(function(data){
                $("#direccion").val(data.results[0].formatted_address);
            }).catch (function(error){});
        });

        map.setCenter(place.geometry.location);
        map.setZoom(12);

        let index = option.indexOf('marker');
        delete option[index];

        dibujo.setOptions({ drawingControlOptions: {
            //Posición del cuadro de herramientas drawing
            position: google.maps.ControlPosition.TOP_CENTER,
            //Opciones de dibujo
            drawingModes: option
        }});
        //Reinicia array {filter devuelve un nuevo array con los elementos que cumnplen la condición}
        option = option.filter(function(){return true;});

    }catch(e){
        alert(e);
    }
   
}
/**
*
*/
async function searchMapa(){

    let data = await GetDatos();
    let buscar = $('#buscarMapa').val();

    if(data != null){

        let array = data.filter( (x) => {
            if(x.Nombre == buscar){
                return x;
            }
        });

        limpiarTabla();

        if(array.length != 0){
            for(var i in  array){
                $('#table-content').append(`<tr><td>${array[i].IdMapa}</td><td>${array[i].Nombre}</td><td>${array[i].Descripcion}</td><td>${array[i].Lat}</td><td>${array[i].Lng}</td><td>${array[i].Direccion}</td><td>${array[i].Radio}</td><td>${array[i].FechaCreacion}</td><td><button type="button" class="btn btn-danger" id="${array[i].IdMapa}" onclick="EliminarMapa(this.id)"><i class="fa fa-trash-o"></i></button><button id="${array[i].IdMapa}" onclick="CargarMapa(this.id)" class="btn btn-warning"><i class="fa fa-edit"></i></button></td></tr>`);
            }
        }else{
            $('#table-content').append(`<tr class="alert alert-warning"><td colspan="10" align="center">No hay coincidencias</td></tr>`);
        }

    }else{
        alert('No hay datos disponibles');
    }
}
/**
* Muestra los datos existentes en la base de datos
* consumiendo el WEB API
*/
function MostrarDatos(){
    var table = $('#table-content');
    GetDatos()
    .then(function(data){
        if(data!=null){
            for(var i in  data){
                $('#table-content').append(`<tr><td>${data[i].IdMapa}</td><td>${data[i].Nombre}</td><td>${data[i].Descripcion}</td><td>${data[i].Lat}</td><td>${data[i].Lng}</td><td>${data[i].Direccion}</td><td>${data[i].Radio}</td><td>${data[i].FechaCreacion}</td><td><button type="button" class="btn btn-danger" id="${data[i].IdMapa}" onclick="EliminarMapa(this.id)"><i class="fa fa-trash-o"></i></button><button id="${data[i].IdMapa}" onclick="CargarMapa(this.id)" class="btn btn-warning"><i class="fa fa-edit"></i></button></td></tr>`);
            }
        }else{
                 $('#table-content').append(`<tr class="alert alert-warning"><td colspan="10" align="center">No hay resultados disponibles</td></tr>`);
        }    
        document.getElementById('loader').setAttribute('hidden', 'true');
    })
   listMapa();
}
/**
* Obtiene los datos del WB API por medio de GET
*/
async function GetDatos(){
    try {
        const respuesta = await fetch(url).then(estado)
        /*
        if(!respuesta.status >= 200 && !respuesta.status < 300){
            throw Error(respuesta.statusText);
        }*/
        
        var data = await respuesta;

        if(data.status != 204){
            data = data.json();
        }else{
            return null;
        }

        return data;

    } catch (e) {
        alert(e.message);
    }  
}
/**
*
*/
async function AgregarMapa() {

    try {
        let nombre = $('#nombre').val();
        let descripcion = $('#descripcion').val();
        let lat = $('#lat').val();
        let lng = $('#lng').val();
        let radio = $('#radio').val();
        let direccion = $('#direccion').val();

        let geographic = $('#geographic').val();

        let expreg = new RegExp('^[A-Z a-z\sáéíóúñ.,_\]*$');
        let expreg1 = new RegExp('^[A-Z a-z 0-9\sáéíóúñ.,_\]+$');

        //Validación campos mapa
            if(nombre.trim() == ""){
                alert('El campo nombre es obligatorio');
                return;
            }else if(!expreg.test(nombre)){
                alert("El campo nombre debe contener solo letras");
                return;
            }else if(nombre.length > 50){
                alert('El nombre no debe contener mas de 50 caracteres \nCaracteres actuales ('+nombre.length+')');
                return;
            }else if(descripcion.trim() == ""){
                alert('El campo descripcion es obligatorio');
                 return;
            }else if(descripcion.length >300){
                alert('La descripción no debe contener mas de 300 caracteres \nCaracteres actuales ('+descripcion.length+')');
                return;
            }else if(radio.trim() == ""){
                alert('El campo radio es obligatorio, favor crear un circulo');
                return;
            }else if(lat.trim() == "" || lng.trim() == ""){
                alert('Los campos latitud y longitud son obligatorios, favor crear un marcador');
                return;
            }else if(direccion.trim() == ""){
                alert('El campo dirección es obligatorio, favor crear un marcador.');
                return;
            }

        let str = geographic.split(',');
        let LatCircle = str[0].substring(1, str[0].length);
        let LngCircle = str[1].substring(0, str[0].length - 1);

        let data = {
            Nombre: nombre.trim(),
            Descripcion: descripcion.trim(),
            Lat: lat,
            Lng: lng,
            Radio: radio,
            Direccion: direccion,
            LatCircle: LatCircle,
            LngCircle: LngCircle
        }

        let config = 
            { 
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                     },
            method: "POST",
            body: JSON.stringify(data)
            }
        const response = await fetch(url,config).then(estado);

            
        alert('Datos Ingresado con exito');
            Limpiar();
            location.reload();
    }catch(e){
        alert(e.message);
    }
}
/**
*
*/
async function EliminarMapa(id){
    try {
        let res = confirm('¿Esta seguro de eliminar este mapa?');
       
        if(res){
            let config = 
                    { 
                        method: "DELETE"
                    }

            let urlEliminar=`services/DeleteDatosMapa/${id}`;

            const response = await fetch(urlEliminar).then(estado);
            
            alert('Dato eliminado con exito');
            location.reload();
        }
    } catch (e) {
        alert(e.message);
    }
}
/**
* Comprueba la respuesta devuelta por el servidor
* al confirmar la URL
*/
function estado(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
/**
*
*/
function Limpiar(){

    $('#objeto').html('');
    $('#nombre').val('');
    $('#descripcion').val('');
    $('#lat').val('');
    $('#lng').val('');
    $('#radio').val('');
    $('#direccion').val('');

}
/**
* async -> Define una función asíncrona 
* await -> Provoca que la ejecución de una función async sea pausada hasta que una Promise sea terminada o rechazada.
*/
async function getDirections(_URL){

    const res = await fetch(_URL).then(estado);

    return await res.json();
}
/**
* Cambia el radio del circulo en caso de ser mayor a 2000
*/
function setRadiusCircle(radio,id_radio,id_g,circulo){
   
    if(radio>2000){
        circulo.setRadius(2000);
        $(`#${id_radio}`).val(2000);
        $(`#${id_g}`).val(circulo.getCenter());
        alert('Radio del circulo no puede ser mayor a 2000 m ');
    }
}
/**
* 
*/
function show(mostrar,ocultar){
    document.getElementById(mostrar).removeAttribute('hidden');
    document.getElementById(ocultar).setAttribute('hidden','true');
}
/**
*
*/
async function CargarMapa(id){

    $('#title').html(`Editar mapa - ${id}`);

    show('modificar','dashboard');

    let urlEditar=`${url}/${id}`;

    const data = await fetch(urlEditar)
        .then(estado)
        .then(
                (response)=>{return response.json();}
             );


    $('#id_e').val(data.IdMapa);
    $('#nombre_e').val(data.Nombre);
    $('#descripcion_e').val(data.Descripcion);
    $('#lat_e').val(data.Lat);
    $('#lng_e').val(data.Lng);
    $('#radio_e').val(data.Radio);
    $('#direccion_e').val(data.Direccion);
        
    let str = data.Geographic.Geography.WellKnownText;
    let geo = str.substring(6,str.length); 
    $('#geographic_e').val(geo);
    let str_geo = geo.split(' ');
    let lat_c =  parseFloat(str_geo[0].substring(1, str_geo[0].length).replace(",", "."));
    let lng_c = parseFloat(str_geo[1].substring(0, str_geo[1].length - 1).replace(",", "."));

    initMap_e(data.Lat,data.Lng,data.Radio,lat_c,lng_c);
    ModificarHeight('div_modificar','map_e');
    initAutocomplete();
}
/**
*
*/
async function UpdateMapa(){

    try {
        let id = $('#id_e').val();
        let nombre = $('#nombre_e').val();
        let descripcion = $('#descripcion_e').val();
        let lat = $('#lat_e').val();
        let lng = $('#lng_e').val();
        let radio = $('#radio_e').val();
        let direccion = $('#direccion_e').val();

        let geographic = $('#geographic_e').val();

        let expreg = new RegExp('^[A-Z a-z\sáéíóúñ.,_\]*$');
        let expreg1 = new RegExp('^[A-Z a-z 0-9\sáéíóúñ.,_\]+$');

        //Validación campos mapa
        if(nombre.trim() == ""){
            alert('El campo nombre es obligatorio');
            return;
        }else if(!expreg.test(nombre)){
            alert("El campo nombre debe contener solo letras");
            return;
        }else if(descripcion.trim() == ""){
            alert('El campo descripcion es obligatorio');
            return;
        }else if(radio.trim() == ""){
            alert('El campo radio es obligatorio, favor crear un circulo');
            return;
        }else if(lat.trim() == "" || lng.trim() == ""){
            alert('Los campos latitud y longitud son obligatorios, favor crear un marcador');
            return;
        }else if(direccion.trim() == ""){
            alert('El campo dirección es obligatorio, favor crear un marcador.');
            return;
        }
        let str;
        let LatCircle;
        let LngCircle;

        if(cambio){
            str = geographic.split(',');
            LatCircle = str[0].substring(1, str[0].length);
            LngCircle = str[1].substring(0, str[0].length - 1);

        }else{
            str = geographic.split(' ');
            LngCircle= str[1].substring(0, str[1].length - 1);
            LatCircle = str[0].substring(1, str[0].length);
        }
        let data = {
            IdMapa: id,
            Nombre: nombre.trim(),
            Descripcion: descripcion.trim(),
            Lat: lat,
            Lng: lng,
            Radio: radio,
            Direccion: direccion,
            LatCircle: LatCircle,
            LngCircle: LngCircle
        }

        let config = 
            { 
                headers:
                    {
                        'Access-Control-Allow-Origin':'*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                mode: 'cors',
                method: "PUT",
                body: JSON.stringify(data)
            }
        let urlEditar=`${url}/${id}`;
        const response = await fetch(urlEditar,config).then(estado);

            
        alert('Mapa editado con exito');
        location.reload();
    }catch(e){
        alert(e.message);
    }
}
/**
*
*/
function ModificarHeight(div_original,div_cambiar){
   let height_div =  $(`#${div_original}`).height();
   $(`#${div_cambiar}`).height(height_div);
}
/**
* 
*/
function setIcon(e){

//Verifica que se halla asignado un marker a la variable marker_icon
if(!marker_icon){
    alert('Seleccione un marker');
    return '';
}  
       
let _url;
let file = e.target.files[0];
//El objeto FileReader permite que las aplicaciones web lean ficheros (o información en buffer) 
//Un buffer es una memoria en la que se almacenan datos de manera temporal para ser procesados. 
//Fichero: conjunto de bits que son almacenados en un dispositivo.
let reader = new FileReader();
reader.onload = function(event){
    _url=  event.target.result;
    marker_icon.setIcon({url:_url});
}
reader.readAsDataURL(file);
}

/**
*
*/
function limpiarTabla() {
    $('#table-content tbody tr').each(function(){ this.remove(); });
}
/**
*
*/
async function listMapa(){
    let options = '';
    let data = await GetDatos();

    if(data != null){
        for(let i in data)
            options += '<option value="'+data[i].Nombre+'" />';
        $('#listMapa').html(options);
    }
} 
/*
*traductor
function cargaHTML(urlPage,id){
    fetch(urlPage)
        .then(estado)
        .then((response)=>{
            return response.text();
        })
        .then((data)=>{
            document.getElementById(id).innerHTML= data;
        })
        .catch((error)=>{alert(error)});
}
*/