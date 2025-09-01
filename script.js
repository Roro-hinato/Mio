// --- Procédure de chargement fiable pour l'API YouTube ---
// 1. On crée une balise <script> dynamiquement.
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
// 2. On trouve la première balise <script> de la page.
const firstScriptTag = document.getElementsByTagName('script')[0];
// 3. On insère notre nouvelle balise AVANT la première, pour lancer le chargement.
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// --- Initialisation du lecteur YouTube via l'API IFrame ---

// La variable `player` est déclarée ici pour être accessible globalement dans ce script.
let player;

// 4. Cette fonction globale est appelée par l'API une fois le script téléchargé.
//    Comme notre code est déjà chargé, cette fonction existera toujours à temps.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: 'xbibCPr7R6Y',
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'loop': 1,
      'iv_load_policy': 3,   // Masque les annotations vidéo
      'modestbranding': 1,   // Réduit le logo YouTube
      'rel': 0               // Empêche les vidéos recommandées d'autres chaînes à la fin
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

// 5. Cette fonction s'exécute une fois le lecteur vidéo prêt.
function onPlayerReady(event) {
  event.target.setVolume(25);
  event.target.playVideo();
}


document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration de la Galerie ---
    const IMAGES_PER_PAGE = 12;
    
    const galleries = {
        mio: {
            icon: 'images/miohome.png',
            images: [
                { src: 'images/mio1.png' },
                { src: 'images/mio2.png' },
                { src: 'images/mio3.png' },
                { src: 'images/mio4.png' },
                { src: 'images/mio5.png', className: 'object-pos-custom' },
                { src: 'images/mio6.png' },
            ]
        }
    };

    let galleryState = {
        mio: { currentPage: 1 }
    };

    function createGalleryHTML(galleryName, galleryData, page) {
        const totalImages = galleryData.images.length;
        const totalPages = Math.ceil(totalImages / IMAGES_PER_PAGE);
        const startIndex = (page - 1) * IMAGES_PER_PAGE;
        const endIndex = page * IMAGES_PER_PAGE;
        const paginatedImages = galleryData.images.slice(startIndex, endIndex);

        let paginationHTML = '';
        if (totalPages > 1) {
            paginationHTML = `
                <div class="pagination-controls">
                    <button class="pagination-button" data-gallery="${galleryName}" data-direction="-1" ${page === 1 ? 'disabled' : ''}>Précédent</button>
                    <span class="page-indicator">Page ${page} / ${totalPages}</span>
                    <button class="pagination-button" data-gallery="${galleryName}" data-direction="1" ${page === totalPages ? 'disabled' : ''}>Suivant</button>
                </div>
            `;
        }

        return `
            <div class="gallery-section">
                <h2 class="gallery-title">
                    <img src="${galleryData.icon}" alt="Icone ${galleryName}" class="logo-img">
                    <span>${galleryName}</span>
                </h2>
                <div class="gallery-grid">
                    ${paginatedImages.map((img, i) => `
                        <div class="gallery-item">
                            <img src="${img.src}" 
                                 alt="Photo ${galleryName} ${i + 1}" 
                                 class="gallery-image ${img.className || ''}"
                                 data-gallery="${galleryName}" 
                                 data-index="${startIndex + i}">
                        </div>
                    `).join('')}
                </div>
                ${paginationHTML}
            </div>
        `;
    }
    
    const pageContent = {
        home: `
            <div>
                <div class="home-card">
                    <div class="home-card-content">
                        <div class="profile-pic-container">
                            <img src="images/miohome.png" alt="Profile Picture" class="profile-pic">
                        </div>
                        <div class="profile-text">
                            <h1 class="profile-title">Mio</h1>
                            <p class="profile-subtitle">The social butterfly ~</p>
                            <hr class="divider">
                            <p class="profile-description">
                                Welcome to my little safe place where I enjoy posting what I create. I hope you can relax and enjoy the pictures. ♥
                            </p>
                            <div class="social-links">
                                <a href="https://x.com/Mio_Nii0" target="_blank" rel="noopener noreferrer" class="social-link">
                                    <svg class="social-link-icon" fill="currentColor" viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z"/>
                                    </svg>
                                    <span>Follow on X</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        gallery: `` 
    };

    const contentArea = document.getElementById('content-area');
    const allNavButtons = document.querySelectorAll('.nav-button');
    const galleryOverlay = document.getElementById('gallery-overlay');
    const hamburgerButton = document.getElementById('hamburger-button');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const clickSound = document.getElementById('click-sound');
    const titleLink = document.querySelector('header nav a');

    function unlockAllAudio() {
        if (clickSound) {
            clickSound.play().then(() => {
                clickSound.pause();
                clickSound.currentTime = 0;
            }).catch(() => {});
        }
        document.body.removeEventListener('click', unlockAllAudio);
        document.body.removeEventListener('touchend', unlockAllAudio);
    }
    document.body.addEventListener('click', unlockAllAudio);
    document.body.addEventListener('touchend', unlockAllAudio);

    function playClickSound() {
        if (clickSound) {
            clickSound.volume = 0.5;
            clickSound.currentTime = 0;
            const playPromise = clickSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.error("Erreur de lecture audio :", error));
            }
        }
    }

    contentArea.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.gallery-item')) {
            galleryOverlay.classList.add('active');
            e.target.closest('.gallery-item').classList.add('gallery-item-highlighted');
        }
    });

    contentArea.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.gallery-item')) {
            galleryOverlay.classList.remove('active');
            e.target.closest('.gallery-item').classList.remove('gallery-item-highlighted');
        }
    });
    
    let currentGallery = '';
    let currentIndex = 0;
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox-hidden';
    document.body.appendChild(lightbox);
    const lightboxImage = document.createElement('img');
    lightbox.appendChild(lightboxImage);
    const lightboxClose = document.createElement('button');
    lightboxClose.innerHTML = '&times;';
    lightboxClose.className = 'lightbox-close';
    lightbox.appendChild(lightboxClose);
    const lightboxPrev = document.createElement('button');
    lightboxPrev.innerHTML = '&#10094;';
    lightboxPrev.className = 'lightbox-prev';
    lightbox.appendChild(lightboxPrev);
    const lightboxNext = document.createElement('button');
    lightboxNext.innerHTML = '&#10095;';
    lightboxNext.className = 'lightbox-next';
    lightbox.appendChild(lightboxNext);

    function showImage(gallery, index) {
        const images = galleries[gallery].images;
        if (!images || index < 0 || index >= images.length) return;
        currentGallery = gallery;
        currentIndex = index;
        lightboxImage.src = images[currentIndex].src;
    }
    function openLightbox(gallery, index) {
        showImage(gallery, parseInt(index));
        lightbox.classList.replace('lightbox-hidden', 'lightbox-visible');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.replace('lightbox-visible', 'lightbox-hidden');
        document.body.style.overflow = 'auto';
    }
    
    contentArea.addEventListener('click', e => {
        if (e.target.tagName === 'IMG' && e.target.dataset.gallery) {
            openLightbox(e.target.dataset.gallery, e.target.dataset.index);
        }

        if (e.target.matches('.pagination-button')) {
            playClickSound();
            const galleryName = e.target.dataset.gallery;
            const direction = parseInt(e.target.dataset.direction, 10);
            galleryState[galleryName].currentPage += direction;
            renderContent('gallery');
            const galleryNavButton = document.querySelector('.desktop-menu .nav-button[data-page="gallery"]');
            if (galleryNavButton) {
                galleryNavButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        if (e.target.closest('.social-link')) {
            playClickSound();
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', () => {
        const images = galleries[currentGallery].images;
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentGallery, newIndex);
    });
    lightboxNext.addEventListener('click', () => {
        const images = galleries[currentGallery].images;
        const newIndex = (currentIndex + 1) % images.length;
        showImage(currentGallery, newIndex);
    });
    document.addEventListener('keydown', e => {
        if (lightbox.classList.contains('lightbox-visible')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });
    
    function renderContent(page) {
        document.body.classList.remove('home-view', 'gallery-view');
        contentArea.classList.remove('flex-center');
        
        let contentHTML = '';

        if (page === 'home') {
            contentArea.classList.add('flex-center');
            document.body.classList.add('home-view');
            contentHTML = pageContent.home;
        } else if (page === 'gallery') {
            document.body.classList.add('gallery-view');
            contentHTML = `
                <div class="w-full">
                    ${Object.keys(galleries).map((galleryName, index, array) => {
                        const currentPage = galleryState[galleryName].currentPage;
                        const galleryHTML = createGalleryHTML(galleryName, galleries[galleryName], currentPage);
                        if (index < array.length - 1) {
                            return galleryHTML + `<hr class="gallery-hr">`;
                        }
                        return galleryHTML;
                    }).join('')}
                </div>
            `;
        } else {
             contentHTML = '<p>Page non trouvée.</p>';
        }
        
        contentArea.innerHTML = contentHTML;

        allNavButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.page === page) {
                button.classList.add('active');
            }
        });
    }

    if (titleLink) {
        titleLink.addEventListener('click', (event) => {
            event.preventDefault();
            playClickSound();
            renderContent('home');
        });
    }

    allNavButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            playClickSound();
            const page = event.currentTarget.dataset.page;
            if (page === 'gallery') {
                Object.keys(galleryState).forEach(key => galleryState[key].currentPage = 1);
            }
            renderContent(page);

            // Ajout du défilement vers le haut lorsque le bouton Gallery est cliqué
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    });

    hamburgerButton.addEventListener('click', () => {
        playClickSound();
        mobileMenu.classList.toggle('open');
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    renderContent('home');

    const lofiPlayer = document.getElementById('lofi-player');
    const dragHandle = document.createElement('div');
    dragHandle.className = 'lofi-drag-handle';
    dragHandle.innerHTML = `<svg fill="#7d7d7d" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" stroke="#7d7d7d"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M4.843 18.126l-3.64-3.644 3.64-3.612c.464-.45-.234-1.2-.71-.71L.14 14.127c-.187.186-.187.525 0 .71l3.993 4c.488.49 1.18-.238.71-.71zm19.314-7.252l3.64 3.644-3.64 3.61c-.464.453.234 1.202.71.712l3.994-3.967c.187-.186.187-.525 0-.71l-3.993-4c-.488-.49-1.18.238-.71.71zm-6.03 13.283l-3.645 3.64-3.61-3.64c-.453-.464-1.202.235-.712.71l3.967 3.994c.186.187.525.187.71 0l4-3.993c.49-.488-.238-1.18-.71-.71zM10.873 4.843l3.644-3.64 3.612 3.64c.45.464 1.2-.235.71-.71L14.873.14c-.186-.187-.525-.187-.71 0l-4 3.993c-.49.488.238 1.18.71.71zM14 3.5V14H3.5c-.65 0-.655 1 0 1H14v10.5c0 .67 1 .665 1 0V15h10.5c.667 0 .665-1 0-1H15V3.5c0-.682-1-.638-1 0z"></path> </g> </g></svg>`;
    lofiPlayer.appendChild(dragHandle);
    let isDragging = false, offsetX, offsetY;
    function initializeDragPosition() {
        const rect = lofiPlayer.getBoundingClientRect();
        lofiPlayer.style.top = `${rect.top}px`;
        lofiPlayer.style.left = `${rect.left}px`;
        lofiPlayer.style.bottom = 'auto';
        lofiPlayer.style.right = 'auto';
    }
    const startDrag = (e) => {
        if (lofiPlayer.style.top === '') initializeDragPosition();
        isDragging = true;
        lofiPlayer.classList.add('dragging');
        const rect = lofiPlayer.getBoundingClientRect();
        if (e.type === 'mousedown') {
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        } else {
            offsetX = e.touches[0].clientX - rect.left;
            offsetY = e.touches[0].clientY - rect.top;
        }
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    };
    const onDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        let currentX, currentY;
        if (e.type === 'mousemove') {
            currentX = e.clientX;
            currentY = e.clientY;
        } else {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }
        let newLeft = currentX - offsetX;
        let newTop = currentY - offsetY;
        const playerWidth = lofiPlayer.offsetWidth;
        const playerHeight = lofiPlayer.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + playerWidth > viewportWidth) newLeft = viewportWidth - playerWidth;
        if (newTop + playerHeight > viewportHeight) newTop = viewportHeight - playerHeight;
        lofiPlayer.style.left = `${newLeft}px`;
        lofiPlayer.style.top = `${newTop}px`;
    };
    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        lofiPlayer.classList.remove('dragging');
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    };
    dragHandle.addEventListener('mousedown', startDrag);
    dragHandle.addEventListener('touchstart', startDrag);
});
