const header = document.getElementById('siteHeader');
const audio = document.getElementById('ambientAudio');
const audioBtn = document.getElementById('audioBtn');

function setHeaderState() {
    header?.classList.toggle('is-scrolled', window.scrollY > 16);
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (audio && audioBtn) {
    audio.volume = 0.14;

    const setAudioState = (playing) => {
        audioBtn.classList.toggle('is-playing', playing);
        audioBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        audioBtn.setAttribute('aria-label', playing ? 'Mettre la musique en pause' : 'Lire la musique');
    };

    const playAudio = async () => {
        try {
            audio.volume = 0.14;
            await audio.play();
            setAudioState(true);
        } catch {
            setAudioState(false);
        }
    };

    window.addEventListener('load', playAudio);
    document.addEventListener('pointerdown', () => {
        if (audio.paused) playAudio();
    }, { once: true });

    audioBtn.addEventListener('click', async (event) => {
        event.stopPropagation();
        if (audio.paused) {
            await playAudio();
        } else {
            audio.pause();
            setAudioState(false);
        }
    });
}

// --- Toggle des descriptions des service-cards (une seule ouverte à la fois) ---
document.querySelectorAll('.about-service').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function (event) {
        event.preventDefault();

        const cardBody = this.closest('.service-body');
        if (!cardBody) return;

        const description = cardBody.querySelector('[class^="description-"]');
        if (!description) return;

        const willOpen = !description.classList.contains('is-open');

        // Fermer toutes les autres descriptions
        document.querySelectorAll('[class^="description-"].is-open').forEach(openDesc => {
            if (openDesc !== description) openDesc.classList.remove('is-open');
        });
        document.querySelectorAll('.about-service.is-active').forEach(activeBtn => {
            if (activeBtn !== this) {
                activeBtn.classList.remove('is-active');
                activeBtn.setAttribute('aria-expanded', 'false');
                activeBtn.textContent = 'En savoir +';
            }
        });

        // Basculer la description actuelle
        description.classList.toggle('is-open', willOpen);
        this.classList.toggle('is-active', willOpen);
        this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        this.textContent = willOpen ? 'Réduire −' : 'En savoir +';

        if (willOpen) {
            setTimeout(() => {
                description.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 350);
        }
    });
});

// --- Reveal au scroll (IntersectionObserver) ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// --- Carrousel automatique des avis (boucle infinie) ---
const reviewsTrack = document.getElementById('uxReviews');
if (reviewsTrack) {
    const originals = Array.from(reviewsTrack.children);
    originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        reviewsTrack.appendChild(clone);
    });
}

// --- Toggle "Lire la suite" section À propos ---
const splitToggle = document.querySelector('.split-toggle');
const splitMore = document.querySelector('.split-more');
if (splitToggle && splitMore) {
    splitToggle.addEventListener('click', () => {
        const willOpen = !splitMore.classList.contains('is-open');
        splitMore.classList.toggle('is-open', willOpen);
        splitToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        splitToggle.querySelector('.split-toggle-label').textContent =
            willOpen ? 'Réduire' : 'Lire la suite';
    });
}

// --- Année du footer ---
const footerYear = document.getElementById('footerYear');
if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
}