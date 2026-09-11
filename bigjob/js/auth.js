/**
 * Inscription et connexion, sur la page d'accueil.
 *
 * L'inscription n'est ouverte qu'aux adresses du domaine de l'école : c'est la
 * vérification demandée par le sujet.
 */

(async function () {
    const donnees = await chargerDonnees();

    // Déjà connecté : on ne repasse pas par l'accueil.
    if (utilisateurConnecte(donnees) !== null) {
        window.location.replace('calendrier.html');
        return;
    }

    afficherComptesDemo(donnees);

    /** Affiche un message d'erreur, ou le masque si le texte est vide. */
    function signaler(identifiant, message) {
        const zone = document.getElementById(identifiant);
        zone.textContent = message;
        zone.classList.toggle('d-none', message === '');
    }

    /* ============ Connexion ============ */

    document.getElementById('formulaire-connexion').addEventListener('submit', (evenement) => {
        evenement.preventDefault();

        const email = document.getElementById('connexion-email').value.trim();
        const motDePasse = document.getElementById('connexion-motdepasse').value;

        const utilisateur = utilisateurParEmail(donnees, email);

        if (utilisateur === null || utilisateur.motDePasse !== motDePasse) {
            signaler('erreur-connexion', 'Adresse email ou mot de passe incorrect.');
            return;
        }

        signaler('erreur-connexion', '');
        ouvrirSession(utilisateur);
        window.location.href = 'calendrier.html';
    });

    /* ============ Inscription ============ */

    document.getElementById('formulaire-inscription').addEventListener('submit', (evenement) => {
        evenement.preventDefault();

        const prenom = document.getElementById('inscription-prenom').value.trim();
        const nom = document.getElementById('inscription-nom').value.trim();
        const email = document.getElementById('inscription-email').value.trim();
        const motDePasse = document.getElementById('inscription-motdepasse').value;

        if (prenom === '' || nom === '') {
            signaler('erreur-inscription', 'Le prénom et le nom sont obligatoires.');
            return;
        }

        // La vérification du domaine : cœur de la règle « membres seulement ».
        const domaine = email.split('@')[1];

        if (!email.includes('@') || domaine === undefined
            || domaine.toLowerCase() !== donnees.domaineAutorise) {
            signaler(
                'erreur-inscription',
                `Seules les adresses en @${donnees.domaineAutorise} peuvent créer un compte.`
            );
            return;
        }

        if (utilisateurParEmail(donnees, email) !== null) {
            signaler('erreur-inscription', 'Un compte existe déjà avec cette adresse.');
            return;
        }

        if (motDePasse.length < 6) {
            signaler('erreur-inscription', 'Le mot de passe doit faire au moins six caractères.');
            return;
        }

        const nouvel = {
            id: prochainId(donnees.utilisateurs),
            prenom,
            nom,
            email,
            motDePasse,
            role: 'etudiant'
        };

        donnees.utilisateurs.push(nouvel);
        enregistrerDonnees(donnees);

        signaler('erreur-inscription', '');
        ouvrirSession(nouvel);
        window.location.href = 'calendrier.html';
    });

    /* ============ Aides de démonstration ============ */

    document.getElementById('bouton-reinitialiser').addEventListener('click', () => {
        reinitialiser();
        window.location.reload();
    });

    /**
     * Rappelle les identifiants de démonstration, pour que le projet se teste
     * sans avoir à ouvrir le JSON.
     */
    function afficherComptesDemo(donnees) {
        const zone = document.getElementById('comptes-demo');

        const exemples = ['administrateur', 'moderateur', 'etudiant']
            .map((role) => donnees.utilisateurs.find((utilisateur) => utilisateur.role === role))
            .filter(Boolean);

        zone.innerHTML = '<strong class="d-block mb-2">Comptes de démonstration</strong>';

        const liste = document.createElement('ul');
        liste.className = 'list-unstyled mb-0';

        exemples.forEach((utilisateur) => {
            const ligne = document.createElement('li');
            ligne.className = 'd-flex flex-wrap gap-2 align-items-center mb-1';

            const badge = document.createElement('span');
            badge.className = `badge text-bg-${ROLES[utilisateur.role].couleur}`;
            badge.textContent = ROLES[utilisateur.role].libelle;

            const identifiants = document.createElement('code');
            identifiants.textContent = `${utilisateur.email} / ${utilisateur.motDePasse}`;

            ligne.appendChild(badge);
            ligne.appendChild(identifiants);
            liste.appendChild(ligne);
        });

        zone.appendChild(liste);
    }
})();
