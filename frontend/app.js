// URL DA API
const API_URL = 'https://prescholastic-hiedi-reciprocative.ngrok-free.dev';

// Estado global da aplicação (Carrinho)
let cart = [];
let produtosDisponiveis = [];
let categoriaAtiva = 'all';

// Elementos do DOM (HTML)
const cardapioContainer = document.getElementById('cardapio');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

// 1. Função para buscar os produtos do Banco de Dados
async function carregarProdutos() {
    try {
        
        const response = await fetch(`${API_URL}/api/products`, {
            method: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        }); 
        
        const respostaSubmetida = await response.json();
        
        // Pega apenas a lista que está dentro de .data
      const listaDeProdutos = respostaSubmetida.data || respostaSubmetida;
        
        // Guarda no nosso estado global para uso futuro no carrinho
        produtosDisponiveis = listaDeProdutos;
 
        // Renderiza o cardápio
        renderizarCardapio();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        cardapioContainer.innerHTML = `<p class="text-red-500 col-span-2 text-center font-semibold py-4">Erro ao processar os produtos da base de dados.</p>`;
    }
}

// 2. Renderiza os itens do cardápio de forma dinâmica
function renderizarCardapio() {
    if (!cardapioContainer) return;
    cardapioContainer.innerHTML = '';

    if (produtosDisponiveis.length === 0) {
        cardapioContainer.innerHTML = `<p class="text-gray-500 col-span-2 text-center py-4">Carregando sabores deliciosos...</p>`;
        return;
    }

    // Filtra produtos pela categoria selecionada
    const produtosFiltrados = produtosDisponiveis.filter(p => 
        categoriaAtiva === 'all' || p.category === categoriaAtiva
    );

    if (produtosFiltrados.length === 0) {
        cardapioContainer.innerHTML = `<p class="text-gray-500 col-span-2 text-center py-8">Nenhum produto disponível nesta categoria no momento.</p>`;
        return;
    }

    produtosFiltrados.forEach(produto => {
        const itemNoCarrinho = cart.find(item => item.product_id === produto.id);
        const qtd = itemNoCarrinho ? itemNoCarrinho.quantity : 0;
        
        let botaoHTML = '';
        if (qtd > 0) {
            botaoHTML = `
                <div class="flex items-center bg-red-50 border border-red-200 rounded-lg overflow-hidden shadow-sm">
                    <button onclick="alterarQuantidade(${produto.id}, -1)" class="px-3 py-1.5 text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors font-bold text-sm select-none">
                        -
                    </button>
                    <span class="px-2 text-red-700 font-bold text-xs min-w-[24px] text-center select-none">
                        ${qtd}
                    </span>
                    <button onclick="alterarQuantidade(${produto.id}, 1)" class="px-3 py-1.5 text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors font-bold text-sm select-none">
                        +
                    </button>
                </div>
            `;
        } else {
            botaoHTML = `
                <button 
                    id="btn-${produto.id}"
                    onclick="adicionarAoCarrinho(${produto.id})" 
                    class="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded transition-all duration-150 shadow-sm active:bg-red-700 select-none">
                    + Adicionar
                </button>
            `;
        }

        const cardProduto = `
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all duration-200 animate-fadeIn">
                <div>
                    <h3 class="text-lg font-bold text-gray-800 flex items-start justify-between gap-2">
                        <span class="leading-tight">${produto.name}</span>
                        ${qtd > 0 ? `<span class="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-extrabold whitespace-nowrap animate-pulse">${qtd} no carrinho</span>` : ''}
                    </h3>
                    <p class="text-gray-500 text-sm mt-1.5 leading-relaxed">${produto.description || 'Deliciosa pizza artesanal'}</p>
                </div>
                <div class="flex items-center justify-between mt-5 pt-3 border-t border-gray-50">
                    <span class="text-red-600 font-extrabold text-lg">R$ ${parseFloat(produto.price).toFixed(2).replace('.', ',')}</span>
                    <div id="btn-container-${produto.id}">
                        ${botaoHTML}
                    </div>
                </div>
            </div>
        `;
        cardapioContainer.innerHTML += cardProduto;
    });
}

// 3. Filtra o cardápio pela categoria (food ou drink)
window.filtrarCategoria = function(categoria) {
    categoriaAtiva = categoria;
    
    // Lista de ids dos botões de categorias
    const botoes = {
        all: document.getElementById('btn-cat-all'),
        food: document.getElementById('btn-cat-food'),
        drink: document.getElementById('btn-cat-drink')
    };
    
    // Atualiza classes do Tailwind para o botão ativo e inativos
    Object.keys(botoes).forEach(key => {
        if (botoes[key]) {
            if (key === categoria) {
                botoes[key].className = "px-4 py-2 rounded-full text-xs font-bold transition-all bg-red-600 text-white shadow-sm hover:bg-red-700 select-none cursor-pointer";
            } else {
                botoes[key].className = "px-4 py-2 rounded-full text-xs font-bold transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 select-none cursor-pointer";
            }
        }
    });
    
    renderizarCardapio();
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
    const floatingCart = document.getElementById('floating-cart');
    const floatingCount = document.getElementById('floating-cart-count');
    const floatingTotal = document.getElementById('floating-cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">Seu carrinho está vazio.</p>`;
        checkoutForm.classList.add('hidden');
        btnLimparCarrinho.classList.add('hidden'); 
        cartCountElement.innerText = '0';
        cartTotalElement.innerText = 'R$ 0,00';
        
   
        if (floatingCart) floatingCart.classList.add('hidden');
        
        // Mantém o menu atualizado
        renderizarCardapio();
        return;
    }

    btnLimparCarrinho.classList.remove('hidden'); 

    let totalGeral = 0;
    let totalItens = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalGeral += subtotal;
        totalItens += item.quantity;

        const itemHtml = `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm hover:border-gray-200 transition-colors">
                <div class="flex-1 pr-2">
                    <p class="font-bold text-gray-800 leading-tight">${item.name}</p>
                    <p class="text-xs text-red-600 font-semibold mt-0.5">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <button onclick="alterarQuantidade(${item.product_id}, -1)" class="px-2.5 py-1 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors font-bold text-sm select-none">
                            -
                        </button>
                        <span class="px-1 text-gray-800 font-semibold min-w-[18px] text-center text-xs select-none">
                            ${item.quantity}
                        </span>
                        <button onclick="alterarQuantidade(${item.product_id}, 1)" class="px-2.5 py-1 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors font-bold text-sm select-none">
                            +
                        </button>
                    </div>
                    <span class="font-bold text-gray-700 text-sm min-w-[65px] text-right">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                    <button onclick="removerItemCompleto(${item.product_id})" class="text-gray-400 hover:text-red-500 p-1 transition-colors" title="Remover do carrinho">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += itemHtml;
    });

    cartCountElement.innerText = totalItens;
    cartTotalElement.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

    checkoutForm.classList.remove('hidden');

  
    if (floatingCart && floatingCount && floatingTotal) {
        floatingCart.classList.remove('hidden');
        floatingCount.innerText = totalItens;
        floatingTotal.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }

    // Atualiza os botões no cardápio de produtos em tempo real
    renderizarCardapio();
}

// 5. Altera a quantidade de um item no carrinho
window.alterarQuantidade = function(id, delta) {
    const item = cart.find(item => item.product_id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.product_id !== id);
        }
        atualizarInterfaceCarrinho();
    }
}

// 6. Remove o item inteiro do carrinho
window.removerItemCompleto = function(id) {
    cart = cart.filter(item => item.product_id !== id);
    atualizarInterfaceCarrinho();
}

// 7. Função para esvaziar o carrinho por completo
window.limparCarrinho = function() {
    // Um double-check amigável para o cliente não limpar sem querer no celular
    if (confirm("Tem certeza que deseja limpar o seu carrinho?")) {
        cart = []; // Esvazia o array global
        atualizarInterfaceCarrinho(); // Atualiza a tela (vai sumir com tudo e esconder o formulário)
    }
}

// 8. Verifica se a pizzaria está aberta com base no fuso de Brasília (DF)
function verificarHorarioFuncionamento() {
    const statusContainer = document.getElementById('status-funcionamento');
    if (!statusContainer) return;
    
    try {
        // Obter data/hora atual no fuso horário de Brasília (America/Sao_Paulo)
        const options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false };
        const horaBrasiliaStr = new Intl.DateTimeFormat('pt-BR', options).format(new Date());
        
        // horaBrasiliaStr estará no formato "HH:MM"
        const [horas, minutos] = horaBrasiliaStr.split(':').map(Number);
        const tempoAtualEmMinutos = horas * 60 + minutos;
        
        // Horário de funcionamento: 18:00 (1080 min) às 23:30 (1410 min)
        const limiteAbertura = 18 * 60;
        const limiteFechamento = 23 * 60 + 30;
        
        if (tempoAtualEmMinutos >= limiteAbertura && tempoAtualEmMinutos <= limiteFechamento) {
            statusContainer.innerHTML = `
                <span class="text-green-400 font-bold">🟢 Aberto agora</span>
                <span class="text-[10px] text-gray-300 opacity-90">18:00h às 23:30h</span>
            `;
        } else {
            statusContainer.innerHTML = `
                <span class="text-red-400 font-bold">🔴 Fechado agora</span>
                <span class="text-[10px] text-gray-300 opacity-90 font-semibold">Abre às 18:00h</span>
            `;
        }
    } catch (e) {
        console.error("Erro ao verificar fuso horário de Brasília:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    verificarHorarioFuncionamento();
});

// 6. Lógica de Envio do Pedido (Integração API + WhatsApp)
checkoutForm.addEventListener('submit', async (event) => {
    // Impede a página de recarregar com o envio do formulário
    event.preventDefault();

    // Captura os valores digitados pelo cliente nos inputs novos
    const name = document.getElementById('form-name').value;
    const phone_number = document.getElementById('form-phone').value;
    const address = document.getElementById('form-address').value;
    const payment_method = document.getElementById('form-payment').value;
    const obs = document.getElementById('form-obs').value;

    // Monta o payload exatamente como seu backend/Postman esperam
    // Mapeamos o carrinho para enviar apenas o product_id e a quantity
    const dadosPedido = {
        name: name,
        phone_number: phone_number,
        address: address,
        payment_method: payment_method,
        obs: obs,
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
        
        if (obs.trim() !== "") {
            mensagemWhatsapp += `*Observações:* ${obs}\n\n`;
        }

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

// Máscara de telefone / WhatsApp
const phoneInput = document.getElementById('form-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)$/, "($1");
        }
        
        event.target.value = value;
    });
}

// 8. Transição suave da tela de boas-vindas para o cardápio
window.entrarNoCardapio = function() {
    const welcomeView = document.getElementById('welcome-view');
    const menuView = document.getElementById('menu-view');
    
    if (welcomeView && menuView) {
        welcomeView.classList.add('opacity-0', '-translate-y-4');
        
        setTimeout(() => {
            welcomeView.classList.add('hidden');
            menuView.classList.remove('hidden');
            
            // Adiciona classes iniciais de opacidade para a transição suave
            menuView.classList.add('opacity-0', 'translate-y-4');
            
            // Força o navegador a renderizar o estado oculto antes de animar
            requestAnimationFrame(() => {
                setTimeout(() => {
                    menuView.classList.remove('opacity-0', 'translate-y-4');
                    menuView.classList.add('opacity-100', 'translate-y-0');
                }, 50);
            });
        }, 500);
    }
}