window.onload = () => {
    new JogoVelha();
}

class JogoVelha {

    constructor() {
        this.iniciaElementos();
        this.iniciaEstado();
    }

    iniciaEstado() {
        this.turno = true;
        this.jogadas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    iniciaElementos() {

        this.jogadorX = document.querySelector("#jogadorX");
        this.jogadorO = document.querySelector("#jogadorO");

        this.salvalocal = document.querySelector("#salva-local");
        this.salvalocal.addEventListener('click', this.salvaLocal.bind(this));

        this.carregalocal = document.querySelector("#carrega-local");
        this.carregalocal.addEventListener('click', this.carregaLocal.bind(this));

        this.velha = document.querySelector("#velha");
        this.velha.addEventListener('click', (event) => {
            this.realizarJogada(event);
            this.render();
        });

    }

    salvaLocal() {
       
        const dados = {
            jogadorX: this.jogadorX.value,
            jogadorO: this.jogadorO.value,
            jogadas: this.jogadas,
        }

        localStorage.setItem('jogo', JSON.stringify(dados));
    }

    carregaLocal() {
        const dados = JSON.parse(localStorage.getItem('jogo'));
        this.jogadorO.value = dados.jogadorO;
        this.jogadorX.value = dados.jogadorX;
        this.jogadas = dados.jogadas;

        this.render();
    }

    realizarJogada(event) {
        const id = event.target.dataset.id;
        this.jogadas[id] = this.turno ? 'X' : 'O';
        this.turno = !this.turno;
    }

    render() {
        const velhaElementos = document.querySelectorAll('[data-id]');
        for (let i = 0; i < 9; i++) {
            velhaElementos[i].innerHTML = this.jogadas[i] == 0 ? "" : this.jogadas[i];
        }
    }
}