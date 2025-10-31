import fetch from "node-fetch";

async function run(){
  const base = process.env.BASE_URL || "http://localhost:3000";
  const h = await fetch(`${base}/api/health`).then(r=>r.json());
  console.log("health:", h);

  const s = await fetch(`${base}/api/search?q=bitcoin`).then(r=>r.json()).catch(()=>({items:[]}));
  console.log("search items:", s.items?.length||0);

  if(!h.ok) process.exit(1);
  console.log("OK");
}
run().catch(e=>{ console.error(e); process.exit(1) });


