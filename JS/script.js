const gridSize = 16; // Aumenta a grade para 16x16
const mineCount = 10; // Número de minas
let mines = [];
let revealed = [];
let gameOver = false;

function iniciarJogo() {
    const grid = document.getElementById('mines-grid');
    grid.innerHTML = ''; // Limpar o grid anterior
    revealed = [];
    mines = Array(gridSize * gridSize).fill(false);
    gameOver = false;

    // Distribuir minas aleatoriamente
    let colocadas = 0;
    while (colocadas < mineCount) {
        let index = Math.floor(Math.random() * mines.length);
        if (!mines[index]) {
            mines[index] = true;
            colocadas++;
        }
    }

    // Criar botões da grade
    for (let i = 0; i < gridSize * gridSize; i++) {
        const button = document.createElement('button');
        button.classList.add('grid-btn');
        button.onclick = () => {
            if (!gameOver) {
                revelar(i);
            }
        };
        grid.appendChild(button);
    }
}

function revelar(index) {
    if (revealed.includes(index)) return;

    const grid = document.getElementById('mines-grid');
    const resultado = document.getElementById('resultado');
    const buttons = grid.getElementsByTagName('button');

    // Se encontrar uma mina
    if (mines[index]) {
        gameOver = true;
        resultado.textContent = 'Você encontrou uma mina! Fim de jogo!';
        buttons[index].textContent = '💣';
        buttons[index].classList.add('mine');
        mostrarMinas();
    } else {
        // Revelar a célula com o número de minas adjacentes
        let adjMines = contarMinasAdjacentes(index);
        buttons[index].textContent = adjMines > 0 ? adjMines : '';
        buttons[index].classList.add(`safe-${adjMines}`);
        buttons[index].disabled = true;
        revealed.push(index);
        resultado.textContent = 'Você está seguro! Continue jogando!';

        // Verificar se o jogador venceu
        if (revealed.length === gridSize * gridSize - mineCount) {
            resultado.textContent = 'Parabéns! Você venceu!';
        }
    }
}

function contarMinasAdjacentes(index) {
    const directions = [-1, 1, -gridSize, gridSize, -gridSize - 1, -gridSize + 1, gridSize - 1, gridSize + 1];
    let count = 0;
    
    directions.forEach(direction => {
        let adjIndex = index + direction;

        // Verificar se o índice está dentro dos limites da grade
        if (adjIndex >= 0 && adjIndex < mines.length) {
            const isNotLeftEdge = index % gridSize !== 0;
            const isNotRightEdge = (index + 1) % gridSize !== 0;

            // Ignorar os índices nas bordas da grade (evitar atravessar a linha)
            if (
                (direction === -1 && isNotLeftEdge) ||
                (direction === 1 && isNotRightEdge) ||
                (Math.abs(direction) === gridSize)
            ) {
                if (mines[adjIndex]) count++;
            }
        }
    });

    return count;
}

function mostrarMinas() {
    const grid = document.getElementById('mines-grid');
    const buttons = grid.getElementsByTagName('button');
    mines.forEach((isMine, i) => {
        if (isMine) {
            buttons[i].textContent = '💣';
            buttons[i].classList.add('mine');
        }
    });
}

window.onload = iniciarJogo;
