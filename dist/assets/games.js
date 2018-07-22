window.onload = () => {
    new VerJogos();
};

class VerJogos {
    constructor() {
        this.divRender = document.querySelector("#render");
        axios
            .get("/all")
            .then(response => {
                this.render(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    render(dados){
        dados.forEach(element => {
            const jogadores = `${element.jogadorX} vs ${element.jogadorO}`;
            this.divRender.innerHTML += this.renderCard(jogadores, element.img);
        });
        
    }
    
    renderCard(jogadores, img){
        return `
                <div class="card text-white bg-primary mb-3" style="max-width: 40rem;">
                    <div class="card-header">${jogadores}</div>
                        <div class="card-body">
                            <img src="${img}" alt="" class="img-responsive">
                        </div>
                </div>
        `;
    }
}
