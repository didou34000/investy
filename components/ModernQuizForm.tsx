"use client";

import { useState, useEffect } from "react";
import { QUIZ_QUESTIONS, calculateScore } from "@/lib/quiz-questions";
import { getProfileByScore, type InvestmentProfile } from "@/lib/quiz-profiles";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ArrowRight, CheckCircle, TrendingUp, Shield, AlertTriangle, Star } from "lucide-react";

interface QuizState {
  currentQuestion: number;
  answers: Record<string, number>;
  email: string;
  monthly: number;
  horizon: number;
  result: InvestmentProfile | null;
  showResult: boolean;
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

export default function ModernQuizForm() {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    email: "",
    monthly: 200,
    horizon: 10,
    result: null,
    showResult: false,
  });

  const handleAnswer = (value: number) => {
    const currentQuestionId = QUIZ_QUESTIONS[state.currentQuestion].id;
    const newAnswers = { ...state.answers, [currentQuestionId]: value };
    
    if (state.currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setState(prev => ({ ...prev, answers: newAnswers, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      // Last question, move to input section
      setState(prev => ({ ...prev, answers: newAnswers, currentQuestion: prev.currentQuestion + 1 }));
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(state.answers).length !== QUIZ_QUESTIONS.length) return;
    
    // Simulate API call
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.email,
        answers: state.answers,
        monthly: state.monthly,
        horizon: state.horizon,
      }),
    });
    const data = await response.json();

    setState(prev => ({
      ...prev,
      result: {
        id: data.profile,
        name: data.profileName,
        description: getProfileByScore(data.score).description,
        riskLevel: data.riskLevel,
        expectedReturn: data.expectedReturn,
        timeHorizon: data.timeHorizon,
        allocation: data.allocation,
        characteristics: getProfileByScore(data.score).characteristics,
        suitableFor: getProfileByScore(data.score).suitableFor,
        warnings: getProfileByScore(data.score).warnings,
        color: getProfileByScore(data.score).color,
        icon: getProfileByScore(data.score).icon,
      },
      showResult: true,
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem("investy_last_result", JSON.stringify(data));
    }
  };

  const resetQuiz = () => {
    setState({
      currentQuestion: 0,
      answers: {},
      email: "",
      monthly: 200,
      horizon: 10,
      result: null,
      showResult: false,
    });
  };

  if (state.showResult && state.result) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header avec profil */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
            <span className="text-2xl">{state.result.icon}</span>
            <div>
              <div className="text-sm font-medium text-blue-800">Votre profil investisseur</div>
              <div className="text-lg font-bold text-blue-900">{state.result.name}</div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{state.result.name}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">{state.result.description}</p>
        </div>

        {/* Métriques principales */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Rendement annuel</div>
                <div className="text-2xl font-bold text-slate-900">{(state.result.expectedReturn * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Niveau de risque</div>
                <div className="text-2xl font-bold text-slate-900">{state.result.riskLevel}/10</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Horizon recommandé</div>
                <div className="text-lg font-bold text-slate-900">{state.result.timeHorizon}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Volatilité</div>
                <div className="text-2xl font-bold text-slate-900">{(state.result.volatility * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation et simulation */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Allocation */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Allocation recommandée</h3>
            
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(state.result.allocation).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {Object.entries(state.result.allocation).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {Object.entries(state.result.allocation).map(([asset, percentage], index) => (
                <div key={asset} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-slate-900">{asset}</span>
                  </div>
                  <span className="font-bold text-slate-900">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Simulation */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Simulation d'investissement</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-medium">Montant mensuel</div>
                  <div className="text-2xl font-bold text-blue-900">{state.monthly} €</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-green-600 font-medium">Horizon</div>
                  <div className="text-2xl font-bold text-green-900">{state.horizon} ans</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-sm text-blue-600 font-medium mb-2">Valeur estimée après {state.horizon} ans</div>
                  <div className="text-4xl font-bold text-blue-900 mb-2">
                    {Math.round(state.monthly * 12 * state.horizon * (1 + state.result.expectedReturn)).toLocaleString("fr-FR")} €
                  </div>
                  <div className="text-sm text-blue-700">
                    Investissement total : {(state.monthly * 12 * state.horizon).toLocaleString("fr-FR")} €
                  </div>
                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    Projection éducative sur {state.horizon} ans — pas de promesse de rendement.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caractéristiques et conseils */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Caractéristiques */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Caractéristiques
            </h4>
            <ul className="space-y-2">
              {state.result.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Adapté pour */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              Adapté pour
            </h4>
            <ul className="space-y-2">
              {state.result.suitableFor.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Points d'attention */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Points d'attention
            </h4>
            <ul className="space-y-2">
              {state.result.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={resetQuiz}
            className="px-8 py-4 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            Refaire le quiz
          </button>
          <a
            href="/signin"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 text-center"
          >
            Créer mon espace Investy
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (state.currentQuestion < QUIZ_QUESTIONS.length) {
    const question = QUIZ_QUESTIONS[state.currentQuestion];
    const progress = ((state.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-600">
                Question {state.currentQuestion + 1} sur {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-sm font-medium text-slate-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              {question.question}
            </h2>
            {question.description && (
              <p className="text-lg text-slate-600">{question.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-lg">{option.text}</div>
                    {option.explanation && (
                      <div className="text-sm text-slate-600 mt-1">{option.explanation}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Formulaire des paramètres
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Informations complémentaires
          </h1>
          <p className="text-lg text-slate-600">
            Veuillez renseigner votre email et vos préférences d'investissement pour obtenir votre profil complet.
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Votre email
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="votre@email.com"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Montant mensuel (€)
              </label>
              <input
                type="number"
                value={state.monthly}
                onChange={(e) => setState(prev => ({ ...prev, monthly: Number(e.target.value) }))}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                min="50"
                step="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Horizon (années)
              </label>
              <input
                type="number"
                value={state.horizon}
                onChange={(e) => setState(prev => ({ ...prev, horizon: Number(e.target.value) }))}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                min="1"
                max="40"
              />
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!state.email || Object.keys(state.answers).length !== QUIZ_QUESTIONS.length}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 text-lg"
          >
            Calculer mon profil
          </button>
        </div>
      </div>
    </div>
  );
}
