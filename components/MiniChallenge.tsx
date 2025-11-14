'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

interface Challenge {
  id: number;
  title: string;
  code: string;
  answer: string;
  userAnswer?: string;
  options?: string[];
}

interface MiniChallengeProps {
  challenges: Challenge[];
}

export default function MiniChallenge({ challenges }: MiniChallengeProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const toggleAnswer = (id: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="my-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl">💪</span>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Mini-Desafios</h3>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        spaceBetween={20}
        slidesPerView={1}
        className="mini-challenge-swiper"
      >
        {challenges.map((challenge) => (
          <SwiperSlide key={challenge.id}>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md min-h-[420px] sm:min-h-[420px] flex flex-col">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                Desafio {challenge.id}: {challenge.title}
              </h4>

              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm">
                  <code>{challenge.code}</code>
                </pre>
              </div>

              {/* Campo de Resposta do Usuário */}
              {challenge.options ? (
                // Se tem opções, mostrar select dropdown
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Sua resposta:
                  </label>
                  <select
                    value={userAnswers[challenge.id] || ''}
                    onChange={(e) => handleAnswerChange(challenge.id, e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma resposta...</option>
                    {challenge.options.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ) : (
                // Se não tem opções, mostrar input de texto
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Sua resposta:
                  </label>
                  <input
                    type="text"
                    value={userAnswers[challenge.id] || ''}
                    onChange={(e) => handleAnswerChange(challenge.id, e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              <button
                onClick={() => toggleAnswer(challenge.id)}
                disabled={!userAnswers[challenge.id]}
                className={`w-full font-medium py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                  !userAnswers[challenge.id]
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {revealedAnswers[challenge.id] ? '🙈' : '👁️'} 
                {revealedAnswers[challenge.id] ? 'Ocultar' : 'Ver'} Resposta
              </button>

              {revealedAnswers[challenge.id] && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-fadeIn">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{challenge.answer}</p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .mini-challenge-swiper .swiper-button-next,
        .mini-challenge-swiper .swiper-button-prev {
          color: #4f46e5;
          width: 32px;
          height: 32px;
        }

        @media (min-width: 640px) {
          .mini-challenge-swiper .swiper-button-next,
          .mini-challenge-swiper .swiper-button-prev {
            width: 40px;
            height: 40px;
          }
        }

        .mini-challenge-swiper .swiper-button-next::after,
        .mini-challenge-swiper .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }

        @media (min-width: 640px) {
          .mini-challenge-swiper .swiper-button-next::after,
          .mini-challenge-swiper .swiper-button-prev::after {
            font-size: 24px;
          }
        }

        /* Esconder setas em mobile muito pequeno */
        @media (max-width: 480px) {
          .mini-challenge-swiper .swiper-button-next,
          .mini-challenge-swiper .swiper-button-prev {
            display: none;
          }
        }

        .mini-challenge-swiper .swiper-pagination-bullet {
          background: #4f46e5;
          opacity: 0.5;
          width: 8px;
          height: 8px;
        }

        @media (min-width: 640px) {
          .mini-challenge-swiper .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }
        }

        .mini-challenge-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
