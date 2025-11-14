import { supabase } from "@/lib/supabaseClient";

export async function upsertUserProfile({
  email, name, profileType, riskIndex, expectedReturn, expectedVol, allocation
}:{
  email:string, name?:string, profileType:string, riskIndex:number, expectedReturn:number, expectedVol:number, allocation:any
}) {
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if(!user) throw new Error("not_authenticated");
  
  const { error } = await supabase.from("users_public").upsert({
    id: user.id, 
    email, 
    name: name||null, 
    profile_type: profileType,
    risk_index: riskIndex, 
    expected_return: expectedReturn, 
    expected_vol: expectedVol,
    allocation, 
    updated_at: new Date().toISOString()
  });
  
  if(error) throw error;
}

export async function saveQuizResult(answers:any, summary:any){
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  
  const { error } = await supabase.from("quiz_results").insert({
    user_id: user?.id ?? null, 
    answers, 
    summary
  });
  
  if(error) throw error;
}

export async function saveWatchlist(symbols:{symbol:string,label:string,category:string}[]){
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if(!user) throw new Error("not_authenticated");
  
  const payload = symbols.map(s => ({ user_id: user.id, ...s }));
  const { error } = await supabase.from("user_watchlist").upsert(payload);
  
  if(error) throw error;
}

export async function saveAlertPrefs(frequency:"daily"|"weekly", topics:string[]){
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if(!user) throw new Error("not_authenticated");
  
  const { error } = await supabase.from("alerts_settings").upsert({
    user_id: user.id, 
    frequency, 
    topics, 
    updated_at: new Date().toISOString()
  });
  
  if(error) throw error;
}
