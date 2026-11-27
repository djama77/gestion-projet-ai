# Bibliothèque documentaire — état d'implémentation

## Ce qui est ajouté dans le premier incrément

- Un catalogue versionné dans `docs/catalogues/corpus.json`.
- Un index de recherche initial dans `docs/catalogues/index.json`.
- Une route serveur `GET /api/library` qui expose le catalogue et les passages indexés.
- Un paramètre `q` pour rechercher dans les passages réellement présents dans l'index.
- Une interface `/bibliotheque` qui présente les collections recensées, l'état du corpus et les résultats de recherche avec provenance.
- Un affichage explicite du corpus vide : aucune source n'est présentée comme déjà assimilée.

## Contenu initial attesté

Le périmètre recensé dans le README comprend :
- Management et Leadership : 9 chapitres ;
- Gestion des compétences : 7 chapitres.

Ces nombres décrivent le plan pédagogique recensé. Aucun fichier source n'est ajouté par ce seul inventaire. Les niveaux de licence restent « à confirmer » tant qu'une source ou une validation ne les établit pas.

## Limites techniques actuelles

- Le catalogue et l'index sont des fichiers versionnés dans Git ; ce n'est pas encore un stockage privé multi-utilisateur ni un téléversement permanent depuis l'interface.
- L'index initial ne contient aucun passage.
- La recherche actuelle est une recherche littérale simple sur les passages indexés, sans classement sémantique.
- L'interface ne permet pas encore de téléverser, versionner ou supprimer des documents.
- Le stockage objet, l'authentification, les contrôles d'accès, l'extraction persistante, l'OCR et les tâches de traitement restent à réaliser.
- Aucune connexion Supabase n'est activée ; le fournisseur de stockage « autre » reste à préciser.

## Contrôle de vérité documentaire

Un résultat doit provenir d'un passage effectivement indexé. Les références de page ne sont affichées que si elles figurent dans les métadonnées du passage. Les cours présents dans le plan mais sans fichier source restent des collections recensées, pas des cours assimilés.

## Prochaine tranche

1. Choisir le mode de stockage alternatif (par exemple dépôt privé versionné ou stockage objet compatible S3) et confirmer ses contraintes.
2. Ajouter un import serveur avec contrôle MIME, taille, empreinte SHA-256 et détection de doublons.
3. Extraire les PDF avec conservation des numéros de page et stocker l'original et les passages.
4. Ajouter le versionnage et l'historique des métadonnées.
5. Implémenter l'authentification et les tests d'isolation avant l'ouverture à plusieurs utilisateurs.
6. Ajouter DOCX/PPTX puis OCR après validation des coûts et de la qualité.
