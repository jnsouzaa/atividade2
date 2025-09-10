// Referências para os elementos HTML
const cardNameInput = document.getElementById('card-name');
const searchButton = document.getElementById('search-button');
const cardResultsDiv = document.getElementById('card-results');

// Referências para o novo modal
const cardModal = document.getElementById('card-modal');
const modalCardInfo = document.getElementById('modal-card-info');
const closeButton = document.querySelector('.close-button');

// Função que faz a busca
function buscarCards() {
    const cardName = cardNameInput.value.trim();
    
    if (cardName.length >= 1) { // só busca se tiver pelo menos 3 letras
        cardResultsDiv.innerHTML = '<p>Buscando cards...</p>';
        
        const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(cardName)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.data && data.data.length > 0) {
                    displayCards(data.data);
                } else {
                    cardResultsDiv.innerHTML = '<p>Nenhum card encontrado com este nome.</p>';
                }
            })
            .catch(error => {
                cardResultsDiv.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
            });
    } else {
        cardResultsDiv.innerHTML = '<p style="color: gray;">Digite pelo menos 3 caracteres para buscar.</p>';
    }
}

// Evento no botão (ainda funciona)
searchButton.addEventListener('click', buscarCards);

// Evento em tempo real no campo de texto
let debounceTimeout;
cardNameInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(buscarCards, 400); 
    // espera 400ms depois da última tecla antes de buscar
});

// Função para exibir os cards
function displayCards(cards) {
    cardResultsDiv.innerHTML = '';
    
    cards.forEach(card => {
        const name = card.name;
        const imageUrl = card.card_images[0].image_url;

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        // Apenas nome e imagem no card visível
        cardElement.innerHTML = `
            <div class="card-img-container">
                <img src="${imageUrl}" alt="Imagem do Card ${name}">
            </div>
            <div class="card-info">
                <h3>${name}</h3>
            </div>
        `;
        
        // Adiciona um evento de clique ao card
        cardElement.addEventListener('click', () => {
            showCardDetails(card);
        });

        cardResultsDiv.appendChild(cardElement);
    });
}

// Nova função para mostrar os detalhes do card em um pop-up
function showCardDetails(card) {
    // Limpa o conteúdo anterior
    modalCardInfo.innerHTML = '';

    // Cria o conteúdo do modal com todas as informações
    const cardContent = `
        <div class="card-details-header">
            <img src="${card.card_images[0].image_url}" alt="Imagem do Card ${card.name}">
            <h3>${card.name}</h3>
        </div>
        <p><strong>Tipo:</strong> ${card.type}</p>
        <p><strong>Raça:</strong> ${card.race}</p>
        <p><strong>Descrição:</strong> ${card.desc}</p>
        ${card.attack !== undefined ? `<p><strong>ATK:</strong> ${card.attack}</p>` : ''}
        ${card.defense !== undefined ? `<p><strong>DEF:</strong> ${card.defense}</p>` : ''}
        ${card.level !== undefined ? `<p><strong>Nível:</strong> ${card.level}</p>` : ''}
        ${card.attribute ? `<p><strong>Atributo:</strong> ${card.attribute}</p>` : ''}
    `;

    // Injeta o conteúdo no modal
    modalCardInfo.innerHTML = cardContent;
    
    // Exibe o modal
    cardModal.style.display = 'block';
}

// Evento para fechar o modal ao clicar no 'x'
closeButton.addEventListener('click', () => {
    cardModal.style.display = 'none';
});

// Evento para fechar o modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === cardModal) {
        cardModal.style.display = 'none';
    }
});