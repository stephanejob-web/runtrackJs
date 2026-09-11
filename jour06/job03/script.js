/**
 * Job 03 : la grille est purement CSS, ce script ne sert qu'à afficher le
 * support courant pour vérifier d'un coup d'oeil le basculement desktop/mobile
 * quand on redimensionne la fenêtre dans l'inspecteur.
 */
(function () {
    'use strict';

    // 768px est le point de rupture "md" de Bootstrap, celui utilisé par la page.
    const RUPTURE_MD = window.matchMedia('(min-width: 768px)');
    const badge = document.getElementById('support-courant');

    function afficherSupport() {
        badge.textContent = RUPTURE_MD.matches ? 'desktop' : 'mobile';
        badge.classList.toggle('bg-primary', RUPTURE_MD.matches);
        badge.classList.toggle('bg-secondary', !RUPTURE_MD.matches);
    }

    RUPTURE_MD.addEventListener('change', afficherSupport);
    afficherSupport();
})();
