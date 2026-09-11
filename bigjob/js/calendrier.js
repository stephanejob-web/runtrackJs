/**
 * Calendrier des demandes de présence.
 *
 * Règle centrale du sujet : une fois la date passée, plus personne ne peut
 * changer la décision. Les jours passés sont donc affichés mais inertes.
 */

(async function () {
    const donnees = await chargerDonnees();
    const utilisateur = exigerAcces(donnees, 'connecte');

    if (utilisateur === null) {
        return;
    }

    afficherNavigation(utilisateur, 'calendrier.html');

    // Le mois affiché, ramené au premier jour pour simplifier les calculs.
    let moisAffiche = aujourdHui();
    moisAffiche.setDate(1);

    /** La demande de l'utilisateur connecté pour une date donnée. */
    function maDemande(cle) {
        return donnees.demandes.find(
            (demande) => demande.utilisateurId === utilisateur.id && demande.date === cle
        ) || null;
    }

    /** Crée la demande du jour cliqué, ou l'annule si elle existe déjà. */
    function basculerDemande(cle) {
        if (estPassee(cle)) {
            return;
        }

        const existante = maDemande(cle);

        if (existante) {
            donnees.demandes = donnees.demandes.filter((demande) => demande !== existante);
        } else {
            donnees.demandes.push({
                id: prochainId(donnees.demandes),
                utilisateurId: utilisateur.id,
                date: cle,
                statut: 'en_attente'
            });
        }

        enregistrerDonnees(donnees);
        dessiner();
    }

    /** Construit la grille du mois affiché. */
    function dessinerGrille() {
        const grille = document.getElementById('grille-calendrier');
        grille.innerHTML = '';

        document.getElementById('titre-mois').textContent = moisAffiche
            .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        // getDay() renvoie 0 pour dimanche ; on décale pour commencer lundi.
        const premierJour = (moisAffiche.getDay() + 6) % 7;

        const nombreDeJours = new Date(
            moisAffiche.getFullYear(),
            moisAffiche.getMonth() + 1,
            0
        ).getDate();

        // Cases vides avant le premier jour du mois.
        for (let i = 0; i < premierJour; i += 1) {
            const vide = document.createElement('div');
            vide.className = 'calendrier-case calendrier-case--vide';
            grille.appendChild(vide);
        }

        const cleDuJour = enCle(aujourdHui());

        for (let jour = 1; jour <= nombreDeJours; jour += 1) {
            const cle = enCle(new Date(moisAffiche.getFullYear(), moisAffiche.getMonth(), jour));
            const demande = maDemande(cle);
            const passee = estPassee(cle);

            const case_ = document.createElement('button');
            case_.type = 'button';
            case_.className = 'calendrier-case';
            case_.dataset.date = cle;

            if (passee) {
                case_.classList.add('calendrier-case--passee');
                case_.disabled = true;
                case_.title = 'Date passée : la décision ne peut plus changer.';
            }

            if (cle === cleDuJour) {
                case_.classList.add('calendrier-case--aujourdhui');
            }

            const numero = document.createElement('span');
            numero.className = 'calendrier-numero';
            numero.textContent = String(jour);
            case_.appendChild(numero);

            if (demande) {
                case_.classList.add('calendrier-case--demande');

                const puce = document.createElement('span');
                puce.className = `puce puce-${demande.statut}`;
                puce.title = STATUTS[demande.statut].libelle;
                case_.appendChild(puce);
            }

            if (!passee) {
                case_.addEventListener('click', () => basculerDemande(cle));
            }

            grille.appendChild(case_);
        }
    }

    /** Liste les demandes de l'utilisateur, de la plus proche à la plus lointaine. */
    function dessinerListe() {
        const liste = document.getElementById('liste-demandes');
        liste.innerHTML = '';

        const miennes = donnees.demandes
            .filter((demande) => demande.utilisateurId === utilisateur.id)
            .sort((a, b) => a.date.localeCompare(b.date));

        if (miennes.length === 0) {
            const vide = document.createElement('li');
            vide.className = 'list-group-item text-secondary small';
            vide.textContent = "Aucune demande pour l'instant.";
            liste.appendChild(vide);
            return;
        }

        miennes.forEach((demande) => {
            const ligne = document.createElement('li');
            ligne.className = 'list-group-item d-flex justify-content-between align-items-center gap-2';

            const texte = document.createElement('span');
            texte.className = 'small';
            texte.textContent = enTexte(demande.date);

            if (estPassee(demande.date)) {
                texte.classList.add('text-secondary');
            }

            const badge = document.createElement('span');
            badge.className = `badge text-bg-${STATUTS[demande.statut].couleur}`;
            badge.textContent = STATUTS[demande.statut].libelle;

            ligne.appendChild(texte);
            ligne.appendChild(badge);
            liste.appendChild(ligne);
        });
    }

    function dessiner() {
        dessinerGrille();
        dessinerListe();
    }

    document.getElementById('mois-precedent').addEventListener('click', () => {
        moisAffiche.setMonth(moisAffiche.getMonth() - 1);
        dessiner();
    });

    document.getElementById('mois-suivant').addEventListener('click', () => {
        moisAffiche.setMonth(moisAffiche.getMonth() + 1);
        dessiner();
    });

    document.getElementById('mois-aujourdhui').addEventListener('click', () => {
        moisAffiche = aujourdHui();
        moisAffiche.setDate(1);
        dessiner();
    });

    dessiner();
})();
