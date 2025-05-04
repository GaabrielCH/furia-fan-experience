// src/initializeData.js
import { database } from './firebase';
import { ref, set } from 'firebase/database';

const initialData = {
  content: {
    players: {
      "kscerato": {
        name: "Kaike Cerato",
        role: "Rifler",
        stats: "1.15 Rating, 0.75 KPR",
        funFact: "Conhecido por sua precisão com a AK-47 e decisões táticas rápidas."
      },
      "yuurih": {
        name: "Yuri Santos",
        role: "Rifler/Lurker",
        stats: "1.18 Rating, 0.78 KPR",
        funFact: "Um dos jogadores mais consistentes da equipe desde a formação."
      },
      "chelo": {
        name: "Marcelo Cespedes",
        role: "Entry Fragger",
        stats: "1.09 Rating, 0.74 KPR",
        funFact: "Especialista em entradas e duelos de abertura."
      },
      "exit": {
        name: "André Gomes",
        role: "Support/Rifler",
        stats: "1.05 Rating, 0.68 KPR",
        funFact: "Versátil, pode adaptar seu estilo de jogo conforme necessário."
      },
      "saffee": {
        name: "Rafael Costa",
        role: "AWPer",
        stats: "1.12 Rating, 0.73 KPR",
        funFact: "O principal AWPer da equipe com reflexos impressionantes."
      }
    },
    matches: {
      upcoming: [
        {
          id: "match_001",
          opponent: "NAVI",
          date: "27/04/2025",
          time: "15:00",
          tournament: "ESL Pro League Season 23"
        },
        {
          id: "match_002",
          opponent: "Cloud9",
          date: "02/05/2025",
          time: "13:30",
          tournament: "BLAST Premier Spring Finals"
        }
      ],
      results: [
        {
          id: "result_001",
          opponent: "Team Liquid",
          result: "FURIA 2-0 Team Liquid",
          date: "20/04/2025"
        },
        {
          id: "result_002",
          opponent: "Complexity",
          result: "FURIA 1-2 Complexity",
          date: "18/04/2025"
        }
      ]
    },
    quizzes: {
      quiz_001: {
        questions: [
          {
            id: "q1",
            question: "Qual jogador da FURIA é conhecido como o 'Rei do Vini'?",
            options: ["kscerato", "yuurih", "chelo", "saffee"],
            correct_answer: "kscerato",
            points: 5
          },
          {
            id: "q2",
            question: "Em que ano a FURIA Esports foi fundada?",
            options: ["2016", "2017", "2018", "2019"],
            correct_answer: "2017",
            points: 5
          }
        ]
      }
    }
  }
};

export const initializeFirebaseData = async () => {
  try {
    await set(ref(database), initialData);
    console.log('Dados inicializados com sucesso no Firebase!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
    return false;
  }
};

// Exportamos uma função para ser chamada manualmente
// ou podemos executar diretamente se este arquivo for importado
// initializeFirebaseData();