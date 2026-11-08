

const produtosIniciais = [
    {
        referencia: "REF-1025",
        nome: "Tênis Casual Masculino",
        marca: "Marca Exemplo",
        tamanho: "40",
        rua: "03",
        corredor: "B",
        prateleira: "05",
        posicao: "12"
    },
    {
        referencia: "REF-2040",
        nome: "Sandália Feminina",
        marca: "Marca Exemplo",
        tamanho: "37",
        rua: "01",
        corredor: "A",
        prateleira: "02",
        posicao: "08"
    },
    {
        referencia: "REF-3050",
        nome: "Sapato Social Masculino",
        marca: "Marca Exemplo",
        tamanho: "42",
        rua: "04",
        corredor: "C",
        prateleira: "03",
        posicao: "15"
    }
];

const chaveEstoque = "stockfacil_produtos";

function carregarProdutos() {
    const dados = localStorage.getItem(chaveEstoque);

    if (dados === null) {
        localStorage.setItem(
            chaveEstoque,
            JSON.stringify(produtosIniciais)
        );

        return [...produtosIniciais];
    }

    try {
        const lista = JSON.parse(dados);

        if (Array.isArray(lista)) {
            return lista;
        }
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }

    return [];
}

let produtos = carregarProdutos();

function salvarProdutos() {
    localStorage.setItem(
        chaveEstoque,
        JSON.stringify(produtos)
    );
}

function criarCartao(produto, permitirEdicao) {
    const cartao = document.createElement("div");

    cartao.style.border = "1px solid #cbd5e1";
    cartao.style.padding = "12px";
    cartao.style.marginTop = "12px";
    cartao.style.borderRadius = "8px";

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const informacoes = [
        "Referência: " + produto.referencia,
        "Marca: " + produto.marca,
        "Tamanho: " + produto.tamanho,
        "Rua: " + produto.rua,
        "Corredor: " + produto.corredor,
        "Prateleira: " + produto.prateleira,
        "Posição: " + produto.posicao
    ];

    cartao.appendChild(nome);

    informacoes.forEach(function (informacao) {
        const linha = document.createElement("p");
        linha.textContent = informacao;
        cartao.appendChild(linha);
    });

    if (permitirEdicao) {
        const editar = document.createElement("button");
        editar.textContent = "Editar endereço";
        editar.type = "button";

        editar.addEventListener("click", function () {
            const rua = prompt("Nova rua:", produto.rua);
            if (rua === null) return;

            const corredor = prompt("Novo corredor:", produto.corredor);
            if (corredor === null) return;

            const prateleira = prompt("Nova prateleira:", produto.prateleira);
            if (prateleira === null) return;

            const posicao = prompt("Nova posição:", produto.posicao);
            if (posicao === null) return;

            if (
                !rua.trim() ||
                !corredor.trim() ||
                !prateleira.trim() ||
                !posicao.trim()
            ) {
                alert("Preencha todos os campos do endereço.");
                return;
            }

            produto.rua = rua.trim();
            produto.corredor = corredor.trim();
            produto.prateleira = prateleira.trim();
            produto.posicao = posicao.trim();

            salvarProdutos();
            listarProdutos();

            alert("Endereço atualizado com sucesso!");
        });

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir produto";
        excluir.type = "button";
        excluir.style.marginTop = "8px";
        excluir.style.background = "#dc2626";

        excluir.addEventListener("click", function () {
            const confirmar = confirm(
                "Deseja excluir este produto?"
            );

            if (confirmar) {
                const indice = produtos.indexOf(produto);

                if (indice !== -1) {
                    produtos.splice(indice, 1);
                    salvarProdutos();
                    listarProdutos();
                    alert("Produto excluído com sucesso!");
                }
            }
        });

        cartao.appendChild(editar);
        cartao.appendChild(excluir);
    }

    return cartao;
}

// PESQUISAR POR REFERÊNCIA
document.getElementById("buscar").addEventListener("click", function () {
    const referencia = document
        .getElementById("referencia")
        .value.trim()
        .toUpperCase();

    const resultado = document.getElementById("resultado");

    resultado.replaceChildren();

    if (referencia === "") {
        resultado.textContent = "Digite uma referência para pesquisar.";
        return;
    }

    const encontrados = produtos.filter(function (produto) {
        return produto.referencia.toUpperCase() === referencia;
    });

    if (encontrados.length === 0) {
        resultado.textContent = "Produto não encontrado no estoque.";
        return;
    }

    const titulo = document.createElement("h3");
    titulo.textContent = encontrados.length + " produto(s) encontrado(s)";
    resultado.appendChild(titulo);

    encontrados.forEach(function (produto) {
        resultado.appendChild(criarCartao(produto, false));
    });
});

// CADASTRAR PRODUTO
document.getElementById("formCadastro").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const novoProduto = {
        referencia: document.getElementById("novaReferencia").value.trim().toUpperCase(),
        nome: document.getElementById("nomeProduto").value.trim(),
        marca: document.getElementById("marcaProduto").value.trim(),
        tamanho: document.getElementById("tamanhoProduto").value.trim(),
        rua: document.getElementById("ruaProduto").value.trim(),
        corredor: document.getElementById("corredorProduto").value.trim(),
        prateleira: document.getElementById("prateleiraProduto").value.trim(),
        posicao: document.getElementById("posicaoProduto").value.trim()
    };

    const mensagem = document.getElementById("mensagemCadastro");

    const duplicado = produtos.some(function (produto) {
        return (
            produto.referencia.toUpperCase() === novoProduto.referencia &&
            produto.nome.trim().toLowerCase() === novoProduto.nome.toLowerCase() &&
            String(produto.tamanho) === novoProduto.tamanho
        );
    });

    if (duplicado) {
        mensagem.textContent =
            "Essa referência, modelo e tamanho já estão cadastrados!";
        return;
    }

    produtos.push(novoProduto);
    salvarProdutos();

    mensagem.textContent = "Produto cadastrado com sucesso!";
    document.getElementById("formCadastro").reset();
});

// LISTAR TODOS OS PRODUTOS
function listarProdutos() {
    const lista = document.getElementById("listaProdutos");

    lista.replaceChildren();

    if (produtos.length === 0) {
        lista.textContent = "Nenhum produto cadastrado.";
        return;
    }

    produtos.forEach(function (produto) {
        lista.appendChild(criarCartao(produto, true));
    });
}

document.getElementById("listarProdutos").addEventListener(
    "click",
    listarProdutos
);

