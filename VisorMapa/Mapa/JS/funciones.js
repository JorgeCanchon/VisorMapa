//Dirección web api
const url = "http://visormapa.gearhostpreview.com/services/DatosMapas";
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

//Verifica que solo una ventana infowindows este abierta
//circle
var prev_infowindow_c = false; 
//marker
var prev_infowindow_m = false; 
//
var autocomplete;
//Marker icon
var marker_icon;
//
var selected = [];

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
        option = [];
        if (event.type == 'circle') {
            //Asigna las propiedades a la variable circle
            circle = event.overlay;
            
            $('#div_radio').removeAttr('hidden');
            ModificarHeight('div_agregar','map');

            $("#radio").val(parseInt(circle.getRadius()));

            let position = circle.getCenter();
            let lat = position.lat;
            let lng = position.lng;
            $("#lat").val(lat);
            $("#lng").val(lng);

            setRadiusCircle(parseInt(circle.getRadius()),'radio',circle);

            //Retorna un JSON con las direcciones cercanas a las coordenadas dadas.
            let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $("#lat").val() + ',' +  $("#lng").val();;
            
            getDirections(geocoding).then(function(data){
                $("#direccion").val(data.results[0].formatted_address);
            });

        }else if(event.type == 'marker'){
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

    });//Fin overlaycomplete
    //
    google.maps.event.addListener(marker,'click',function(event) {
        let p = confirm('¿Esta seguro de eliminar esta marca?');
        if(p){
            marker.setMap(null);
            $("#lat").val('');
            $("#lng").val('');
            $('#direccion').val('');

            option = ['marker','circle'];

            dibujo.setOptions({ 
                drawingControlOptions: 
                    {//Posición del cuadro de herramientas drawing
                        position: google.maps.ControlPosition.TOP_CENTER,
                        //Opciones de dibujo
                        drawingModes: option}
            });
        }
    });
    //evento de arrastre marker
    google.maps.event.addListener(marker,'dragend',function(event) {

        $("#lat").val(event.latLng.lat());
        $("#lng").val(event.latLng.lng());

        let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng();
            
        getDirections(geocoding).then(function(data){
            $("#direccion").val(data.results[0].formatted_address);
        }).catch (function(error){});
    });
    //evento de arrastre circle
    google.maps.event.addListener(circle,'dragend',function(event) {
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
        
        setRadiusCircle(radius,'radio',circle);
    });
    //
    google.maps.event.addListener(circle,'click',function(){
        let p = confirm('¿Esta seguro de eliminar este circulo?');
        if(p){
            circle.setMap(null);
            $("#lat").val('');
            $("#lng").val('');
            $('#direccion').val('');

            $('#div_radio').attr('hidden','true');
            ModificarHeight('div_agregar','map');

            option = ['marker','circle'];

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

    ModificarHeight('div_agregar','map');
    initAutocomplete();
    loader();
}
/**
* Inicializacion API google maps
*/
function initMap_e(lat,lng,radio_c) {
    //
    var myLatLng = {lat: lat, lng:lng};

    map_e = new google.maps.Map(document.getElementById('map_e'), {
        center: myLatLng,
        zoom:12
    });
    if(radio_c == null){
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
        google.maps.event.addListener(marker_e,'dragend',function(event) {

            $("#lat_e").val(event.latLng.lat());
            $("#lng_e").val(event.latLng.lng());

            
            let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng();
                
            getDirections(geocoding).then(function(data){
                $("#direccion_e").val(data.results[0].formatted_address);
            }).catch (function(error){});
        });
        marker_e.setMap(map_e);
    }else{
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
            clickable: true,
            //
            editable: true,
            //
            draggable: true,
            radius: radio_c,
            center:{lat: lat, lng: lng}
        });
        //
        google.maps.event.addListener(circle_e, 'radius_changed', function(){
            let radius = parseInt(circle_e.getRadius());
            $("#radio_e").val(radius);
            setRadiusCircle(radius,'radio_e',circle_e);
        });
        //evento de arrastre circle
        google.maps.event.addListener(circle_e,'dragend',function(event) {
            $("#lat_e").val(event.latLng.lat());
            $("#lng_e").val(event.latLng.lng());
            
            let geocoding ='https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng();
                
            getDirections(geocoding).then(function(data){
                $("#direccion_e").val(data.results[0].formatted_address);
            }).catch (function(error){});
        });
        $('#div_radio').removeAttr('hidden');
        circle_e.setMap(map_e);
    }
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
            if(data[i].Radio != null){
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
                    center:{lat: data[i].Lat, lng: data[i].Lng},
                    radius: data[i].Radio
                }); 

                let contentCircle = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<div id="bodyContent">'+
                '<p><label>Nombre:</label>'+ data[i].Nombre+
                '<br /><label>Descripción:</label> '+data[i].Descripcion+
                '<br /><label>Radio:</label> '+data[i].Radio+ 
                '<br /><label>Latitud:</label> '+data[i].Lat+ 
                '<br /><label>Longitud:</label> '+data[i].Lng+
                '<br /><label>Dirección:</label> '+data[i].Direccion+'</p>'+
                '</div>'+
                '</div>';

                let InfoWindowCircle = new google.maps.InfoWindow({
                    content: contentCircle,
                    maxWidth: 200
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

            }else{
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

                let InfoWindowMarker = new google.maps.InfoWindow({
                    content: contentMarker,
                    maxWidth: 200
                });

                marker_t.addListener('click',function(){
                    //verifica si hay una ventana info
                    if( prev_infowindow_m ) {
                        prev_infowindow_m.close();
                    }
    
                    prev_infowindow_m = InfoWindowMarker;
                    //Abre ventana info marker
                    InfoWindowMarker.open(map_t, marker_t);
    
                    //Cambio zoom
                    map_t.setCenter({lat: data[i].Lat, lng: data[i].Lng});
                    map_t.setZoom(14);
    
                    marker_icon = marker_t; 
                });

            }      
        }
    }else{
        alert('No hay datos disponibles');

        let map_t = new google.maps.Map(document.getElementById('map_t'), {
            center:{lat: 4.710988599999999, lng:  -74.072092 },
            zoom: 6
        });
    }
    loader();
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

                $("#lat").val('');
                $("#lng").val('');
                $('#direccion').val('');
                option = ['marker', 'circle'];
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

        option = [];
        dibujo.setOptions({ drawingControlOptions: {
            //Posición del cuadro de herramientas drawing
            position: google.maps.ControlPosition.TOP_CENTER,
            //Opciones de dibujo
            drawingModes: option
        }});

    }catch(e){
        alert(e);
    }
   
}
/**
* Muestra los datos existentes en la base de datos
* consumiendo el WEB API
*/
function MostrarDatos(){
    GetDatos()
    .then(function(data){
        if(data!=null){
            for(var i in  data){
                $('#table-content').append(`<tr id="${data[i].IdMapa}" ><td>${data[i].IdMapa}</td><td>${data[i].Nombre}</td><td>${data[i].Descripcion}</td><td>${data[i].Lat}</td><td>${data[i].Lng}</td><td>${data[i].Direccion}</td><td>${data[i].Radio}</td><td>${data[i].FechaCreacion}</td><td><button id="${data[i].IdMapa}" onclick="CargarMapa(this.id)" class="btn btn-warning"><i class="fa fa-edit"></i></button></td></tr>`);
            }
    } 
    let table = $('#table-content').DataTable();

    $('#table-content tbody').on('click', 'tr', function () {
        let  id = this.id;
        let  index = $.inArray(id, selected);

        if ( index === -1 ) {
            $(this).addClass('selected');
            selected.push( id );
        } else {
            $(this).removeClass('selected');
            delete selected[index];
            selected = selected.filter(function(){return true;});
        }
    } );

        loader();
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
        let direccion = $('#direccion').val();
        let radio = $('#radio').val() == 'undefined' ? 0 : $('#radio').val();
        let expreg = new RegExp('^[A-Z a-z\sáéíóúñ.,_\]*$');
        let expreg1 = new RegExp('^[A-Z a-z 0-9\sáéíóúñ.,_\]+$');

        //Validación campos mapa
            if(nombre.trim() == ""){
                alert('El campo nombre es obligatorio');
                return;
            }else if(!expreg.test(nombre)){
                alert("El campo nombre debe contener solo letras");
                return;
            }else if(nombre.trim().length > 50){
                alert('El nombre no debe contener mas de 50 caracteres \nCaracteres actuales ('+nombre.length+')');
                return;
            }else if(descripcion.trim() == ""){
                alert('El campo descripcion es obligatorio');
                 return;
            }else if(descripcion.trim().length >300){
                alert('La descripción no debe contener mas de 300 caracteres \nCaracteres actuales ('+descripcion.length+')');
                return;
            }else if(lat.trim() == "" || lng.trim() == ""){
                alert('Los campos latitud y longitud son obligatorios, favor crear un marcador');
                return;
            }else if(direccion.trim() == ""){
                alert('El campo dirección es obligatorio, favor crear un marcador.');
                return;
            }else if(lng > 90 || lng < -90){
                alert('Coordenadas no soportadas :(');
                return ;
            }

        let data = {
            Nombre: nombre.trim(),
            Descripcion: descripcion.trim(),
            Lat: lat,
            Lng: lng,
            Radio: radio,
            Direccion: direccion
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
    }catch(e){
        alert(e.message);
    }
}
/**
*
*/
async function EliminarMapa(){
    try {
        if(selected.length === 0){
            alert('Selccione al menos un campo');
            return;
        }

        let res = confirm('¿Esta seguro de eliminar estos datos?');
        if(res){
            let config = 
                    { 
                        method: "DELETE"
                    }
            for (let i = 0; i < selected.length; i++) {
                let urlEliminar=`${url}/${selected[i]}`;
                const response = await fetch(urlEliminar,config).then(estado);
                $('#table-content tr').remove(`#${selected[i]}`);
            }
        alert('Dato eliminado con exito');
        $('#table-content tbody').append('<tr><td colspan="9" class="center"><center>No hay datos disponibles</center></td></tr>');
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
    initMap();
    
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
function setRadiusCircle(radio,id_radio,circulo){
   
    if(radio>2000){
        circulo.setRadius(2000);
        $(`#${id_radio}`).val(2000);

        let position = circulo.getCenter();
        $("#lat").val(position.lat);
        $("#lng").val(position.lng);

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
        
    initMap_e(data.Lat,data.Lng,data.Radio);
    ModificarHeight('div_modificar','map_e');
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
        let radio = $('#radio_e').val() == 'undefined' ? 0 : $('#radio_e').val();
        let direccion = $('#direccion_e').val();

        let expreg = new RegExp('^[A-Z a-z\sáéíóúñ.,_\]*$');
        let expreg1 = new RegExp('^[A-Z a-z 0-9\sáéíóúñ.,_\]+$');

        //Validación campos mapa
        if(nombre.trim() == ""){
            alert('El campo nombre es obligatorio');
            return;
        }else if(!expreg.test(nombre)){
            alert("El campo nombre debe contener solo letras");
            return;
        }else if(nombre.trim().length > 50){
            alert('El nombre no debe contener mas de 50 caracteres \nCaracteres actuales ('+nombre.length+')');
            return;
        }else if(descripcion.trim() == ""){
            alert('El campo descripcion es obligatorio');
            return;
        }else if(descripcion.trim().length >300){
            alert('La descripción no debe contener mas de 300 caracteres \nCaracteres actuales ('+descripcion.length+')');
            return;
        }else if(lat.trim() == "" || lng.trim() == ""){
            alert('Los campos latitud y longitud son obligatorios, favor crear un marcador');
            return;
        }else if(direccion.trim() == ""){
            alert('El campo dirección es obligatorio, favor crear un marcador.');
            return;
        }else if(lng > 90 || lng < -90){
            alert('Coordenadas no soportadas :(');
            return ;
        }

        let data = {
            IdMapa: id,
            Nombre: nombre.trim(),
            Descripcion: descripcion.trim(),
            Lat: lat,
            Lng: lng,
            Radio: radio,
            Direccion: direccion
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
    marker_icon.setIcon({
        url:_url,
        size: new google.maps.Size(120, 132),
        origin: new google.maps.Point(10, 10),
        anchor: new google.maps.Point(10, 132)
    });
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
function loader(){
    document.getElementById('loader').setAttribute('hidden', 'true');
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