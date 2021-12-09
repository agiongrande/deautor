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

    productos.push(new Producto(1,"Smirnoff", "Smirnoff", "Vodka", "100","700ml"));
    productos.push(new Producto(2,"Fernet", "Branca", "Fernet", "200","1000ml"));
    productos.push(new Producto(3,"Smirnoff Raspberry", "Smirnoff", "Vodka", "300","700ml"));
    productos.push(new Producto(4,"Smirnoff Apple", "Smirnoff", "Vodka", "400","700ml"));

    let Carr = JSON.parse(localStorage.getItem("Carrito"));

    if (Carr != null){
        for (const b of Carr){
            carrito.push(new Carrito(b.id, b.cantidad, b.precio));
        }
        mostrarCarrito();
    }

    function mostrarCarrito(){
        let carro = $("#carrito");
        carro.empty("");
        let sumaTotal = 0;
        for (const prod of carrito){
            let productoBuscado = carrito.find(producto => producto.id == prod.id)
            let sumaProducto = productoBuscado.precio  * productoBuscado.cantidad;
            sumaTotal += sumaProducto;

            carro.append("<div class='itemCarrito'><div class='col-4'><img src='img/bebida"+productoBuscado.id+".png' height=50px></div><div class='col-8'><div class='Texto-2'>Cantidad: " + productoBuscado.cantidad +"</div><div class='Texto-2'>Precio: $ "  + productoBuscado.precio +"</div><div class='Texto-2'>Total: $ " + sumaProducto + "</div><div id='elimina_"+productoBuscado.id+"' class='btn btn-primary btnTienda'>Eliminar</div></div></div>");

            $("#elimina_"+productoBuscado.id).click(function(){
                let index = carrito.findIndex(function(cual){
                    return cual.id == productoBuscado.id
                });
                carrito.splice(index, 1);
                mostrarCarrito();
            })
        }
        if (sumaTotal > 0) {
            totalCarro.innerHTML = "<p class='Texto-3 negrita'>Total: $ " + sumaTotal + "</p>";
            totalCarro.innerHTML = totalCarro.innerHTML + "<div class='formularioCompra'><form action=''><label for='nombreText' class='Texto-3'>Nombre</label><input type='text' class='form-control input' id='nombreText' value='' required /><label for='direccionText' class='Texto-3'>Direccion</label><input type='text' class='form-control input' id='direccionText' value='' required /><label for='mailText' class='Texto-3'>Correo electrónico</label><input type='email' class='form-control input' id='mailText' value='' required /><button class='btn btn-primary btnTienda' id=finalizar>Confirmar compra</button></form></div>"
            $("#finalizar").click(function(){
                finalizarCompra();
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

    let bebidas = $("#Bebidas");
    for (const prodMostrar of productos){

        let i = prodMostrar.id;

        bebidas.append("<div class='item' id='item"+i+"'><div class='col-4'><img src='img/bebida"+i+".png'></div><div class='col-8'><div class='Texto-3'>"+prodMostrar.nombre+"</div><div class='Texto-3'>$ "+prodMostrar.precio+"</div><div name='comprar' id='comprar_"+i+"' class='btn btn-primary btnTienda'>Agregar al carrito</div><div class='fila'><div class='btn btn-primary btnCantidad' id='restar_"+i+"'>-</div><div class='Texto-3' id='cantidad_"+i+"'>0</div><div class='btn btn-primary btnCantidad' id='sumar_"+i+"'>+</div></div></div></div>");

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

    $(".item IMG").click(function(e){
        $(e.target).animate( {
            height: "200px"
        },4000, () => achicar())

        function achicar(){
            $(".item IMG").animate( {
                height: "180px"
            },4000)
        }
    })

    $("#carrito").toggle("slow");
    $("#detalleCarrito").click(function(){
        $("#carrito").toggle("slow");
    })
})