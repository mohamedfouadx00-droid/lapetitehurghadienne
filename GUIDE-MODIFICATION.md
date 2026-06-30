# 📖 Guide de modification du site — La Petite Hurghadienne

---

## 📁 Structure des fichiers

Ton site est maintenant composé de **3 fichiers** + ta photo :

```
📁 ton-site/
  ├── index.html          ← Tout le contenu (textes, sections)  ✏️ À modifier
  ├── style.css           ← Le design visuel                    ⛔ Ne pas toucher
  ├── script.js           ← Les animations                      ⛔ Ne pas toucher
  └── equipe-sea-and-sand.webp  ← Ta photo de profil          ✏️ À remplacer si besoin
```

**La règle d'or :**  
👉 Tu n'as besoin de modifier **que le fichier `index.html`**.  
Tous les textes, tous les titres, tous les contenus s'y trouvent.

---

## 🔧 Comment modifier le site

### Étape 1 — Ouvrir le fichier
Ouvre `index.html` avec un éditeur de texte simple :
- **Windows :** Bloc-notes (clic droit → Ouvrir avec → Bloc-notes) ou VS Code (gratuit)
- **Mac :** TextEdit ou VS Code (gratuit)
- **Recommandé :** Télécharge **VS Code** (https://code.visualstudio.com) — c'est gratuit et il colore le code pour faciliter la lecture

### Étape 2 — Repérer où modifier
Tout le fichier est structuré avec des commentaires comme celui-ci :

```html
<!-- ✏️ MODIFIER : texte du titre -->
<h1>Mon titre ici</h1>
```

Il suffit de **chercher** `✏️` dans le fichier pour trouver tous les endroits à modifier.

### Étape 3 — Faire la modification
Modifie **seulement le texte** entre les balises. Exemple :

**Avant :**
```html
<h1 class="hero-title">Découvrez Hurghada<br><em>Autrement</em></h1>
```

**Après (tu modifies juste le texte) :**
```html
<h1 class="hero-title">Vivez Hurghada<br><em>Comme une Locale</em></h1>
```

⚠️ **Ne jamais supprimer** les `class="..."` ou les balises `<h1>`, `<p>`, etc.

### Étape 4 — Enregistrer et tester
1. Enregistre le fichier (Ctrl+S ou Cmd+S)
2. Ouvre `index.html` dans ton navigateur (double-clic dessus)
3. Vérifie que tout s'affiche correctement

---

## ✅ Ce que tu peux modifier facilement

### Changer un texte
Simplement remplacer le texte entre les balises.

### Changer un numéro WhatsApp
Cherche `+33601093689` et remplace par ton numéro (format international, sans +, sans espaces) :
```html
<a href="https://api.whatsapp.com/send?phone=33601093689">
```
→ Remplace `33601093689` par ton numéro.

### Changer une adresse email
Cherche `lapetitehurghadienne@gmail.com` et remplace par ta nouvelle adresse.

### Changer ta photo de profil
1. Renomme ta photo en `equipe-sea-and-sand.webp` (ou change le nom dans index.html)
2. Place le fichier image dans le même dossier que `index.html`

### Ajouter un témoignage
Copie ce bloc et colle-le à l'intérieur du `<div class="testi-grid">` :
```html
<div class="testi-card reveal">
  <div class="testi-stars">★★★★★</div>
  <p class="testi-text">Ton nouveau témoignage ici.</p>
  <div class="testi-author">
    <div class="testi-avatar">J</div>
    <div>
      <div class="testi-name">Prénom Nom</div>
      <div class="testi-meta">Type de voyage • Hurghada 2026</div>
    </div>
  </div>
</div>
```

### Ajouter une carte d'expérience
Copie ce bloc et colle-le dans le `<div class="exp-grid">` :
```html
<div class="exp-card reveal">
  <div class="exp-emoji-header" style="background:linear-gradient(135deg,#e0f4fc,#b3e5f5)">🌟</div>
  <div class="exp-body">
    <span class="exp-badge">Catégorie</span>
    <h3 class="exp-title">Titre de l'activité</h3>
    <p class="exp-desc">Description de l'activité ici.</p>
  </div>
</div>
```

### Ajouter une section entière (future)
Copie une section existante (tout le bloc depuis `<!-- SECTION ... -->` jusqu'au prochain `<!-- SECTION ... -->`) et modifie le contenu.

---

## 🚀 Mettre en ligne sur Hostinger

### Méthode simple (via le panneau Hostinger)

1. **Connecte-toi** à ton compte Hostinger → hPanel
2. Va dans **"Gestionnaire de fichiers"**
3. Ouvre le dossier **`public_html`**
4. **Supprime** les fichiers par défaut (s'il y en a)
5. **Upload** tes 4 fichiers :
   - `index.html`
   - `style.css`
   - `script.js`
   - `equipe-sea-and-sand.webp`
6. Ton site est en ligne ! 🎉

### Méthode FTP (optionnel, plus rapide pour beaucoup de fichiers)
Utilise **FileZilla** (gratuit) avec tes identifiants FTP Hostinger.

---

## 💡 Astuces

- **Toujours faire une sauvegarde** avant de modifier : copie le dossier entier sous un autre nom.
- Si quelque chose ne s'affiche plus correctement : appuie sur `Ctrl+Z` (Annuler) dans ton éditeur.
- **Ne jamais toucher à** `style.css` et `script.js` — ce sont les "moteurs" visuels du site.
- Pour voir les modifications en direct sans ré-uploader : ouvre `index.html` directement dans ton navigateur.

---

## ❓ Ajouter de nouvelles pages

Pour le moment, tout est sur une seule page (c'est pratique et rapide).  
Si tu veux ajouter une vraie page séparée (ex: une page blog), il faudra créer un nouveau fichier `.html` et faire un lien vers celui-ci.

---

*Guide rédigé pour La Petite Hurghadienne — Mise à jour 2026*
