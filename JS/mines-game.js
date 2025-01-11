let gridSize = 4; // Tamanho do grid
let mines = [];
let revealed = [];
let mineCount = 1; // Minas padrão
let saldo = 1000.00;  // Saldo inicial
let aposta = 10;  // Aposta inicial
let gameOver = false; // Flag para verificar se o jogo acabou

// Atualiza o saldo na tela
function atualizarSaldo() {
    document.getElementById('saldo').textContent = saldo.toFixed(2);
}

// Atualiza o valor da aposta
function atualizarValorAposta() {
    aposta = parseFloat(document.getElementById('aposta').value);
    document.getElementById('valorAposta').textContent = `Aposta atual: R$${aposta.toFixed(2)}`;
}

// Função para parar o jogo e calcular o saldo final
function pararJogo() {
    const grid = document.getElementById('mines-grid');
    const buttons = grid.getElementsByTagName('button');
    
    // Calcular o valor final com base nas células seguras reveladas
    let porcentagem = revealed.length / (gridSize * gridSize - mineCount);
    let ganho = aposta * 2 * porcentagem;

    saldo += ganho;
    atualizarSaldo();

    // Desabilita todos os botões
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    document.getElementById('resultado').textContent = `Você parou o jogo e ganhou R$${ganho.toFixed(2)}!`;
    // Ocultar o botão "Parar Jogo" e mostrar o botão "Iniciar Jogo"
    document.getElementById("stopGameButton").style.display = "none";
    document.getElementById("startGameButton").style.display = "block";
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    // Resetar variáveis do jogo
    revealed = [];
    saldo -= aposta;  // Deduz a aposta do saldo
    atualizarSaldo();
    document.getElementById('resultado').textContent = '';

    // Limpa o grid
    const grid = document.getElementById('mines-grid');
    grid.innerHTML = ''; 

    // Ocultar o botão "Iniciar Jogo" e mostrar o botão "Parar Jogo"
    document.getElementById("startGameButton").style.display = "none";
    document.getElementById("stopGameButton").style.display = "block";

    // Inicia um novo jogo
    iniciarJogo();
}

// Inicia o jogo
function iniciarJogo() {
    // Verifica se o valor da aposta é válido
    if (aposta <= 0 || aposta > saldo) {
        alert("Aposta inválida! Verifique seu saldo.");
        return;
    }

    // Pega o número de minas escolhido
    mineCount = parseInt(document.getElementById('mineCount').value);
    if (mineCount < 1 || mineCount > gridSize * gridSize - 1) {
        alert("Número de minas inválido.");
        return;
    }

    const grid = document.getElementById('mines-grid');
    grid.innerHTML = ''; // Limpa o grid
    revealed = [];
    mines = Array(gridSize * gridSize).fill(false);

    // Distribui minas aleatoriamente
    let colocadas = 0;
    while (colocadas < mineCount) {
        let index = Math.floor(Math.random() * mines.length);
        if (!mines[index]) {
            mines[index] = true;
            colocadas++;
        }
    }

    // Cria os botões da grade
    for (let i = 0; i < gridSize * gridSize; i++) {
        const button = document.createElement('button');
        button.classList.add('grid-btn');
        button.textContent = '?';
        button.onclick = () => revelar(i);
        grid.appendChild(button);
    }

    // Reseta o resultado e a mensagem de "Game Over"
    document.getElementById('resultado').textContent = "";
    document.getElementById('gameOver').style.display = 'none';

    // Exibe o botão de parar jogo
    document.getElementById("stopGameButton").style.display = "block";
    document.getElementById("startGameButton").style.display = "none";
}

// Revela a célula quando clicada
function revelar(index) {
    const grid = document.getElementById('mines-grid');
    const resultado = document.getElementById('resultado');
    const buttons = grid.getElementsByTagName('button');

    if (mines[index]) {
        // Se encontrar uma mina, o jogador perde
        saldo -= aposta;  // Deduz a aposta do saldo
        resultado.textContent = 'Game Over! Você encontrou uma mina.';
        buttons[index].textContent = '💣';
        buttons[index].style.backgroundColor = '#e74c3c';

        // Mostra todas as minas
        for (let i = 0; i < mines.length; i++) {
            if (mines[i]) {
                buttons[i].textContent = '💣';
                buttons[i].style.backgroundColor = '#e74c3c';
            }
        }

        // Desabilita todos os botões da grade
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        // Exibe a mensagem de Game Over
        const gameOverMessage = document.getElementById('gameOver');
        gameOverMessage.style.display = 'block';

        // Esconde a mensagem após 3 segundos
        setTimeout(() => {
            gameOverMessage.style.display = 'none';
        }, 3000);

        // Ocultar o botão "Parar Jogo" e mostrar o botão "Iniciar Jogo"
        document.getElementById("stopGameButton").style.display = "none";
        document.getElementById("startGameButton").style.display = "block";
    } else {
        // Se não for mina, o botão é marcado como seguro
        buttons[index].textContent = '✅';
        buttons[index].disabled = true;
        revealed.push(index);
        resultado.textContent = 'Você está seguro! Continue jogando!';

        // Se o jogador abrir todas as células seguras
        if (revealed.length === gridSize * gridSize - mineCount) {
            saldo += aposta * 2;  // O jogador ganha o valor apostado dobrado
            resultado.textContent = 'Parabéns! Você venceu!';
            atualizarSaldo();
        }
    }
}

// Inicializa o jogo ao carregar a página
window.onload = () => {
    atualizarSaldo();
    atualizarValorAposta();
};

// Adiciona o evento de clique para iniciar o jogo
document.getElementById("startGameButton").addEventListener("click", iniciarJogo);

// Adiciona o evento de clique para parar o jogo
document.getElementById("stopGameButton").addEventListener("click", pararJogo);

// Atualiza o valor da aposta
function atualizarValorAposta() {
    aposta = parseFloat(document.getElementById('aposta').value);
    document.getElementById('valorAposta').textContent = `Aposta atual: R$${aposta.toFixed(2)}`;
}

// Adiciona o evento de mudança no input da aposta para atualizar o valor da aposta
document.getElementById('aposta').addEventListener('input', atualizarValorAposta);

// Restante do código...
