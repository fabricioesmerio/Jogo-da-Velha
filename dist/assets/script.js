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
        this.fim = false;
        this.vitoria = [448, 56, 7, 292, 146, 73, 273, 84] //condição de vitória, usando mapa de bits
    }

    iniciaElementos() {

        this.jogadorX = document.querySelector("#jogadorX");
        this.jogadorO = document.querySelector("#jogadorO");

        this.salvalocal = document.querySelector("#salva-local");
        this.salvalocal.addEventListener('click', this.salvaLocal.bind(this));

        this.carregalocal = document.querySelector("#carrega-local");
        this.carregalocal.addEventListener('click', this.carregaLocal.bind(this));

        this.limpalocal = document.querySelector("#limpar");
        this.limpalocal.addEventListener('click', this.limpaLocal.bind(this));

        this.btnSalvar = document.querySelector("#salvar");
        this.btnSalvar.addEventListener('click', this.enviarServidor.bind(this));

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

    limpaLocal() {
        localStorage.removeItem('jogo');
        this.jogadorO.value = '';
        this.jogadorX.value = '';
        this.iniciaEstado();
        this.render();
    }

    realizarJogada(event) {
        const id = event.target.dataset.id;

        if (this.fim) {
            this.modal('Partida terminada');
            return;
        }

        if (!event.target.dataset.id) {
            this.modal("Você deve selecionar uma casa corretamente!");
            return;
        }

        if (this.jogadas[id] != 0) {
            this.modal("Esta posição já foi escolhida!");
            return;
        }

        this.jogadas[id] = this.turno ? 'X' : 'O';
        this.turno = !this.turno;
    }

    render() {
        const resultado = this.verificaVitoria();
        if (resultado == 'X' || resultado == 'O') {
            this.fim = true;
            this.btnSalvar.style.display = "block";
            this.modal(`O jogador ${resultado} venceu!`);
        } else{
            this.btnSalvar.style.display = "none";
        }


        const velhaElementos = document.querySelectorAll('[data-id]');
        for (let i = 0; i < 9; i++) {
            velhaElementos[i].innerHTML = this.jogadas[i] == 0 ? "" : this.jogadas[i];
        }
    }

    verificaVitoria() {
        //decimal das jogadas de X
        const valorX = parseInt(this.jogadas.map(value => value == 'X' ? 1 : 0).join(''), 2);
        //decimal das jogadas de O
        const valorO = parseInt(this.jogadas.map(value => value == 'O' ? 1 : 0).join(''), 2);

        //percorre array vitoria perguntando se existe numero correspondente
        for (const element of this.vitoria) {
            if ((element & valorX) == element) {
                return 'X';
            }
            if ((element & valorO) == element) {
                return 'O';
            }
        }
        return "";
    }

    modal(mensagem) {
        const modais = document.querySelector("#modais");
        const modal = document.createElement("div");
        modal.innerHTML = mensagem;
        modal.classList.add("modalClass");
        modais.appendChild(modal);

        setTimeout(() => {
            modal.classList.add("remover");
            setTimeout(() => {
                modais.removeChild(modal);
            }, 1000);
        }, 1200);
    }

    enviarServidor() {
        //recebe os nomes dos jogadores
        const jogadorX = this.jogadorX.value;
        const jogadorO = this.jogadorO.value;

        //cria a imagem do tabuleiro
        domtoimage.toPng(this.velha, {width: '400', height: '400'})
            .then((dataUrl) => {
                
                return axios.post('/save', {
                    jogadorX, jogadorO, jogadas : JSON.stringify(this.jogadas),
                    img: dataUrl
                })
                    
            })
            .then((response) => {
                this.modal('Envio com sucesso!');
            })
            .catch((error) => {
                this.modal('oops, something went wrong!', error);
            });
        //envia para o servidor
    }
}