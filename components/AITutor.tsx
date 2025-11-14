"use client";
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITutorProps {
  lessonSlug: string;
  exerciseId?: string;
  lessonContent?: string;
}

export default function AITutor({ lessonSlug, exerciseId, lessonContent }: AITutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `👋 Olá! Sou seu assistente de aprendizado.\n\nEstou aqui para **ajudar você a entender** os conceitos, não para dar respostas prontas! 😊\n\n**Como posso ajudar:**\n• Explicar conceitos da lição\n• Dar dicas quando você está travado\n• Sugerir o que reler\n• Esclarecer dúvidas\n\n**O que NÃO faço:**\n• Não dou respostas diretas dos exercícios\n• Não resolvo por você\n\nPergunte qualquer coisa sobre a lição! 🚀`
      }]);
    }
  }, [isOpen, messages.length]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          lessonSlug,
          exerciseId,
          lessonContent,
        }),
      });

      if (!response.ok) throw new Error('Erro na resposta da IA');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Desculpe, tive um problema técnico. Tente novamente!'
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50 text-xl sm:text-2xl"
        title="Assistente IA"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] sm:h-[500px] max-h-[600px] bg-white rounded-lg shadow-2xl border-2 border-purple-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 sm:p-4 rounded-t-lg">
            <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
              🤖 Assistente Pedagógico
            </h3>
            <p className="text-xs text-purple-100">Estou aqui para ajudar você a aprender!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm">
                  <span className="inline-block animate-pulse">🤔 Pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 sm:p-3 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida..."
                className="flex-1 px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 hidden sm:block">
              💡 Pergunta exemplo: "O que é uma variável const?"
            </p>
          </div>
        </div>
      )}
    </>
  );
}
