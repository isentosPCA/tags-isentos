function checar() {
    var botoes = document.getElementsByName("buttonRadio");

    if (botoes[0].checked === false && botoes[1].checked === false) {
        // Nenhum botão de rádio está selecionado
        document.getElementById("placa").disabled = true;
        document.getElementById("orgao").disabled = true;
        document.getElementById("data_vigencia").disabled = true;
        document.getElementById("tag").disabled = true;
        document.getElementById("hash").disabled = true;
        document.getElementById("status").disabled = true;

        // Define a cor de fundo dos campos de input como cinza
        document.getElementById("placa").style.backgroundColor = "#ADADAD";
        document.getElementById("orgao").style.backgroundColor = "#ADADAD";
        document.getElementById("data_vigencia").style.backgroundColor = "#ADADAD";
        document.getElementById("tag").style.backgroundColor = "#ADADAD";
        document.getElementById("hash").style.backgroundColor = "#ADADAD";
        document.getElementById("status").style.backgroundColor = "#ADADAD";


    } else {
        // Botão de atualizar selecionado
        if (botoes[1].checked) {
            document.getElementById("placa").disabled = false;
            document.getElementById("orgao").disabled = true;
            document.getElementById("data_vigencia").disabled = true;
            document.getElementById("tag").disabled = true;
            document.getElementById("hash").disabled = true;
            document.getElementById("status").disabled = false;

            // Define a cor de fundo dos campos de input como cinza
         document.getElementById("placa").style.backgroundColor = "white";
         document.getElementById("orgao").style.backgroundColor = "#ADADAD";
         document.getElementById("data_vigencia").style.backgroundColor = "#ADADAD";
         document.getElementById("tag").style.backgroundColor = "#ADADAD";
         document.getElementById("hash").style.backgroundColor = "#ADADAD";
         document.getElementById("status").style.backgroundColor = "white";

            
        } else {

            //Botão de inserir selecionado

            document.getElementById("placa").disabled = false;
            document.getElementById("orgao").disabled = false;
            document.getElementById("data_vigencia").disabled = false;
            document.getElementById("tag").disabled = false;
            document.getElementById("hash").disabled = false;
            document.getElementById("status").disabled = false;

            // Define a cor de fundo dos campos de input como cinza
         document.getElementById("placa").style.backgroundColor = "white";
         document.getElementById("orgao").style.backgroundColor = "white";
         document.getElementById("data_vigencia").style.backgroundColor = "white";
         document.getElementById("tag").style.backgroundColor = "white";
         document.getElementById("hash").style.backgroundColor = "white";
         document.getElementById("status").style.backgroundColor = "white";
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checar();
});

function checarBt(tipo) {
    var hashcodeInput = document.getElementById("hashcode");
    var subhashInput = document.getElementById("subhash");
    var radioIndividual = document.getElementById("bt-radio-individual");
    var radioLote = document.getElementById("bt-radio-lote");

    if (tipo === 'individual') {
        hashcodeInput.disabled = false;
        subhashInput.disabled = true;
        hashcodeInput.style.backgroundColor = "white";
        subhashInput.style.backgroundColor = "#ADADAD";
    } else if (tipo === 'lote') {
        hashcodeInput.disabled = true;
        subhashInput.disabled = false;
        hashcodeInput.style.backgroundColor = "#ADADAD";
        subhashInput.style.backgroundColor = "white";
    }

    if (!radioIndividual.checked && !radioLote.checked) {
        hashcodeInput.disabled = true;
        subhashInput.disabled = true;
        hashcodeInput.style.backgroundColor = "#ADADAD";
        subhashInput.style.backgroundColor = "#ADADAD";
    }
}



document.addEventListener('DOMContentLoaded', function () {
    checarBt('lote');
    checarBt('individual');
});

document.addEventListener('DOMContentLoaded', function () {
    // Coloque seu código JavaScript aqui

    // Por exemplo, você pode adicionar a animação aqui
    const pontosElement = document.querySelector('.pontos');
    const carroIcon = document.querySelector('.fa-car-side');

    var totalCycles = 5;

    function exibirPontos(cycle) {
        let pontos = pontosElement.textContent;
        pontos += ".";
        pontosElement.textContent = pontos;

        if (pontos.length < 8 && window.innerWidth <= 768) {
            setTimeout(() => exibirPontos(cycle), 100);
        } else if (pontos.length < 20 && window.innerWidth > 768) {
            setTimeout(() => exibirPontos(cycle), 100);
        } else {
            carroIcon.style.display = "inline";
            if (cycle < totalCycles) {
                totalCycles++; 
                setTimeout(() => reiniciarAnimacao(cycle + 1), 1000);
                
            }
        }
    }
    

    function reiniciarAnimacao(cycle) {
        pontosElement.textContent = '';
        exibirPontos(cycle);
    }

    exibirPontos(1);
});


document.addEventListener('DOMContentLoaded', function () {
    const signInBtn = document.getElementById("signIn");
    const signUpBtn = document.getElementById("signUp");
    const fistForm = document.getElementById("form1");
    const secondForm = document.getElementById("form2");
    const container = document.querySelector(".container");

    signInBtn.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });

    signUpBtn.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });
});



document.addEventListener('DOMContentLoaded', function () {
    
const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

});

// Lado do Cliente (front.js)
function limparFormularioAposDownloadQRCode() {
    // Obtenha o formulário pelo ID e redefina seus campos
    const formulario = document.getElementById('meuFormulario');
    formulario.reset();
}

