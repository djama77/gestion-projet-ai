import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const titles = ["","Prise de décision et arbitrage managérial","Audit de la motivation et de la performance collective","Conduite du changement dans une administration publique","Audit éthique d'un projet","Évaluation des compétences par le feedback 360°","Plan de formation et développement des compétences","GPEC : anticiper les besoins futurs en ressources humaines","Intelligence artificielle et recrutement responsable","Capitalisation des connaissances et mémoire organisationnelle","Synthèse : l'IA devient consultant en management et gestion des compétences"];
function isRecord(v:unknown):v is Record<string,unknown>{return typeof v==="object"&&v!==null&&!Array.isArray(v);}
function sectionAround(source:string,id:number,max:number){const patterns=[new RegExp("TP\\s*0?"+id+"\\s*[—:-]","i"),new RegExp("TRAVAUX PRATIQUES?\\s*0?"+id,"i")];let at=-1;for(const p of patterns){const m=p.exec(source);if(m){at=m.index;break;}}if(at<0)return source.slice(0,max);return source.slice(Math.max(0,at-500),Math.min(source.length,at+max));}
export async function POST(request:Request){
 try{
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:"Le service IA n'est pas configuré sur le serveur."},{status:503});
  const body:unknown=await request.json();if(!isRecord(body))return NextResponse.json({error:"Requête invalide."},{status:400});
  const id=Number(body.tpId),mode=body.mode,question=typeof body.question==="string"?body.question.slice(0,4000):"",difficulty=typeof body.difficulty==="string"?body.difficulty.slice(0,30):"intermédiaire",dataset=Array.isArray(body.dataset)?body.dataset.slice(0,100):[];
  if(!Number.isInteger(id)||id<1||id>10||!["guide","corrige"].includes(String(mode))||!question)return NextResponse.json({error:"TP, mode ou demande invalide."},{status:400});
  const root=process.cwd();
  const [subjects,solutions]=await Promise.all([
   fs.readFile(path.join(root,"docs/evaluations/TP_L3_management_leadership_competences.md"),"utf8"),
   fs.readFile(path.join(root,"docs/evaluations/CORRIGES_10_TP_L3_question_par_question.md"),"utf8")
  ]);
  const subjectContext=sectionAround(subjects,id,10500),solutionContext=sectionAround(solutions,id,12500);
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const completion=await client.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",temperature:0.25,max_tokens:4500,messages:[
   {role:"system",content:"Tu es un enseignant-tuteur de Licence 3 en management, leadership et gestion des compétences. Réponds en français, de manière détaillée, pédagogique et structurée. Base-toi prioritairement sur les consignes et le corrigé documentaire fournis. Distingue les données du sujet, les données simulées, les hypothèses et tes explications. N'invente jamais de consigne, de référence ou de résultat. Les corrigés de ce corpus sont indicatifs et ne doivent jamais être présentés comme officiels. Pour chaque question : rappelle la consigne, explique les notions utiles, déroule la méthode, montre les calculs si nécessaires, interprète le résultat, signale les erreurs fréquentes et formule une réponse argumentée. Si les extraits ne suffisent pas, indique-le explicitement."},
   {role:"system",content:"TP sélectionné : "+id+" — "+titles[id]+". Niveau : Licence 3. Difficulté souhaitée : "+difficulty+". Mode : "+mode+".\nSUJET ET CONSIGNES EXTRAITS DU CORPUS :\n"+subjectContext+"\n\nCORRIGÉ PÉDAGOGIQUE DU CORPUS :\n"+solutionContext},
   {role:"user",content:"Jeu de données transmis (s'il est vide, ne prétends pas avoir effectué de calculs sur des observations) : "+JSON.stringify(dataset)+"\n\nDemande : "+question}
  ]});
  return NextResponse.json({answer:completion.choices[0]?.message?.content||"Aucune réponse produite.",tpId:id,mode});
 }catch(error){console.error("TP L3 API error",error instanceof Error?error.message:"unknown");return NextResponse.json({error:"Le tuteur TP n'a pas pu traiter la demande. Vérifie que le corpus documentaire est présent et que le service IA est configuré."},{status:500});}
}
