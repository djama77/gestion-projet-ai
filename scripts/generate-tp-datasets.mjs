#!/usr/bin/env node
/**
 * Générateur pédagogique de jeux de données synthétiques pour les 10 TP de Licence 3.
 * Usage : node scripts/generate-tp-datasets.mjs [--tp 1..10] [--rows N] [--seed N]
 * Les données sont fictives. Elles ne décrivent aucune personne ni organisation réelle.
 */
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,arr)=>{
  if(v.startsWith("--")) a.push([v.slice(2), arr[i+1] && !arr[i+1].startsWith("--") ? arr[i+1] : "true"]);
  return a;
},[]));
const seed0 = Number(args.seed ?? 20261127);
let seed = seed0 >>> 0;
const rand = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
const pick = xs => xs[Math.floor(rand()*xs.length)];
const int = (min,max)=>Math.floor(rand()*(max-min+1))+min;

const templates = [
 {id:1,title:"Prise de décision et arbitrage managérial",file:"tp01_decision",fields:["option","budget_fdj","beneficiaires_estimes","impact_social_1_5","faisabilite_1_5","urgence_1_5"],rows:[
  ["Eau potable",1800000,420,5,4,5],["Santé",2200000,360,5,3,4],["Formation",950000,180,4,5,3],["Assainissement",1500000,300,5,4,4],["Insertion professionnelle",1200000,150,4,4,3]]},
 {id:2,title:"Audit de la motivation et de la performance collective",file:"tp02_motivation",fields:["agent_id","anciennete_ans","reconnaissance_1_5","autonomie_1_5","charge_travail_1_5","motivation_1_5","performance_1_5"],rows:[]},
 {id:3,title:"Conduite du changement dans une administration publique",file:"tp03_changement",fields:["service","effectif","adhesion_1_5","resistance_1_5","formation_jours","communication_requise"],rows:[
  ["Accueil",12,3,3,2,"Réunions et démonstrations"],["État civil",9,2,4,4,"Ateliers et tutorat"],["Finances",8,3,3,3,"Notes et ateliers"],["Archives",6,2,5,5,"Accompagnement individuel"],["Direction",5,4,2,2,"Comité de pilotage"]]},
 {id:4,title:"Audit éthique d'un projet",file:"tp04_ethique",fields:["risque","probabilite_1_5","gravite_1_5","niveau","mesure_preventive"],rows:[
  ["Conflit d'intérêts",3,5,"Élevé","Déclaration et récusation"],["Fuite de données",2,5,"Élevé","Contrôle des accès"],["Discrimination",3,5,"Élevé","Audit d'équité"],["Manque de transparence",4,3,"Élevé","Publication des critères"],["Détournement du budget",2,5,"Élevé","Double validation"]]},
 {id:5,title:"Évaluation des compétences par le feedback 360°",file:"tp05_feedback360",fields:["evaluateur_id","categorie","communication_1_5","leadership_1_5","gestion_conflits_1_5","planification_1_5","travail_equipe_1_5"],rows:[]},
 {id:6,title:"Plan de formation et développement des compétences",file:"tp06_formation",fields:["agent_id","competence","niveau_actuel_1_4","niveau_cible_1_4","ecart","formation_proposee","cout_fdj"],rows:[
  ["A01","Analyse des données",1,3,2,"Excel avancé et analyse",60000],["A02","Gestion de projet",2,3,1,"Planification et risques",45000],["A03","Communication",1,3,2,"Communication professionnelle",30000],["A04","Suivi-évaluation",1,3,2,"Indicateurs et tableaux de bord",50000],["A05","Outils informatiques",2,3,1,"Bureautique collaborative",25000]]},
 {id:7,title:"GPEC : anticiper les besoins futurs en ressources humaines",file:"tp07_gpec",fields:["metier","effectif_actuel","besoin_dans_2_ans","ecart"],rows:[
  ["Analystes de données",2,5,3],["Informaticiens",3,5,2],["Suivi-évaluation",2,4,2],["Gestionnaires de projets",4,5,1],["Techniciens de terrain",9,10,1]]},
 {id:8,title:"IA et recrutement responsable",file:"tp08_recrutement_ia",fields:["candidat_id","competences_techniques_1_5","experience_1_5","communication_1_5","ethique_1_5","score_pondere_sur_100","decision_humaine"],rows:[]},
 {id:9,title:"Capitalisation des connaissances et mémoire organisationnelle",file:"tp09_connaissances",fields:["fiche_id","service","type_connaissance","titre_pratique","niveau_validation","responsable_validation"],rows:[
  ["K01","Planification","Explicite","Modèle de plan de travail","Validé","Responsable projet"],["K02","Terrain","Tacite","Organisation des visites","À vérifier","Chef d'équipe"],["K03","Suivi-évaluation","Explicite","Fiche de suivi des indicateurs","Validé","Chargé S&E"],["K04","Administration","Tacite","Gestion des urgences","À documenter","Chef de service"]]},
 {id:10,title:"Synthèse : l'IA devient consultant en management et gestion des compétences",file:"tp10_synthese",fields:["lot","tache","responsable","duree_jours","budget_fdj","risque_1_5","indicateur"],rows:[
  ["Diagnostic","Cartographier les compétences","RH",5,120000,2,"Taux de couverture des postes"],["Planification","Construire le WBS et le Gantt","Chef de projet",4,90000,3,"Jalons tenus"],["Formation","Déployer les formations prioritaires","Formateur",10,300000,3,"Progression moyenne"],["Suivi","Mettre à jour le tableau de bord","Chargé S&E",3,60000,2,"Indicateurs actualisés"],["Éthique IA","Auditer les décisions assistées","Référent éthique",2,50000,4,"Taux de décisions revues"]]}
];

for(let i=0;i<30;i++){
 const id="A"+String(i+1).padStart(2,"0");
 templates[1].rows.push([id,int(1,18),int(1,5),int(1,5),int(1,5),int(1,5),int(1,5)]);
 templates[4].rows.push(["E"+String(i+1).padStart(2,"0"),pick(["Supérieur","Pair","Collaborateur","Autoévaluation"]),int(2,5),int(2,5),int(1,5),int(2,5),int(2,5)]);
 const a=int(1,5),b=int(1,5),c=int(1,5),d=int(1,5);
 const score=Math.round((a*0.4+b*0.25+c*0.15+d*0.2)/5*100);
 templates[7].rows.push(["C"+String(i+1).padStart(2,"0"),a,b,c,d,score,"À examiner par le jury"]);
}
const outDir=path.resolve("data/datasets/licence3");
fs.mkdirSync(outDir,{recursive:true});
const chosen=templates.filter(t=>!args.tp || t.id===Number(args.tp));
if(!chosen.length) throw new Error("--tp doit être compris entre 1 et 10");
for(const t of chosen){
 let rows=t.rows.slice();
 const wanted=Number(args.rows ?? rows.length);
 if(wanted>rows.length && rows.length){
  const original=rows.slice();
  while(rows.length<wanted){ const r=original[rows.length%original.length].slice(); r[0]=String(r[0])+"_S"+String(rows.length+1); rows.push(r); }
 }
 rows=rows.slice(0,wanted);
 const payload={id:t.id,niveau:"Licence 3",matiere:"Management, leadership et gestion des compétences",titre:t.title,statut_donnees:"SIMULÉES — usage pédagogique uniquement",seed:seed0,variables:t.fields,observations:rows.map(r=>Object.fromEntries(t.fields.map((f,i)=>[f,r[i]])))};
 fs.writeFileSync(path.join(outDir,t.file+".json"),JSON.stringify(payload,null,2)+"\n","utf8");
 const esc=v=>{const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;};
 const csv=[t.fields.join(","),...rows.map(r=>r.map(esc).join(","))].join("\n")+"\n";
 fs.writeFileSync(path.join(outDir,t.file+".csv"),csv,"utf8");
 console.log("Généré :",t.file,"—",rows.length,"lignes");
}
