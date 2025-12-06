"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.replace("/auth");
      }
    };

    checkAuth();
  }, [router]);

  const handleSendMessage = async (message: string): Promise<string> => {
    // TODO: Intégrer avec votre API de chat (OpenAI, Anthropic, etc.)
    // Pour l'instant, réponse simulée
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Réponses basiques selon le contexte
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("profil") || lowerMessage.includes("investisseur")) {
      return "Votre profil investisseur est déterminé par votre tolérance au risque, votre horizon d'investissement et vos objectifs financiers. Vous pouvez le découvrir en passant notre quiz sur la page Quiz.";
    }
    
    if (lowerMessage.includes("allocation") || lowerMessage.includes("répartition")) {
      return "L'allocation d'actifs consiste à répartir votre portefeuille entre différentes classes d'actifs (actions, obligations, crypto, etc.) selon votre profil de risque. Une allocation équilibrée peut inclure 60% d'actions, 30% d'obligations et 10% d'actifs alternatifs.";
    }
    
    if (lowerMessage.includes("risque") || lowerMessage.includes("volatilité")) {
      return "Le risque en investissement fait référence à la possibilité de perdre de l'argent. La volatilité mesure les variations de prix. Un profil prudent privilégie la stabilité, tandis qu'un profil dynamique accepte plus de volatilité pour un potentiel de rendement plus élevé.";
    }
    
    if (lowerMessage.includes("diversification")) {
      return "La diversification consiste à répartir vos investissements sur différents actifs, secteurs et zones géographiques pour réduire le risque. C'est l'un des principes fondamentaux de la gestion de portefeuille.";
    }
    
    return "Je comprends votre question. Pour des conseils personnalisés, je vous recommande de passer notre quiz pour découvrir votre profil investisseur, puis de consulter les analyses et actualités sur la plateforme.";
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Assistant Investy</h1>
          <p className="text-slate-600">Posez vos questions sur l'investissement</p>
        </div>
        
        <div className="h-[600px]">
          <ChatInterface onSendMessage={handleSendMessage} />
        </div>
      </div>
    </main>
  );
}

