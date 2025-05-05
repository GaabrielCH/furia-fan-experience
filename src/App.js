import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { ref, onValue, set } from 'firebase/database';
import furiaBanner from './assets/furia-banner.png';
import furiaLogo from './assets/furia-logo.png';
import { database } from './firebase';

import { FiRefreshCw } from 'react-icons/fi';

function App() {
  const [nextMatches, setNextMatches] = useState([
    {
      opponent: "The Mongolz",
      date: "10/05/2025",
      tournament: "PGL Astana 2025",
      time: "15:00"
    }
  ]);
  
  const [recentResults, setRecentResults] = useState([
    {
      result: "The Mongolz 2 - 0 FURIA | PGL Bucharest 2025 - 12-14th",
      date: "09/04/2025"
    },
    {
      result: "Virtus Pro 2 - 0 FURIA | PGL Bucharest 2025 - 12-14th",
      date: "08/04/2025"
    },
    {
      result: "Complexity 2 - 0 FURIA | PGL Bucharest 2025 - 12-14th",
      date: "07/04/2025"
    }
  ]);
  
  const [playerInfo, setPlayerInfo] = useState({
    kscerato: {
      name: "Kaike Cerato - kscerato",
      role: "Rifler",
      stats: "1.19 Rating (últimos 3 meses)",
      funFact: "Conhecido como 'O Predador', é o jogador mais consistente da FURIA nos últimos anos."
    },
    yuurih: {
      name: "Yuri Santos - Yuurih",
      role: "Rifler",
      stats: "1.11 Rating (últimos 3 meses)",
      funFact: "Foi promovido da equipe acadêmica da FURIA em 2018 e nunca mais saiu do time principal."
    },
    fallen: {
      name: "Gabriel Toledo - fallen",
      role: "AWPer / IGL",
      stats: "0.93 Rating (últimos 3 meses)",
      funFact: "Conhecido como 'O Professor', é o jogador brasileiro mais vitorioso da história do CS."
    },
    molodoy: {
      name: "Danil Golubenko - molodoy",
      role: "Rifler",
      stats: "1.24 Rating (últimos 3 meses)",
      funFact: "O mais novo integrante do time, chegou em 2025 para substituir chelo."
    },
    yekindar: {
      name: "Mareks Gaļinskis - yekindar",
      role: "Entry Fragger",
      stats: "1.13 Rating (últimos 3 meses)",
      funFact: "Estrela que já jogou pela Virtus Pro, é conhecido por seu estilo agressivo de jogo."
    }
  });
  
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(`user_${Math.floor(Math.random() * 1000000)}`);
  const [userPoints, setUserPoints] = useState(0);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const userPointsRef = ref(database, `users/${userId}/points`);
    onValue(userPointsRef, (snapshot) => {
      const points = snapshot.val() || 0;
      setUserPoints(points);
    });

    set(ref(database, `users/${userId}/points`), 10);
    set(ref(database, `users/${userId}/created_at`), new Date().toISOString());
    set(ref(database, `users/${userId}/last_login`), new Date().toISOString());

    if (!welcomeShown) {
      showWelcomeMessage();
      setWelcomeShown(true);
    }
  }, [userId]);

  const showWelcomeMessage = () => {
    setTimeout(() => {
      receiveMessage("Olá, fanático da FURIA! 🖤💚 Bem-vindo à experiência oficial de fãs da FURIA Esports!");
    }, 500);

    setTimeout(() => {
      receiveMessage("Eu sou o FURIAbot, seu assistente pessoal para tudo relacionado ao time de CS2 da FURIA. Como posso ajudar hoje?");
    }, 1500);

    setTimeout(() => {
      receiveMessage("Você pode me perguntar sobre:\n- Próximas partidas\n- Resultados recentes\n- Informações dos jogadores\n- Participar de quiz e desafios");
    }, 2500);
  };

  const quizQuestions = [
    {
      question: "Qual jogador da FURIA é conhecido como o 'Professor'?",
      options: {
        a: "kscerato",
        b: "yuurih",
        c: "yekindar",
        d: "fallen"
      },
      correctAnswer: "d",
      points: 5
    },
    {
      question: "Em que ano a FURIA foi fundada?",
      options: {
        a: "2015",
        b: "2016",
        c: "2017",
        d: "2018"
      },
      correctAnswer: "c",
      points: 10
    },
    {
      question: "Qual foi o maior achievement da FURIA no CS2 até agora?",
      options: {
        a: "Vencer o Major de Berlim",
        b: "Chegar nas semifinais do ESL Pro League",
        c: "Ganhar o Intel Extreme Masters",
        d: "Ser campeã mundial"
      },
      correctAnswer: "b",
      points: 15
    }
  ];

  const promptNextQuestion = () => {
    if (!isProcessing && !quizActive) {
      setTimeout(() => {
        receiveMessage("O que mais você gostaria de saber sobre a FURIA?");
      }, 500);
    }
  };

  const processUserInput = (text) => {
    setIsProcessing(true);
    const lowerText = text.toLowerCase().trim();

    if (quizActive) {
      handleQuizAnswer(lowerText);
      return;
    }

    if (lowerText.includes("próxima") && (lowerText.includes("partida") || lowerText.includes("jogo") || lowerText.includes("match"))) {
      let response = "📅 **Próximas partidas da FURIA:**\n\n";
      nextMatches.forEach(match => {
        response += `🔥 FURIA vs ${match.opponent}\n📆 ${match.date} às ${match.time || "TBD"}\n🏆 ${match.tournament}\n\n`;
      });
      receiveMessage(response);
      setTimeout(() => {
        setIsProcessing(false);
        promptNextQuestion();
      }, 1000);
      return;
    }
    
    if (lowerText.includes("resultado") || (lowerText.includes("último") && lowerText.includes("jogo"))) {
      let response = "📊 **Resultados recentes:**\n\n";
      recentResults.forEach(result => {
        response += `⚔️ ${result.result}\n📆 ${result.date}\n\n`;
      });
      receiveMessage(response);
      setTimeout(() => {
        setIsProcessing(false);
        promptNextQuestion();
      }, 1000);
      return;
    }

    const playerNames = ["kscerato", "yuurih", "fallen", "molodoy", "yekindar"];
    for (const playerName of playerNames) {
      if (lowerText.includes(playerName)) {
        const player = playerInfo[playerName];
        if (player) {
          const response = `👤 **${playerName.toUpperCase()}**\n\nNome: ${player.name}\nFunção: ${player.role}\nEstatísticas: ${player.stats}\n\nCuriosidade: ${player.funFact}`;
          receiveMessage(response);
          setTimeout(() => {
            setIsProcessing(false);
            promptNextQuestion();
          }, 1000);
          return;
        }
      }
    }

    if (lowerText.includes("jogadores") || lowerText.includes("time") || lowerText.includes("lineup")) {
      const response = "👥 **Lineup atual da FURIA CS2:**\n\n- kscerato (Kaike Cerato)\n- yuurih (Yuri Santos)\n- fallen (Gabriel Toledo)\n- molodoy (Danil Golubenko)\n- yekindar (Mareks Gaļinskis)\n\n Sobre qual jogador você quer saber mais?";
      receiveMessage(response);
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      return;
    }

    if (lowerText.includes("quiz") || lowerText.includes("desafio")) {
      startQuiz();
      return;
    }
    
    if (lowerText.includes("ponto") || lowerText.includes("score") || lowerText.includes("pontuação")) {
      receiveMessage(`🏆 Você tem **${userPoints} pontos** na sua conta de fã da FURIA!\n\nParticipe de quizzes e desafios para ganhar mais pontos e subir no ranking.`);
      setTimeout(() => {
        setIsProcessing(false);
        promptNextQuestion();
      }, 1000);
      return;
    }

    if (lowerText.includes("furia") || lowerText.includes("sobre o time") || lowerText.includes("história")) {
      const response = "🖤💚 **FURIA Esports** é uma organização brasileira de esports fundada em 2017. A equipe de CS2 da FURIA é conhecida por seu estilo de jogo agressivo e pela dedicação dos jogadores. A FURIA se destaca como uma das melhores equipes da América Latina e conquistou reconhecimento mundial, especialmente após chegar às semifinais do ESL Pro League em 2024.";
      receiveMessage(response);
      setTimeout(() => {
        setIsProcessing(false);
        promptNextQuestion();
      }, 1000);
      return;
    }

    receiveMessage("Não entendi completamente sua pergunta. Você pode me perguntar sobre próximas partidas, resultados recentes, informações dos jogadores, ou iniciar um quiz sobre a FURIA!");
    setTimeout(() => {
      setIsProcessing(false);
      promptNextQuestion();
    }, 1000);
  };

  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQuestion(0);
    receiveMessage("🎮 **Quiz da FURIA!** Responda corretamente e ganhe pontos!");
    receiveMessage("Você pode responder com:\n- Letra (a, b, c, d)\n- Número (1, 2, 3, 4)\n- Nome do jogador (para perguntas sobre jogadores)");
    
    setTimeout(() => {
      askQuestion(0);
      setIsProcessing(false);
    }, 1000);
  };

  const askQuestion = (index) => {
    if (index < quizQuestions.length) {
      const question = quizQuestions[index];
      receiveMessage(`Pergunta ${index + 1}: ${question.question}`);
      
      let optionsText = "";
      let optionNumber = 1;
      for (const [key, value] of Object.entries(question.options)) {
        optionsText += `${key.toUpperCase()}) ${value} (ou ${optionNumber})\n`;
        optionNumber++;
      }
      
      receiveMessage(optionsText);
    } else {
      endQuiz();
    }
  };

  const handleQuizAnswer = (answer) => {
    const currentQ = quizQuestions[currentQuestion];
    
    const numberToLetterMap = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
    let normalizedAnswer = answer.toLowerCase();
    
    if (['1', '2', '3', '4'].includes(normalizedAnswer)) {
      normalizedAnswer = numberToLetterMap[normalizedAnswer];
    }
    
    const optionValues = Object.values(currentQ.options);
    const optionIndex = optionValues.findIndex(opt => opt.toLowerCase() === normalizedAnswer);
    if (optionIndex !== -1) {
      normalizedAnswer = Object.keys(currentQ.options)[optionIndex];
    }
  
    if (['a', 'b', 'c', 'd'].includes(normalizedAnswer)) {
      if (normalizedAnswer === currentQ.correctAnswer) {
        const newPoints = userPoints + currentQ.points;
        setUserPoints(newPoints);
        set(ref(database, `users/${userId}/points`), newPoints);
        receiveMessage(`✅ Resposta correta! Você ganhou ${currentQ.points} pontos! 🎉`);
      } else {
        receiveMessage(`❌ Resposta incorreta. A resposta correta era ${currentQ.correctAnswer.toUpperCase()}) ${currentQ.options[currentQ.correctAnswer]}`);
      }
      
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      
      setTimeout(() => {
        if (nextQuestionIndex < quizQuestions.length) {
          askQuestion(nextQuestionIndex);
        } else {
          endQuiz();
        }
      }, 1500);
    } else {
      receiveMessage("Por favor, responda com:\n- Letra (a, b, c, d)\n- Número (1, 2, 3, 4)\n- Nome da opção correta");
      setIsProcessing(false);
    }
  };
  
  const endQuiz = () => {
    setQuizActive(false);
    receiveMessage(`🏁 Quiz concluído! Seu total de pontos agora é: ${userPoints}`);
    
    setTimeout(() => {
      receiveMessage("O que mais você gostaria de saber sobre a FURIA? Você pode perguntar sobre:");
      receiveMessage("- Próximas partidas\n- Resultados recentes\n- Informações dos jogadores\n- Notícias do time\n- Outro quiz");
      setIsProcessing(false);
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "" || isProcessing) return;

    setMessages([...messages, { text: input, isUser: true }]);
    processUserInput(input);
    setInput("");
  };

  const receiveMessage = (text) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
  };

  const resetChat = () => {
    setMessages([]);
    setQuizActive(false);
    setCurrentQuestion(0);
    setIsProcessing(true);
    setTimeout(() => {
      showWelcomeMessage();
      setTimeout(() => setIsProcessing(false), 2600);
    }, 300);
  };

  return (
    <div className="app">
      <header className="header">
        <img src={furiaLogo} alt="FURIA Logo" className="logo" />
        <h1>FURIA Fan Experience</h1>
        <div className="points-container">
          <span className="points-label">Seus pontos:</span>
          <span className="points-value">{userPoints}</span>
        </div>
      </header>
      
      <div className="banner-container">
        <img src={furiaBanner} alt="FURIA Banner" className="banner" />
      </div>
      
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? "user-message" : "bot-message"}`}>
              {message.isUser ? null : <img src={furiaLogo} alt="FURIA" className="message-avatar" />}
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <form className="input-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo sobre a FURIA..."
              className="message-input"
              disabled={isProcessing}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={isProcessing}
            >
              Enviar
            </button>
            <button 
              type="button"
              className="reset-button" 
              onClick={resetChat} 
              title="Resetar conversa"
              disabled={isProcessing}
            >
              <FiRefreshCw size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;