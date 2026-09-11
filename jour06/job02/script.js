/**
 * Job 02 : on donne vie à la page du Job 01, avec Bootstrap et jQuery.
 */
$(function () {

    /* =========================================================================
     * 1. Le bouton de la carte affiche une modale de confirmation d'achat
     * ========================================================================= */

    // On passe l'élément et non un sélecteur : c'est la forme supportée par
    // toutes les versions de Bootstrap 5.
    const modalePapillon = new bootstrap.Modal(document.getElementById('modale-papillon'));

    $('#btn-papillon').on('click', function () {
        modalePapillon.show();
    });


    /* =========================================================================
     * 2. "Rebooter le Monde" remplace le texte par une citation de Blade Runner
     *    (celui de 1982, pas 2049)
     * ========================================================================= */

    const citations = [
        "All those moments will be lost in time, like tears in rain.",
        "I've seen things you people wouldn't believe.",
        "Wake up. Time to die.",
        "It's too bad she won't live. But then again, who does ?",
        "More human than human is our motto.",
        "The light that burns twice as bright burns half as long.",
        "Quite an experience to live in fear, isn't it ?"
    ];

    /**
     * Renvoie un élément au hasard dans un tableau.
     */
    function auHasard(tableau) {
        return tableau[Math.floor(Math.random() * tableau.length)];
    }

    $('#btn-reboot').on('click', function () {
        $('#jumbotron-titre').text('Reboot en cours...');

        $('#jumbotron-corps').html(
            '<blockquote class="blockquote">' +
            '<p class="mb-1">« ' + auHasard(citations) + ' »</p>' +
            '<footer class="blockquote-footer">Blade Runner <cite title="Blade Runner">(1982)</cite></footer>' +
            '</blockquote>'
        );
    });


    /* =========================================================================
     * 3. La pagination change le contenu du jumbotron
     * ========================================================================= */

    const pages = [
        {
            titre: 'Bonjour, monde !',
            corps:
                '<p class="mb-2">Il existe plusieurs sortes de terme :</p>' +
                '<p class="mb-2">Le monde est la matière, l\'espace et les phénomènes qui nous sont ' +
                'accessibles par les sens, l\'expérience ou la raison.</p>' +
                '<p class="mb-2">Le sens le plus courant désigne notre planète, la Terre, ses habitants, ' +
                'et son environnement plus ou moins naturel.</p>' +
                '<p class="text-muted fst-italic">Ce sens étendu délègue de l\'univers dans son ensemble.</p>'
        },
        {
            titre: 'Bonjour, le web !',
            corps:
                '<p class="mb-2">Le web est né en 1989 au CERN, sous les doigts de Tim Berners-Lee.</p>' +
                '<p class="mb-2">Trois briques suffisaient : une adresse, un protocole, un langage de balises. ' +
                'Trente ans plus tard, on en est toujours là, avec un peu plus de CSS.</p>' +
                '<p class="text-muted fst-italic">Le tout premier site est toujours en ligne.</p>'
        },
        {
            titre: 'Bonjour, LaPlateforme_ !',
            corps:
                '<p class="mb-2">Une école du numérique ouverte à toutes et tous, sans condition de diplôme.</p>' +
                '<p class="mb-2">On y apprend en faisant : des jobs, des runtracks, et beaucoup de café.</p>' +
                '<p class="text-muted fst-italic">Ce jumbotron en est la preuve vivante.</p>'
        }
    ];

    let pageCourante = 0;

    /**
     * Affiche la page demandée et met à jour l'état actif de la pagination.
     */
    function afficherPage(index) {
        // On reste dans les bornes du tableau.
        pageCourante = Math.min(Math.max(index, 0), pages.length - 1);

        $('#jumbotron-titre').text(pages[pageCourante].titre);
        $('#jumbotron-corps').html(pages[pageCourante].corps);

        // Les chiffres sont les liens de pagination dépourvus d'aria-label.
        $('#pagination .page-item').removeClass('active');
        $('#pagination .page-link').not('[aria-label]').eq(pageCourante)
            .closest('.page-item').addClass('active');
    }

    $('#pagination').on('click', '.page-link', function (evenement) {
        evenement.preventDefault();

        const libelle = $(this).attr('aria-label');

        if (libelle === 'Précédent') {
            afficherPage(pageCourante - 1);
        } else if (libelle === 'Suivant') {
            afficherPage(pageCourante + 1);
        } else {
            afficherPage(parseInt($(this).text(), 10) - 1);
        }
    });


    /* =========================================================================
     * 4. Cliquer sur un élément de la liste groupée le rend actif
     * ========================================================================= */

    $('#liste-cercles').on('click', '.list-group-item', function (evenement) {
        evenement.preventDefault();

        $('#liste-cercles .list-group-item').removeClass('active');
        $(this).addClass('active');
    });


    /* =========================================================================
     * 5. Les deux boutons font progresser ou régresser la barre
     * ========================================================================= */

    const PAS = 10;

    /**
     * Ajoute (ou retire) des pourcents à la barre, sans jamais sortir de 0-100.
     */
    function deplacerProgression(delta) {
        const barre = $('#progress-bar');
        const valeur = Math.min(Math.max(parseInt(barre.attr('aria-valuenow'), 10) + delta, 0), 100);

        barre
            .css('width', valeur + '%')
            .attr('aria-valuenow', valeur)
            .text(valeur + '%');
    }

    $('#btn-progress-moins').on('click', function () {
        deplacerProgression(-PAS);
    });

    $('#btn-progress-plus').on('click', function () {
        deplacerProgression(PAS);
    });


    /* =========================================================================
     * 6. Les touches D, G puis C, dans cet ordre, ouvrent le récapitulatif
     * ========================================================================= */

    const SEQUENCE = ['d', 'g', 'c'];
    const modaleRecap = new bootstrap.Modal(document.getElementById('modale-recap'));

    let position = 0;

    /**
     * Construit le récapitulatif à partir du formulaire en bas à gauche.
     */
    function remplirRecapitulatif() {
        const champs = [
            { libelle: 'Login', valeur: $('#champ-login').val() },
            { libelle: "Nom de l'âme", valeur: $('#champ-ame').val() },
            { libelle: 'DogeCoin', valeur: $('#champ-dogecoin').val() },
            { libelle: 'URL des Internets 2', valeur: $('#champ-url').val() }
        ];

        const liste = $('#recap-liste').empty();

        champs.forEach(function (champ) {
            const valeur = champ.valeur
                ? $('<strong>').text(champ.valeur)
                : $('<em class="text-muted">').text('Non renseigné');

            liste.append(
                $('<li class="list-group-item d-flex justify-content-between align-items-center gap-3">')
                    .append($('<span>').text(champ.libelle))
                    .append(valeur)
            );
        });
    }

    $(document).on('keydown', function (evenement) {
        // On ignore la frappe quand l'utilisateur est en train de remplir un champ.
        if ($(evenement.target).is('input, textarea, select')) {
            return;
        }

        const touche = evenement.key.toLowerCase();

        if (touche === SEQUENCE[position]) {
            position += 1;

            if (position === SEQUENCE.length) {
                position = 0;
                remplirRecapitulatif();
                modaleRecap.show();
            }

            return;
        }

        // Mauvaise touche : on repart de zéro, sauf si elle amorce la séquence.
        position = touche === SEQUENCE[0] ? 1 : 0;
    });


    /* =========================================================================
     * 7. Valider le formulaire de droite change la couleur du spinner
     * ========================================================================= */

    const COULEURS = [
        'text-primary',
        'text-secondary',
        'text-success',
        'text-danger',
        'text-warning',
        'text-info',
        'text-dark'
    ];

    $('#formulaire-connexion').on('submit', function (evenement) {
        evenement.preventDefault();

        const email = $('#champ-email').val().trim();
        const motDePasse = $('#champ-password').val().trim();

        if (email === '' || motDePasse === '') {
            return;
        }

        const spinner = $('#spinner');
        const actuelle = COULEURS.find(function (couleur) {
            return spinner.hasClass(couleur);
        });

        // On tire une couleur différente de celle déjà affichée.
        let nouvelle = actuelle;

        while (nouvelle === actuelle) {
            nouvelle = auHasard(COULEURS);
        }

        spinner.removeClass(COULEURS.join(' ')).addClass(nouvelle);
    });
});
