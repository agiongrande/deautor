$(document).ready(function(){

    class Carrito {
        constructor(id,cantidad,precio){
            this.id = id;
            this.cantidad = cantidad;
            this.precio = precio;
        }
    }

    class Producto {
        constructor(id,nombre,marca,tipo,precio,medida){
            this.id = id;
            this.nombre=nombre;
            this.marca=marca;
            this.tipo = tipo;
            this.precio=parseFloat(precio);
            this.medida=medida;
        }

        vender(cantidad){
            if(cantidad <= 0){
                alerta("Elegí la cantidad a comprar", "red");
            } else {

                let productoBuscado

                for (const prod of carrito){
                    productoBuscado = carrito.find(producto => producto.id == this.id);
                }

                if (productoBuscado == null){
                    carrito.push(new Carrito(this.id, cantidad, this.precio));
                }else{
                    productoBuscado.cantidad += cantidad;
                }

                $("#cantidad_"+this.id).html("0");

                mostrarCarrito();
            }
        }
    }

    const carrito = [];
    const productos = [];
    const filtroTipo = [];
    const filtroPrecio = [];
    const filtroContenido = [];

    const URL = "js/productos.json";

    $.get(URL,function(respuesta, estado){
        if (estado == "success"){
            for (const prod of respuesta){
                productos.push(new Producto(prod.id,prod.Nombre, prod.Marca, prod.Bebida, prod.Precio,prod.Contenido));
            }
            cargarFiltros();
            cargarProductos();
            
        }
    })

    let Carr = JSON.parse(localStorage.getItem("Carrito"));

    if (Carr != null){
        for (const b of Carr){
            carrito.push(new Carrito(b.id, b.cantidad, b.precio));
        }
        mostrarCarrito();
    }

    function mostrarCarrito(){
        $("#carrito").empty();
        $("#detalleCarrito").empty();
        let sumaTotal = 0;
        if (carrito.length >0){
            $("#detalleCarrito").append("<div id=detalleCarrito><button class='btn btn-primary btnOcultarCarrito'></button></div>")
                let bandera = true
                $("#detalleCarrito").html("<button class='btn btn-primary btnOcultarCarrito'>Ocultar detalle</button>");
                $("#detalleCarrito").click(function(){
                    if (bandera==true){
                        $("#carrito").slideUp("slow");
                        $("#detalleCarrito").html("<button class='btn btn-primary btnOcultarCarrito'>Mostrar detalle</button>");
                    } else{
                        $("#carrito").slideDown("slow");
                        $("#detalleCarrito").html("<button class='btn btn-primary btnOcultarCarrito'>Ocultar detalle</button>");
                    }
                    bandera=!bandera;
                })
            }

        for (const prod of carrito){
            let productoBuscado = carrito.find(producto => producto.id == prod.id)
            let sumaProducto = productoBuscado.precio  * productoBuscado.cantidad;
            sumaTotal += sumaProducto;

            $("#carrito").append(`
            <div class='itemCarrito'>
                <div class='col-4'>
                    <img src='img/bebida${productoBuscado.id}.png' height=50px>
                </div>
                <div class='col-8'>
                    <div class='Texto-2'>
                        Cantidad: ${productoBuscado.cantidad}
                    </div>
                    <div class='Texto-2'>
                        Precio: $ ${productoBuscado.precio}
                    </div>
                    <div class='Texto-2'>
                        Total: $ ${sumaProducto}
                    </div>
                    <div id='elimina_${productoBuscado.id}' class='btn btn-primary btnTienda'>
                        Eliminar
                    </div>
                </div>
            `)

            $("#elimina_"+productoBuscado.id).click(function(){
                let index = carrito.findIndex(function(cual){
                    return cual.id == productoBuscado.id
                });
                carrito.splice(index, 1);
                mostrarCarrito();
            })
        }
        if (sumaTotal > 0) {

            totalCarro.innerHTML = `
                <p class='Texto-3 negrita'>
                    Total: $ ${sumaTotal}
                </p>
                <form action=''>
                    <button class='btn btn-primary btnTienda' id=continuar>Comprar</button>
                </form>
                `
            $("#continuar").click(function(e){
                e.preventDefault();
                continuarCompra();
            });
        } else {
            totalCarro.innerHTML = "<p class=Texto-3>No hay productos en el carrito</p>";
        }

    localStorage.setItem("Carrito", JSON.stringify(carrito));
    }

    function alerta(mensaje, color){
        Toastify({
            text: mensaje,
            style: {
                background: color,
            },
            duration: 3000,
            offset: {
                y: 100
            },
            }).showToast();
    }

    function continuarCompra(){
        $("#Bebidas").slideUp("slow", function(){
            $("#Bebidas").empty(); 

            $("#Bebidas").append(`
                <div class='formularioCompra'>
                    <form action=''>
                        <label for='nombreText' class='Texto-3'>Nombre</label>
                        <input type='text' class='form-control input' id='nombreText' value='' required />
                        <label for='direccionText' class='Texto-3'>Direccion</label>
                        <input type='text' class='form-control input' id='direccionText' value='' required />
                        <label for='mailText' class='Texto-3'>Correo electrónico</label>
                        <input type='email' class='form-control input' id='mailText' value='' required />
                        <button class='btn btn-primary btnTienda' id=finalizar>Confirmar compra</button>
                        <button class='btn btn-primary btnTienda' id=volver>Volver a la compra</button>
                    </form>
                </div>
            `)

            $("#Bebidas").slideDown("slow");

            $("#finalizar").click(function(e){
                e.preventDefault();
                finalizarCompra();
            });

            $("#volver").click(function(e){
                e.preventDefault();
                $("#Bebidas").slideUp("slow", function(){
                    $("#Bebidas").empty();
                    cargarProductos();
                    $("#Bebidas").slideDown("slow");
                });

            });

        })

    }

    function finalizarCompra(){
        let nombre = $("#nombreText").val();
        let direccion = $("#direccionText").val();
        let mail = $("#mailText").val();

        let compraCorrecta = true;

        if (nombre == ""){
            alerta("Tenés que completar el nombre","red");
            compraCorrecta = false;
        }

        if(direccion == ""){
            alerta("Tenés que completar la dirección","red");
            compraCorrecta = false;
        }

        if(mail == ""){
            alerta("Tenés que completar el correo electrónico","red");
            compraCorrecta = false;
        } else {
            if(mail.indexOf("@")==-1){
                alerta("El email ingresado no es válido","red");
                compraCorrecta = false;
            }
        }

        if (compraCorrecta == true){

            $("#Bebidas").slideUp("slow", function(){
                $("#Bebidas").empty();
                cargarProductos();
                $("#Bebidas").slideDown("slow");
            });

            carrito.splice(0, carrito.length);
            mostrarCarrito();
            alerta("Compra realizada. Serás contactado a la brevedad a "+mail,"ForestGreen");
        }
    }

    function verCantidad(item){
        return parseInt($("#cantidad_"+item).html());
    }

    function cambiarCantidad(item, cantidad){
        let nuevaCantidad = verCantidad(item) + cantidad;
        if ((nuevaCantidad >= 0) && (nuevaCantidad < 6)){
            $("#cantidad_"+item).html(nuevaCantidad);
        }
    }

function cargarFiltros(){
    for (const prodMostrar of productos){

        if (!filtroTipo.includes(prodMostrar.tipo)){
            filtroTipo.push (prodMostrar.tipo)
        }
        if (!filtroPrecio.includes(prodMostrar.precio)){
            filtroPrecio.push (prodMostrar.precio)
        }
        if (!filtroContenido.includes(prodMostrar.medida)){
            filtroContenido.push (prodMostrar.medida)
        }
    }

    let html = "<div class=filtros>Tipo de bebida";
    for (const tipo of filtroTipo){
        html = html + `<label><input type="checkbox" checked id="tipo_${tipo}">${tipo}</label>`
    }
    html = html + "</div>"
    $("#Filtros").append(html);

    for (const tipo of filtroTipo){
        $("#tipo_"+tipo).click(function(){
            $("#Bebidas").empty();
            cargarProductos();
        })
    }

    html = "<div class=filtros>Rango de precio";
    let minimo = Math.min.apply(null, filtroPrecio)
    let maximo = Math.max.apply(null, filtroPrecio)
    html = html + `<input type="Text" class=filtroValor id=minimo value=${minimo}>`
    html = html + `<input type="Text" class=filtroValor id=maximo value=${maximo}>`
    html = html + "</div>"

    $("#Filtros").append(html);

    $("#minimo").change(function(){
        $("#Bebidas").empty();
        cargarProductos();
    })

    $("#maximo").change(function(){
        $("#Bebidas").empty();
        cargarProductos();
    })

    html = "<div class=filtros>Medida (en ml)";
    for (const contenido of filtroContenido){
        html = html + `<label><input type="checkbox" checked id="contenido_${contenido}">${contenido}</label>`
    }
    html = html + "</div>"
    $("#Filtros").append(html);

    for (const contenido of filtroContenido){
        $("#contenido_"+contenido).click(function(){
            $("#Bebidas").empty();
            cargarProductos();
        })
    }

}

    function cargarProductos(){
        for (const prodMostrar of productos){
            let i = prodMostrar.id;

            if($("#tipo_"+prodMostrar.tipo).prop("checked")==true){
                if($("#contenido_"+prodMostrar.medida).prop("checked")==true){
                    if($("#minimo").val() <= prodMostrar.precio && $("#maximo").val() >= prodMostrar.precio){

                        $("#Bebidas").append(`
                            <div class='item' id='item${i}'>
                                <div class='col-4'>
                                    <img src='img/bebida${i}.png'>
                                </div>
                                <div class='col-8'>
                                    <div class='Texto-3'>
                                        ${prodMostrar.nombre}
                                    </div>
                                    <div class='Texto-3'>
                                        $ ${prodMostrar.precio} (${prodMostrar.medida} ml)
                                    </div>
                                    <div name='comprar' id='comprar_${i}' class='btn btn-primary btnTienda'>
                                        Agregar al carrito
                                    </div>
                                    <div class='fila'>
                                        <div class='btn btn-primary btnCantidad' id='restar_${i}'>-</div>
                                        <div class='Texto-3' id='cantidad_${i}'>0</div>
                                        <div class='btn btn-primary btnCantidad' id='sumar_${i}'>+</div>
                                    </div>
                                </div>
                            </div>
                        `)

                        $("#comprar_"+i).click(function(){
                            prodMostrar.vender(verCantidad(i));
                        })

                        $("#restar_"+i).click(function(){
                            cambiarCantidad(i,-1);
                        })

                        $("#sumar_"+i).click(function(){
                            cambiarCantidad(i,1);
                        })
                    }
                }
            }
        }
    }

})