// URL DA API
const API_URL = 'https://prescholastic-hiedi-reciprocative.ngrok-free.dev';

// Estado global da aplicação (Carrinho)
let cart = [];
let produtosDisponiveis = [];

// Elementos do DOM (HTML)
const cardapioContainer = document.getElementById('cardapio');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

// 1. Função para buscar os produtos do Banco de Dados
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        const respostaSubmetida = await response.json();
        
        // Pega apenas a lista que está dentro de .data
        const listaDeProdutos = respostaSubmetida.data;
        
        // Guarda no nosso estado global para uso futuro no carrinho
        produtosDisponiveis = listaDeProdutos;

        // Limpa a mensagem de "Carregando..."
        cardapioContainer.innerHTML = '';

        // AGORA SIM: Executa o loop na lista certa de produtos!
        listaDeProdutos.forEach(produto => {
            const cardProduto = `
                <div class="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${produto.name}</h3>
                        <p class="text-gray-500 text-sm my-1">${produto.description || 'Deliciosa pizza artesanal'}</p>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <span class="text-red-600 font-bold">R$ ${parseFloat(produto.price).toFixed(2).replace('.', ',')}</span>
                       <button 
                            id="btn-${produto.id}"
                            onclick="adicionarAoCarrinho(${produto.id})" 
                            class="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-bold py-2 px-3 rounded transition-all duration-150 shadow-sm active:bg-red-700">
                            + Adicionar
                        </button>
                    </div>
                </div>
            `;
            cardapioContainer.innerHTML += cardProduto;
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        cardapioContainer.innerHTML = `<p class="text-red-500 col-span-2 text-center">Erro ao processar os produtos da base de dados.</p>`;
    }
}


const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const checkoutForm = document.getElementById('checkout-form');

window.adicionarAoCarrinho = function(id) {

    const produto = produtosDisponiveis.find(p => p.id === id);

    
    const itemNoCarrinho = cart.find(item => item.product_id === id);

    if (itemNoCarrinho) {
        
        itemNoCarrinho.quantity += 1;
    } else {
        
        cart.push({
            product_id: produto.id,
            name: produto.name,
            price: parseFloat(produto.price),
            quantity: 1
        });
    }

    
    atualizarInterfaceCarrinho();
}


function atualizarInterfaceCarrinho() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">Seu carrinho está vazio.</p>`;
        checkoutForm.classList.add('hidden');
        btnLimparCarrinho.classList.add('hidden'); //  Esconde o botão se estiver vazio
        cartCountElement.innerText = '0';
        cartTotalElement.innerText = 'R$ 0,00';
        return;
    }

    // Se o código continuar aqui embaixo, significa que tem itens!
    btnLimparCarrinho.classList.remove('hidden'); //  Mostra o botão de limpar

    let totalGeral = 0;
    let totalItens = 0;
    
    // ... resto do seu código da função atualizarInterfaceCarrinho igualzinho ...

    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalGeral += subtotal;
        totalItens += item.quantity;

        const itemHtml = `
            <div class="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                <div>
                    <p class="font-bold text-gray-800">${item.name}</p>
                    <p class="text-xs text-gray-500">Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold text-gray-700">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                    <button onclick="removerDoCarrinho(${item.product_id})" class="text-red-500 hover:text-red-700 text-xs font-bold px-1">✕</button>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += itemHtml;
    });

    cartCountElement.innerText = totalItens;
    cartTotalElement.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

    checkoutForm.classList.remove('hidden');
}

window.removerDoCarrinho = function(id) {
    const index = cart.findIndex(item => item.product_id === id);

    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1; 
        } else {
            cart.splice(index, 1); 
        }
    }

    atualizarInterfaceCarrinho();
}

// 5. Função para esvaziar o carrinho por completo
window.limparCarrinho = function() {
    // Um double-check amigável para o cliente não limpar sem querer no celular
    if (confirm("Tem certeza que deseja limpar o seu carrinho?")) {
        cart = []; // Esvazia o array global
        atualizarInterfaceCarrinho(); // Atualiza a tela (vai sumir com tudo e esconder o formulário)
    }
}

document.addEventListener('DOMContentLoaded', carregarProdutos);

// 6. Lógica de Envio do Pedido (Integração API + WhatsApp)
checkoutForm.addEventListener('submit', async (event) => {
    // Impede a página de recarregar com o envio do formulário
    event.preventDefault();

    // Captura os valores digitados pelo cliente nos inputs novos
    const name = document.getElementById('form-name').value;
    const phone_number = document.getElementById('form-phone').value;
    const address = document.getElementById('form-address').value;
    const payment_method = document.getElementById('form-payment').value;

    // Monta o payload exatamente como seu backend/Postman esperam
    // Mapeamos o carrinho para enviar apenas o product_id e a quantity
    const dadosPedido = {
        name: name,
        phone_number: phone_number,
        address: address,
        payment_method: payment_method,
        cart: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }))
    };

    try {
        // Altera o texto do botão para dar um feedback de carregamento
        const btnEnviar = checkoutForm.querySelector('button[type="submit"]');
        const textoBotaoOriginal = btnEnviar.innerHTML;
        btnEnviar.innerHTML = "⏳ Salvando pedido...";
        btnEnviar.disabled = true;

        // 1º PASSO: Salva silenciosamente na sua API do Backend (MySQL)
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPedido)
        });

        const respostaApi = await response.json();

        if (!response.ok || !respostaApi.success) {
            throw new Error(respostaApi.message || "Erro ao salvar no banco.");
        }

        // 2º PASSO: Se salvou no banco com sucesso, monta o texto do WhatsApp!
        let mensagemWhatsapp = `*🍕 PIZZARIA DOS ROCHA - NOVO PEDIDO! *\n\n`;
        mensagemWhatsapp += `*Cliente:* ${name}\n`;
        mensagemWhatsapp += `*Telefone:* ${phone_number}\n`;
        mensagemWhatsapp += `*Endereço:* ${address}\n`;
        mensagemWhatsapp += `*Forma de Pagamento:* ${payment_method}\n\n`;
        mensagemWhatsapp += `*🛒 ITENS DO PEDIDO:*\n`;

        let totalGeral = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalGeral += subtotal;
            mensagemWhatsapp += `• ${item.quantity}x ${item.name} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        });

        mensagemWhatsapp += `\n*💰 TOTAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*`;

        // Coloque o número do WhatsApp da pizzaria aqui (com DDD e sem espaços/traços)
        // Exemplo: 5511999999999 (55 = Brasil)
        const NUMERO_PIZZERIA = "5561985570434"; 

        // Codifica o texto para o formato de link URL
        const textoCodificado = encodeURIComponent(mensagemWhatsapp);
        const urlWhatsapp = `https://api.whatsapp.com/send?phone=${NUMERO_PIZZERIA}&text=${textoCodificado}`;

        // Reseta o botão, esvazia o carrinho local e redireciona o cliente
        btnEnviar.innerHTML = textoBotaoOriginal;
        btnEnviar.disabled = false;
        
        // Zera o carrinho e limpa a tela
        cart = [];
        atualizarInterfaceCarrinho();
        checkoutForm.reset();

        // Abre o WhatsApp em uma nova aba para o cliente finalizar o envio!
        window.open(urlWhatsapp, '_blank');

    } catch (error) {
        console.error("Erro ao finalizar pedido:", error);
        alert(`❌ Ops! Ocorreu um erro ao processar o seu pedido: ${error.message}\nVerifique se o backend está ativo.`);
        
        // Devolve o estado do botão em caso de erro
        const btnEnviar = checkoutForm.querySelector('button[type="submit"]');
        btnEnviar.innerHTML = "🟢 Enviar Pedido para o WhatsApp";
        btnEnviar.disabled = false;
    }
});