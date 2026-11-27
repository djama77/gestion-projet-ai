# Mise en service de la persistance cloud

## État
Le dépôt contient un schéma de référence dans `supabase/schema.sql`. Il n'a pas été appliqué à un projet Supabase et aucune donnée n'a été envoyée vers un service externe.

## Avant activation
1. Choisir le projet Supabase dédié à Gestion-Projet-AI.
2. Confirmer l'organisation et le coût éventuel du projet.
3. Vérifier que le projet est actif et que les sauvegardes sont définies.
4. Générer une vraie migration avec Supabase CLI (`supabase migration new gestion_projet_ai_core`) à partir du schéma de référence.
5. Relire le SQL et tester les politiques RLS sur deux comptes distincts avant tout import réel.
6. Ajouter les variables de connexion au gestionnaire de secrets de l'hébergement, jamais à Git.

## Modèle de stockage
- Auth Supabase : identité et session vérifiées côté serveur.
- Postgres : documents, versions, passages et données de projet.
- Storage : bucket privé `gpai-documents`, chemins préfixés par l'UUID du propriétaire.
- Recherche : index plein texte PostgreSQL sur les passages.
- Projet : WBS, RACI, budget et risques stockés dans des tables relationnelles.

## Variables attendues après configuration
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Ne jamais placer une clé `service_role` ou une clé secrète dans une variable `NEXT_PUBLIC_*`. L'accès applicatif normal doit utiliser la session de l'utilisateur et les politiques RLS.

## Contrôles de sécurité à exécuter
- deux utilisateurs A et B ;
- A ne peut pas lister, lire, télécharger, rechercher, modifier ou supprimer les documents de B ;
- A ne peut pas accéder aux projets, tâches, budgets, risques ou matrices RACI de B ;
- les objets Storage hors du dossier de l'utilisateur sont inaccessibles ;
- une nouvelle version ne remplace jamais l'ancienne ;
- les suppressions d'un document nettoient passages et objets associés selon une procédure contrôlée.

## Limites actuelles de l'application
L'atelier de gestion de projet en cours de développement sauvegarde ses données dans le navigateur et permet export/import JSON. La synchronisation cloud ne sera annoncée comme disponible qu'après raccordement des API, authentification, migration et tests d'isolation.
