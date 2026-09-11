/**
 * Backoffice : les modérateurs et les administrateurs acceptent ou refusent
 * les demandes de présence.
 *
 * Une demande dont la date est passée n'est plus modifiable, conformément au
 * sujet : la décision est figée.
 */

(async function () {
    const donnees = await chargerDonnees();
    const utilisateur = exigerAcces(donnees, 'moderateur');

    if (utilisateur === null) {
        return;
    }

    afficherNavigation(utilisateur, 'backoffice.html');

    let filtre = 'a_venir';

    function demandesFiltrees() {
        return donnees.demandes
            .filter((demande) => {
                if (filtre === 'a_venir') {
                    return !estPassee(demande.date);
                }
                if (filtre === 'en_attente') {
                    return demande.statut === 'en_attente';
                }
                return true;
            })
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    function decider(demande, statut) {
        if (estPassee(demande.date)) {
            return;
        }

        demande.statut = statut;
        enregistrerDonnees(donnees);
        dessiner();
    }

    /** Les trois compteurs en haut de page. */
    function dessinerCompteurs() {
        const zone = document.getElementById('compteurs');
        zone.innerHTML = '';

        const aVenir = donnees.demandes.filter((demande) => !estPassee(demande.date));

        const cartes = [
            { libelle: 'En attente', valeur: aVenir.filter((d) => d.statut === 'en_attente').length, couleur: 'warning' },
            { libelle: 'Acceptées', valeur: aVenir.filter((d) => d.statut === 'acceptee').length, couleur: 'success' },
            { libelle: 'Refusées', valeur: aVenir.filter((d) => d.statut === 'refusee').length, couleur: 'danger' }
        ];

        cartes.forEach((carte) => {
            const colonne = document.createElement('div');
            colonne.className = 'col-12 col-sm-4';

            colonne.innerHTML = `
                <div class="card shadow-sm border-0 border-start border-4 border-${carte.couleur}">
                    <div class="card-body py-3">
                        <p class="text-secondary small mb-1">${carte.libelle} (à venir)</p>
                        <p class="h4 mb-0">${carte.valeur}</p>
                    </div>
                </div>`;

            zone.appendChild(colonne);
        });
    }

    function dessinerTableau() {
        const corps = document.getElementById('corps-demandes');
        corps.innerHTML = '';

        const demandes = demandesFiltrees();

        if (demandes.length === 0) {
            const ligne = document.createElement('tr');
            ligne.innerHTML =
                '<td colspan="4" class="text-center text-secondary py-4">Aucune demande à afficher.</td>';
            corps.appendChild(ligne);
            return;
        }

        demandes.forEach((demande) => {
            const demandeur = utilisateurParId(donnees, demande.utilisateurId);
            const passee = estPassee(demande.date);

            const ligne = document.createElement('tr');
            if (passee) {
                ligne.classList.add('table-secondary', 'opacity-75');
            }

            // Personne
            const cellulePersonne = document.createElement('td');
            cellulePersonne.innerHTML = demandeur
                ? `<span class="fw-semibold">${demandeur.prenom} ${demandeur.nom}</span>
                   <br><span class="text-secondary small">${demandeur.email}</span>`
                : '<span class="text-secondary">Compte supprimé</span>';

            // Date
            const celluleDate = document.createElement('td');
            celluleDate.className = 'small';
            celluleDate.textContent = enTexte(demande.date);

            if (passee) {
                const mention = document.createElement('span');
                mention.className = 'badge text-bg-light ms-2';
                mention.textContent = 'date passée';
                celluleDate.appendChild(mention);
            }

            // Statut
            const celluleStatut = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = `badge text-bg-${STATUTS[demande.statut].couleur}`;
            badge.textContent = STATUTS[demande.statut].libelle;
            celluleStatut.appendChild(badge);

            // Décision
            const celluleActions = document.createElement('td');
            celluleActions.className = 'text-end';

            if (passee) {
                const figee = document.createElement('span');
                figee.className = 'text-secondary small';
                figee.textContent = 'Décision figée';
                celluleActions.appendChild(figee);
            } else {
                const groupe = document.createElement('div');
                groupe.className = 'btn-group btn-group-sm';

                const accepter = document.createElement('button');
                accepter.type = 'button';
                accepter.className = 'btn btn-success';
                accepter.textContent = 'Accepter';
                accepter.disabled = demande.statut === 'acceptee';
                accepter.addEventListener('click', () => decider(demande, 'acceptee'));

                const refuser = document.createElement('button');
                refuser.type = 'button';
                refuser.className = 'btn btn-outline-danger';
                refuser.textContent = 'Refuser';
                refuser.disabled = demande.statut === 'refusee';
                refuser.addEventListener('click', () => decider(demande, 'refusee'));

                groupe.appendChild(accepter);
                groupe.appendChild(refuser);
                celluleActions.appendChild(groupe);
            }

            ligne.append(cellulePersonne, celluleDate, celluleStatut, celluleActions);
            corps.appendChild(ligne);
        });
    }

    function dessiner() {
        dessinerCompteurs();
        dessinerTableau();
    }

    document.getElementById('filtres').addEventListener('click', (evenement) => {
        const bouton = evenement.target.closest('[data-filtre]');

        if (!bouton) {
            return;
        }

        filtre = bouton.dataset.filtre;

        document.querySelectorAll('#filtres [data-filtre]')
            .forEach((autre) => autre.classList.toggle('active', autre === bouton));

        dessinerTableau();
    });

    dessiner();
})();
