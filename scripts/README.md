# Scripts de Gestion de la Base de Données Molty

Ce dossier contient les scripts pour nettoyer, uploader les assets et re-seeder la base de données avec des données réalistes et cohérentes.

## 🚀 Utilisation Rapide

### Reset Complet (Recommandé)
```bash
npm run reset:database
```
Cette commande exécute séquentiellement :
1. Nettoyage complet de la DB
2. Upload des assets vers Firebase Storage  
3. Seeding complet avec données réalistes

## 📋 Scripts Individuels

### 1. Nettoyage de la Base de Données
```bash
npm run clean:database
```
**Fonction :** Supprime TOUTES les données de Firestore et Firebase Storage
- ✅ Vide toutes les collections (users, annonces, applications, etc.)
- ✅ Supprime tous les fichiers du Storage (avatars, images, documents)
- ✅ Rapport détaillé des suppressions

**⚠️ ATTENTION :** Cette opération est irréversible !

### 2. Upload des Assets
```bash
npm run upload:assets
```
**Fonction :** Upload les images locales vers Firebase Storage avec nomenclature optimisée
- 📤 Upload des photos de profil (homme1.jpg → mentor-boulanger.jpg)
- 📤 Upload des images d'annonces (boulangerie1.jpg → annonce-boulangerie.jpg)
- 🔗 URLs publiques générées automatiquement
- 📄 Génère `assetMapping.json` pour le seeding

### 3. Seeding Complet
```bash
npm run seed:complete
```
**Fonction :** Crée des données réalistes et cohérentes
- 👑 1 Admin : `admin@molty.fr`
- 🏢 7 Mentors avec expertises variées
- 💼 7 Molts avec profils complets
- 📝 7 Annonces (1 par mentor max)
- 📋 7 Candidatures avec statuts variés
- 📰 4 Articles de blog

## 📊 Données Créées

### 👥 Profils Utilisateurs

**Mentors (7) :**
- Antoine Moreau - Boulanger artisanal (Lyon)
- Sophie Martin - Épicière fine (Bordeaux)  
- Marie Dubois - Fleuriste créatrice (Marseille)
- Paul Rousseau - Boucher traditionnel (Toulouse)
- Clara Leroy - Libraire spécialisée (Nantes)
- Julien Bernard - Restaurateur (Lille)
- Isabelle Moreau - Coach reconversion (Strasbourg)

**Molts (7) :**
- Développeurs, Designer, Chef de projet, Marketing, Gestion, Commercial
- Mix utilisateurs premium/gratuits
- Expériences professionnelles complètes
- Répartition géographique France

### 🏪 Annonces (7)
1. **Apprenti Boulanger** - Formation alternance (Lyon)
2. **Vendeur Épicerie Fine** - CDI (Bordeaux)
3. **Assistant Fleuriste** - Stage 6 mois (Marseille)
4. **Boucher Qualifié** - CDI (Toulouse)
5. **Libraire Temps Partiel** - CDD (Nantes)
6. **Serveur-Cuisinier** - CDI (Lille)
7. **Formation Reconversion** - Programme 6 mois (Strasbourg)

### 📋 Candidatures (7)
- Statuts variés : pending, reviewed, accepted, rejected
- Messages personnalisés pour utilisateurs premium
- Respect de la logique métier (1 candidature max par Molt/annonce)

### 📰 Articles (4)
- Reconversion professionnelle
- Témoignages de commerçants
- Guide choix local commercial
- Conseils premiers clients

## 🔧 Scripts Legacy (Conservés)

Ces scripts sont conservés pour compatibilité mais les nouveaux scripts sont recommandés :

```bash
npm run seed:articles        # Articles uniquement
npm run seed:mentors         # Mentors uniquement  
npm run seed:molts          # Molts uniquement
npm run seed:annonces-mentors # Annonces pour mentors
npm run migrate:email        # Migration données
npm run create:test-accounts # Comptes de test
```

## 🎯 Logique Métier Respectée

### Cardinalités
- ✅ 1 annonce maximum par mentor
- ✅ 1 candidature maximum par Molt/annonce
- ✅ Références cohérentes entre collections

### Données Réalistes
- ✅ Emails professionnels cohérents
- ✅ Localisations géographiques françaises
- ✅ Expertises métiers authentiques
- ✅ Images appropriées aux profils

### Sécurité
- ✅ Toutes les données passent par le système de sanitization
- ✅ URLs d'images publiques et sécurisées
- ✅ Timestamps Firestore corrects

## 🔍 Vérifications Post-Seeding

Le script `seedComplete.js` effectue automatiquement :
- ✅ Comptage des documents par collection
- ✅ Vérification cardinalité (1 annonce/mentor max)
- ✅ Intégrité des références entre collections
- ✅ Validation des données métier

## 📁 Structure des Assets

```
scripts/assets/
├── homme1.jpg → mentor-boulanger.jpg
├── femme1.jpg → mentor-epiciere.jpg
├── femme2.jpg → mentor-fleuriste.jpg
├── homme2.jpg → mentor-boucher.jpg
├── femme3.jpg → mentor-libraire.jpg
├── homme3.jpg → mentor-restaurateur.jpg
├── femme4.jpg → mentor-coach.jpg
├── homme4.jpg → molt-dev1.jpg
├── homme5.jpg → molt-dev2.jpg
├── femme5.jpg → molt-designer.jpg
├── femme6.jpg → molt-pm.jpg
├── boulangerie1.jpg → annonce-boulangerie.jpg
├── epicerie1.jpg → annonce-epicerie.jpg
├── fleuriste1.webp → annonce-fleuriste.webp
├── boucherie1.jpg → annonce-boucherie.jpg
├── librairie1.jpg → annonce-librairie.jpg
├── restauration1.jpg → annonce-restaurant.jpg
└── boulangerie2.webp → annonce-formation.webp
```

## 🔄 Workflow Recommandé

1. **Reset complet :** `npm run reset:database`
2. **Vérifier les données :** Se connecter à la plateforme avec Google OAuth
3. **Tester les fonctionnalités :** Navigation, candidatures, profils
4. **Développement :** Utiliser les emails des profils créés pour tester

## ⚠️ Variables d'Environnement Requises

Assurez-vous que ces variables sont configurées dans votre `.env` :

```env
# Firebase Admin
PROJECT_ID=votre-project-id
CLIENT_EMAIL=votre-client-email
PRIVATE_KEY=votre-private-key

# Firebase Storage
NEXT_PUBLIC_STORAGE_BUCKET=votre-storage-bucket
```

## 🎉 Résultat Final

Après exécution complète, vous aurez :
- 🏢 Une plateforme avec 15 utilisateurs réalistes
- 📝 7 annonces actives dans différents secteurs
- 📋 7 candidatures avec statuts variés
- 📰 4 articles de blog publiés
- 🖼️ Images optimisées et cohérentes
- ✅ Données conformes à la logique métier

Votre plateforme Molty est maintenant prête avec des données de démonstration réalistes ! 🚀