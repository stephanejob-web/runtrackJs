/**
 * Accès aux données du site.
 *
 * Les données de départ viennent de data/donnees.json. Au premier chargement
 * elles sont recopiées dans le localStorage, qui devient ensuite la seule
 * source de vérité : c'est lui qui simule la mémoire de session demandée.
 */

const CLE_DONNEES = 'bigjob.donnees';
const CLE_SESSION = 'bigjob.session';

/** Date du jour à minuit, pour comparer des jours sans se soucier de l'heure. */
function aujourdHui() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

/** Formate une date en AAAA-MM-JJ, le format utilisé partout dans le projet. */
function enCle(date) {
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jour = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${mois}-${jour}`;
}

/** Affiche une date AAAA-MM-JJ en toutes lettres. */
function enTexte(cle) {
    const [annee, mois, jour] = cle.split('-').map(Number);
    return new Date(annee, mois - 1, jour).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/** Vrai si la date AAAA-MM-JJ est déjà passée. */
function estPassee(cle) {
    return cle < enCle(aujourdHui());
}

/**
 * Transforme le décalage en jours du fichier JSON en vraie date, pour que le
 * jeu de démonstration reste cohérent quel que soit le jour où on l'ouvre.
 */
function preparerGraine(graine) {
    const demandes = graine.demandes.map((demande) => {
        const date = aujourdHui();
        date.setDate(date.getDate() + demande.decalageJours);

        return {
            id: demande.id,
            utilisateurId: demande.utilisateurId,
            date: enCle(date),
            statut: demande.statut
        };
    });

    return {
        domaineAutorise: graine.domaineAutorise,
        utilisateurs: graine.utilisateurs,
        demandes
    };
}

function enregistrerDonnees(donnees) {
    localStorage.setItem(CLE_DONNEES, JSON.stringify(donnees));
}

/**
 * Renvoie les données, en amorçant le localStorage depuis le JSON au besoin.
 */
async function chargerDonnees() {
    const stockees = localStorage.getItem(CLE_DONNEES);

    if (stockees) {
        return JSON.parse(stockees);
    }

    const reponse = await fetch('data/donnees.json');

    if (!reponse.ok) {
        throw new Error('Impossible de charger data/donnees.json');
    }

    const donnees = preparerGraine(await reponse.json());
    enregistrerDonnees(donnees);

    return donnees;
}

/** Remet le site dans son état de départ. */
function reinitialiser() {
    localStorage.removeItem(CLE_DONNEES);
    localStorage.removeItem(CLE_SESSION);
}

/** Le prochain identifiant libre d'une collection. */
function prochainId(collection) {
    return collection.reduce((maximum, element) => Math.max(maximum, element.id), 0) + 1;
}

function utilisateurParId(donnees, id) {
    return donnees.utilisateurs.find((utilisateur) => utilisateur.id === id) || null;
}

function utilisateurParEmail(donnees, email) {
    const recherche = email.trim().toLowerCase();
    return donnees.utilisateurs.find((utilisateur) => utilisateur.email.toLowerCase() === recherche) || null;
}

/** Les libellés et couleurs Bootstrap associés à chaque statut. */
const STATUTS = {
    en_attente: { libelle: 'En attente', couleur: 'warning text-dark' },
    acceptee: { libelle: 'Acceptée', couleur: 'success' },
    refusee: { libelle: 'Refusée', couleur: 'danger' }
};

const ROLES = {
    etudiant: { libelle: 'Étudiant', couleur: 'secondary' },
    moderateur: { libelle: 'Modérateur', couleur: 'info text-dark' },
    administrateur: { libelle: 'Administrateur', couleur: 'primary' }
};
