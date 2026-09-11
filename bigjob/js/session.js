/**
 * Session simulée et barre de navigation commune.
 *
 * La session tient dans une seule entrée de localStorage : l'identifiant de
 * l'utilisateur connecté. Comme elle survit au rafraîchissement, l'utilisateur
 * reste « Connecté » tant qu'il ne se déconnecte pas.
 */

function ouvrirSession(utilisateur) {
    localStorage.setItem(CLE_SESSION, String(utilisateur.id));
}

function fermerSession() {
    localStorage.removeItem(CLE_SESSION);
}

/** L'utilisateur connecté, ou null. */
function utilisateurConnecte(donnees) {
    const id = localStorage.getItem(CLE_SESSION);

    if (id === null) {
        return null;
    }

    // Le compte a pu être supprimé ou modifié depuis l'ouverture de session.
    return utilisateurParId(donnees, Number(id));
}

function estModerateur(utilisateur) {
    return utilisateur !== null
        && (utilisateur.role === 'moderateur' || utilisateur.role === 'administrateur');
}

function estAdministrateur(utilisateur) {
    return utilisateur !== null && utilisateur.role === 'administrateur';
}

/**
 * Protège une page : renvoie vers l'accueil si l'utilisateur n'a pas le droit
 * d'être là. Renvoie l'utilisateur connecté quand l'accès est accordé.
 */
function exigerAcces(donnees, niveau) {
    const utilisateur = utilisateurConnecte(donnees);

    const autorise =
        (niveau === 'connecte' && utilisateur !== null)
        || (niveau === 'moderateur' && estModerateur(utilisateur))
        || (niveau === 'administrateur' && estAdministrateur(utilisateur));

    if (!autorise) {
        window.location.replace('index.html');
        return null;
    }

    return utilisateur;
}

/**
 * Remplit la barre de navigation en fonction du rôle de l'utilisateur.
 * Le gabarit est présent dans chaque page, seul le contenu varie.
 */
function afficherNavigation(utilisateur, pageCourante) {
    const liens = document.getElementById('liens-navigation');
    const zoneCompte = document.getElementById('zone-compte');

    if (!liens || !zoneCompte) {
        return;
    }

    const pages = [{ fichier: 'calendrier.html', libelle: 'Calendrier' }];

    if (estModerateur(utilisateur)) {
        pages.push({ fichier: 'backoffice.html', libelle: 'Backoffice' });
    }

    if (estAdministrateur(utilisateur)) {
        pages.push({ fichier: 'administration.html', libelle: 'Administration' });
    }

    liens.innerHTML = '';

    pages.forEach((page) => {
        const element = document.createElement('li');
        element.className = 'nav-item';

        const lien = document.createElement('a');
        lien.className = 'nav-link' + (page.fichier === pageCourante ? ' active' : '');
        lien.href = page.fichier;
        lien.textContent = page.libelle;

        element.appendChild(lien);
        liens.appendChild(element);
    });

    zoneCompte.innerHTML = '';

    const etiquette = document.createElement('span');
    etiquette.className = 'navbar-text me-3 d-flex align-items-center gap-2';
    etiquette.innerHTML =
        '<span class="pastille-connecte"></span>'
        + '<span class="fw-semibold">Connecté</span>'
        + '<span class="text-white-50">·</span>';

    const nom = document.createElement('span');
    nom.textContent = `${utilisateur.prenom} ${utilisateur.nom}`;
    etiquette.appendChild(nom);

    const role = document.createElement('span');
    role.className = `badge text-bg-${ROLES[utilisateur.role].couleur}`;
    role.textContent = ROLES[utilisateur.role].libelle;
    etiquette.appendChild(role);

    const deconnexion = document.createElement('button');
    deconnexion.type = 'button';
    deconnexion.className = 'btn btn-sm btn-outline-light';
    deconnexion.textContent = 'Déconnexion';
    deconnexion.addEventListener('click', () => {
        fermerSession();
        window.location.href = 'index.html';
    });

    zoneCompte.appendChild(etiquette);
    zoneCompte.appendChild(deconnexion);
}
