import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { analisarFrequencia, gerarPropostaAcao } from '../logic/analyzer';

export default function Dashboard({ dadosBrutos }) {
  const topTermos = analisarFrequencia(dadosBrutos);
  const termoPrincipal = topTermos[0]?.termo || "N/A";

  const data = {
    labels: topTermos.map(t => t.termo),
    datasets: [{
      label: 'Frequência de Ocorrência',
      data: topTermos.map(t => t.qtd),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="card">
          <h3>Ponto Focal Detectado</h3>
          <p className="highlight">{termoPrincipal.toUpperCase()}</p>
        </div>
        <div className="card">
          <h3>Sugestão de Campanha</h3>
          <p>{gerarPropostaAcao(termoPrincipal)}</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={data} options={{ responsive: true }} />
      </div>

      <div className="keywords-list">
        <h3>Palavras-Chave Mais Repetidas</h3>
        <ul>
          {topTermos.map((item, index) => (
            <li key={index}><strong>{item.termo}</strong>: {item.qtd} vezes</li>
          ))}
        </ul>
      </div>
    </div>
  );
}