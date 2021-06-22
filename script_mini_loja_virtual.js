$(document).ready(function () { 

	$(function () {

		$.ajaxSetup({
	        headers: { 
	        	'X-CSRF-TOKEN': $('meta[name="_csrfToken"]').attr('content')
	        }
	    }); 

		var carrinho = []; 
		var carrinhoPrecos = [];
		var valores = []; 
		var listaQuantidade = [];
		var listaNomes = [];

		var listaAuxiliarValores = []; 

		var listaAuxiliarQuantidade = []; 
        
		var anuncianteId;
		$.post("https://guiaparanalitoraneo.com.br/pedidos/verificar-carrinho", {}, function(response) {
		    if(response.carrinho != null){
    			for(var i = 0; i < response.carrinho.length; i++){
    				if(response.carrinho[i] != null) {
    
    					carrinho.push(response.carrinho[i]);
    					carrinhoPrecos.push(response.carrinhoPrecos[i]);
    					listaQuantidade.push(response.listaQuantidade[i]);
    					valores.push(response.carrinhoPrecos[i] * response.listaQuantidade[i]);
    					anuncianteId = response.anuncianteId;
    					listaNomes = response.listaNomes;
    
    					qtd = document.getElementById("qtd-carrinho");
    					if(qtd != null){
    						document.getElementById("qtd-carrinho").innerHTML = carrinho.length;
    					}
    
    					qtd2 = document.getElementById("qtd-carrinho-menu");
    					if(qtd2 != null){
    						document.getElementById("qtd-carrinho-menu").innerHTML = carrinho.length;
    					}
    
    					$('input[id=quantidade'+response.carrinho[i]+']').val(response.listaQuantidade[i]);
    				}
    			}
		    }

		}, 'json');

	    $("button[name=comprar]").click(function(event){
	        event.preventDefault();

	        var button = $(this);
	        var idProduto = button.data('id'); 
	        var preco = button.data('preco'); 
	        var anuncianteId = button.data('anunciante'); 
	        var nome = button.data('nome'); 

	        var quantidade = $("#quantidade" + idProduto).val();
	        console.log(quantidade);

	        if(quantidade > 0) {
	        	var valorVelho = button.data('valor');
	        	var valorNovo = valorVelho + 1;
	        	button.data('valor', valorNovo); 
	    	}
	        
	        if(valorNovo % 2 == 1 && quantidade > 0) {

	        	var butao = document.getElementById('comprado' + idProduto).innerHTML = "<span class='badge badge-primary'> <i class='fas fa-shopping-cart'></i> Ok</span>";

	        	$(button).removeClass("btn-success").addClass("btn-danger");

	        	document.getElementById(idProduto).innerHTML = "Cancelar";

	        	document.getElementById('verificador' + idProduto).innerHTML = "";

		        carrinho.push(idProduto); 
		        carrinhoPrecos.push(preco); 

		        listaNomes.push(nome); 

		        console.log(listaNomes);
		        console.log(carrinho);

		        //-------------------------------------------------------------------------------------------------
		      	listaQuantidade.push(quantidade); 

		      	var total = preco * quantidade;

		      	valores.push(total); 

		      	console.log(valores);

		        listaAuxiliarValores.push(idProduto); 
		        listaAuxiliarQuantidade.push(idProduto);
	        	//-------------------------------------------------------------------------------------------------
	    	} else {
	    		document.getElementById('verificador' + idProduto).innerHTML = "Preencha a quantidade";
	    	}


	        if(valorNovo % 2 == 0 && quantidade > 0) {
	        	document.getElementById('comprado' + idProduto).innerHTML = "";
	        	$(button).removeClass("btn-danger").addClass("btn-success");
	        	document.getElementById(idProduto).innerHTML = "Comprar";
	        	document.getElementById('verificador' + idProduto).innerHTML = "";

	        	for( var i = 0; i < carrinho.length; i++) { 
	        		if (carrinho[i] === idProduto) { 
	        			carrinho.splice(i, 1); 
	        			listaNomes.splice(i, 1); 
	        		}
	        	}

	        	for( var i = 0; i < carrinhoPrecos.length; i++) { 
	        		if (carrinhoPrecos[i] === preco) { 
	        			carrinhoPrecos.splice(i, 1); 
	        		}
	        	}

	        	for( var i = 0; i < listaAuxiliarValores.length; i++) { 
	        		if (listaAuxiliarValores[i] === idProduto) { 
	        			valores.splice(i, 1); 
	        			listaAuxiliarValores.splice(i, 1); 
	        		}
	        	}

	        	for( var i = 0; i < listaAuxiliarQuantidade.length; i++) { 
	        		if (listaAuxiliarQuantidade[i] === idProduto) { 
	        			listaQuantidade.splice(i, 1); 
	        			listaAuxiliarQuantidade.splice(i, 1); 
	        		}
	        	}
	        }
	        
	        document.getElementById("qtd-carrinho").innerHTML = carrinho.length;
	        //document.getElementById("qtd-carrinho-menu").innerHTML = carrinho.length;
	    });

		$("[name=finalizar_compra]").click(function(event){
			event.preventDefault();

			var button = $(this);
			var anuncianteId = button.data('anunciante'); //anuciant_id

			if(carrinho.length != 0) {

				document.getElementById("carregamento").innerHTML = "<div class='spinner-border' role='status'> <span class='sr-only'>Loading...</span> </div>";

				$.post("https://guiaparanalitoraneo.com.br/pedidos/finalizar-compra/", {carrinho: carrinho, carrinhoPrecos: carrinhoPrecos, listaQuantidade: listaQuantidade, valores: valores, anuncianteId: anuncianteId, listaNomes: listaNomes}, function(response) {
					if(response.redirect) {
						window.location.href = response.redirect;
					}
				}, 'json');

			} else {
				alert('O carrinho esta vazio');
			}

		});

		$("button[name=comprado]").click(function(event){
			var button = $(this);
			var comprado = button.data('comprado'); 
			var preco = button.data('preco');

	        for( var i = 0; i < carrinho.length; i++) { 
	        	if(carrinho[i] == comprado) { 
	        		carrinho.splice(i, 1); 
	        		listaNomes.splice(i, 1); 

	        		valores.splice(i, 1); 
	        		listaQuantidade.splice(i, 1); 

	        		document.getElementById("qtd-carrinho").innerHTML = carrinho.length;
	        	}
	        }

	        for( var i = 0; i < carrinhoPrecos.length; i++) { 
	        	if (carrinhoPrecos[i] == preco) { 
	        		carrinhoPrecos.splice(i, 1); 
	        	}
	        }

	        //console.log(carrinho);
	        //console.log(listaNomes);
	        //console.log(carrinhoPrecos);
	        //console.log(listaQuantidade);
	        //console.log(valores);
	        //console.log(anuncianteId);

			$.post("https://guiaparanalitoraneo.com.br/pedidos/produto-cancelado", {comprado: comprado}, function(response) {
					
			}, 'json');

	    });

	    $("input[name=quantidade]").focusout(function(){
	    	var input = $(this);
			var idProduto = input.data('produto');
			var preco = input.data('preco');

			for(var i = 0; i < carrinho.length; i++) { 
	        	if(carrinho[i] == idProduto) {
	        		listaQuantidade.splice(i, 1); 
	        		valores.splice(i, 1); 

	        		var quantidade = $("#quantidade" + idProduto).val();
	        		listaQuantidade.push(quantidade);

	        		var total = preco * quantidade;
		      		valores.push(total); 
	        	}
	        }

		});

	});

});




