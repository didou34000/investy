import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function POST(){
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data:{ session } } = await supabase.auth.getSession();
    if(!session) return NextResponse.json({ ok:false }, { status:401 });
    
    const token = randomUUID();
    const { error } = await supabase
      .from("email_unsubscribe")
      .upsert({ user_id: session.user.id, token });
    
    if(error) {
      console.error("Erreur création token:", error);
      return NextResponse.json({ ok:false, error:error.message }, { status:500 });
    }
    
    return NextResponse.json({ 
      ok:true, 
      token, 
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/u/${token}` 
    });
  } catch (error) {
    console.error("Erreur générale:", error);
    return NextResponse.json({ ok:false, error:"Erreur interne" }, { status:500 });
  }
}
