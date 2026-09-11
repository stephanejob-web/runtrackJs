/**
 * Administration : gestion des droits.
 *
 * Un administrateur peut nommer un modérateur ou un administrateur, et
 * retirer ces droits. Il ne peut pas se rétrograder lui-même, sans quoi il
 * perdrait l'accès à cette page.
 */

(async function () {
    const donnees = await chargerDonnees();
    const utilisateur = exigerAcces(donnees, 'administrateur');

    if (utilisateur === null) {
        return;
    }

    afficherNavigation(utilisateur, 'administration.html');

    function changerRole(membre, role) {
        if (membre.id === utilisateur.id) {
            return;
        }

        membre.role = role;
        enregistrerDonnees(donnees);
        dessiner();
    }

    /** Les boutons proposés selon le rôle actuel du membre. */
    function actionsPour(membre) {
        if (membre.role === 'etudiant') {
            return [
                { libelle: 'Nommer modérateur', role: 'moderateur', style: 'btn-outline-info' },
                { libelle: 'Nommer administrateur', role: 'administrateur', style: 'btn-outline-primary' }
            ];
        }

        if (membre.role === 'moderateur') {
            return [
                { libelle: 'Nommer administrateur', role: 'administrateur', style: 'btn-outline-primary' },
                { libelle: 'Retirer les droits', role: 'etudiant', style: 'btn-outline-danger' }
            ];
        }

        return [
            { libelle: 'Passer modérateur', role: 'moderateur', style: 'btn-outline-info' },
            { libelle: 'Retirer les droits', role: 'etudiant', style: 'btn-outline-danger' }
        ];
    }

    function dessiner() {
        const corps = document.getElementById('corps-membres');
        corps.innerHTML = '';

        // Les responsables d'abord, puis les étudiants, par ordre alphabétique.
        const ordre = { administrateur: 0, moderateur: 1, etudiant: 2 };

        const membres = [...donnees.utilisateurs].sort((a, b) => {
            if (ordre[a.role] !== ordre[b.role]) {
                return ordre[a.role] - ordre[b.role];
            }
            return a.nom.localeCompare(b.nom);
        });

        membres.forEach((membre) => {
            const estMoi = membre.id === utilisateur.id;

            const ligne = document.createElement('tr');

            // Membre
            const celluleMembre = document.createElement('td');
            celluleMembre.innerHTML =
                `<span class="fw-semibold">${membre.prenom} ${membre.nom}</span>`
                + (estMoi ? ' <span class="badge text-bg-light">vous</span>' : '')
                + `<br><span class="text-secondary small">${membre.email}</span>`;

            // Rôle
            const celluleRole = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = `badge text-bg-${ROLES[membre.role].couleur}`;
            badge.textContent = ROLES[membre.role].libelle;
            celluleRole.appendChild(badge);

            // Droits
            const celluleActions = document.createElement('td');
            celluleActions.className = 'text-end';

            if (estMoi) {
                const mention = document.createElement('span');
                mention.className = 'text-secondary small';
                mention.textContent = 'Votre compte';
                celluleActions.appendChild(mention);
            } else {
                const groupe = document.createElement('div');
                groupe.className = 'd-inline-flex flex-wrap gap-2 justify-content-end';

                actionsPour(membre).forEach((action) => {
                    const bouton = document.createElement('button');
                    bouton.type = 'button';
                    bouton.className = `btn btn-sm ${action.style}`;
                    bouton.textContent = action.libelle;
                    bouton.addEventListener('click', () => changerRole(membre, action.role));
                    groupe.appendChild(bouton);
                });

                celluleActions.appendChild(groupe);
            }

            ligne.append(celluleMembre, celluleRole, celluleActions);
            corps.appendChild(ligne);
        });
    }

    dessiner();
})();
