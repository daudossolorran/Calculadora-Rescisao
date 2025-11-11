// Aguarda o DOM carregar antes de executar
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega o formulário
    const form = document.getElementById('calc-form');
    // Pega a div de resultado
    const resultadoDiv = document.getElementById('resultado');

    // Adiciona um "ouvinte" para o evento de 'submit' (envio) do formulário
    form.addEventListener('submit', (e) => {
        // Previne o comportamento padrão do formulário (que recarregaria a página)
        e.preventDefault();

        // 1. Captura dos Valores
        const salarioBruto = parseFloat(document.getElementById('salario').value);
        const dataAdmissaoStr = document.getElementById('data-admissao').value;
        const dataDemissaoStr = document.getElementById('data-demissao').value;
        const tipoAviso = document.getElementById('aviso-previo').value;

        // Validação básica
        if (!salarioBruto || !dataAdmissaoStr || !dataDemissaoStr || !tipoAviso) {
            resultadoDiv.innerHTML = '<p style="color: red;">Por favor, preencha todos os campos.</p>';
            return;
        }

        // Convertendo strings de data para objetos Date (UTC para evitar fuso horário)
        // Adicionamos 'T00:00:00' para garantir que seja interpretado como meia-noite local (que é UTC 00:00)
        const dataAdmissao = new Date(dataAdmissaoStr + 'T00:00:00');
        const dataDemissao = new Date(dataDemissaoStr + 'T00:00:00');

        if (dataDemissao < dataAdmissao) {
             resultadoDiv.innerHTML = '<p style="color: red;">A data de demissão não pode ser anterior à admissão.</p>';
            return;
        }

        // 2. Cálculos (Simplificados)

        // --- Saldo de Salário ---
        // Pega o dia do mês da demissão
        const diasTrabalhadosMes = dataDemissao.getUTCDate();
        const valorPorDia = salarioBruto / 30; // Convenção CLT
        const saldoSalario = valorPorDia * diasTrabalhadosMes;

        // --- Aviso Prévio ---
        const avisoPrevio = (tipoAviso === 'indenizado') ? salarioBruto : 0;

        // --- 13º Salário Proporcional ---
        // (Salário / 12) * meses trabalhados no ano
        // getUTCMonth() retorna de 0 (Jan) a 11 (Dez), por isso +1
        const mesesTrabalhadosAno = dataDemissao.getUTCMonth() + 1;
        const decimoTerceiro = (salarioBruto / 12) * mesesTrabalhadosAno;

        // --- Férias Proporcionais + 1/3 ---
        // (Simplificado: calculando proporcional ao ano, igual ao 13º)
        // Nota: O cálculo real depende do "período aquisitivo"
        const feriasProporcionais = (salarioBruto / 12) * mesesTrabalhadosAno;
        const tercoFerias = feriasProporcionais / 3;
        const totalFerias = feriasProporcionais + tercoFerias;

        // --- Total ---
        const totalRescisao = saldoSalario + avisoPrevio + decimoTerceiro + totalFerias;

        // 3. Exibição dos Resultados
        
        // Função para formatar como moeda (BRL)
        const formatarMoeda = (valor) => {
            return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        resultadoDiv.innerHTML = `
            <h3>Resumo da Rescisão</h3>
            <p>Saldo de Salário (${diasTrabalhadosMes} dias): <span>${formatarMoeda(saldoSalario)}</span></p>
            <p>Aviso Prévio Indenizado: <span>${formatarMoeda(avisoPrevio)}</span></p>
            <p>13º Salário Proporcional (${mesesTrabalhadosAno}/12): <span>${formatarMoeda(decimoTerceiro)}</span></p>
            <p>Férias Proporcionais + 1/3: <span>${formatarMoeda(totalFerias)}</span></p>
            
            <p class="total">Total Bruto Estimado: <span>${formatarMoeda(totalRescisao)}</span></p>
            <small style="text-align: center; display: block; margin-top: 15px;">
                *Este é um valor estimado. Não inclui descontos (INSS, IRRF) nem valores de FGTS (multa de 40% e saque).
            </small>
        `;
    });
});