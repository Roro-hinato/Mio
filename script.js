document.addEventListener('DOMContentLoaded', () => {

    // Structure de données pour la galerie, maintenant avec une seule catégorie "Mio"
    const galleries = {
        mio: {
            icon: 'images/miohome.png',
            // La structure des images est maintenant un tableau d'objets
            // pour permettre des classes de style personnalisées.
            images: [
                { src: 'images/mio1.png' },
                { src: 'images/mio2.png' },
                { src: 'images/mio3.png' },
                { src: 'images/mio4.png' },
                { 
                  src: 'images/mio5.png', 
                  className: 'object-[75%_50%]' // Le focus est ajusté pour être moins à droite
                },
                { src: 'images/mio6.png' }
            ]
        }
    };

    // La fonction utilise maintenant l'objet 'galleryData' pour obtenir l'icône et les images.
    function createGalleryHTML(galleryName, galleryData) {
        return `
            <div class="mb-12">
                <h2 class="text-5xl font-bold mt-10 mb-10 text-center text-slate-300 capitalize flex items-center justify-center">
                    <img src="${galleryData.icon}" alt="Icone ${galleryName}" class="w-10 h-10 rounded-full mr-4 border-2 border-slate-300/50">
                    <span>${galleryName}</span>
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${galleryData.images.map((img, i) => `
                        <div class="group aspect-[9/16] overflow-hidden rounded-lg shadow-xl shadow-blue-900/30">
                            <img src="${img.src}" alt="Photo ${galleryName} ${i + 1}" 
                                 class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 cursor-pointer ${img.className || ''}"
                                 data-gallery="${galleryName}" 
                                 data-index="${i}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const pageContent = {
        home: `
            <div> <!-- Ce conteneur recevra l'animation fadeIn -->
                <div class="w-full max-w-2xl md:max-w-4xl mx-auto bg-slate-900/75 rounded-2xl shadow-xl p-8 md:p-12 backdrop-blur-sm border border-slate-700 animate-float">
                    <div class="flex flex-col md:flex-row items-center">
                        <div class="flex-shrink-0 mb-6 md:mb-0 md:mr-12">
                            <img src="images/miohome.png" alt="Profile Picture" class="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-blue-500 shadow-lg">
                        </div>
                        <div class="text-center md:text-left">
                            <h1 class="text-4xl md:text-5xl font-bold text-blue-400">Mio</h1>
                            <p class="text-lg md:text-xl text-slate-400 mb-4">The social butterfly ~</p>
                            <hr class="border-slate-700/50 my-4">
                            <p class="text-base md:text-lg text-slate-400 mb-6">
                                Welcome to my little safe place where I enjoy posting what I create. I hope you can relax and enjoy the pictures. ♥
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        gallery: `
            <div class="w-full">
                ${Object.keys(galleries).map((galleryName, index, array) => {
                    const galleryHTML = createGalleryHTML(galleryName, galleries[galleryName]);
                    // Ajoute un séparateur sauf pour la dernière galerie
                    if (index < array.length - 1) {
                        return galleryHTML + `<hr class="border-slate-700/50 my-12">`;
                    }
                    return galleryHTML;
                }).join('')}
            </div>
        `
    };

    const contentArea = document.getElementById('content-area');
    const allNavButtons = document.querySelectorAll('.nav-button');
    const galleryOverlay = document.getElementById('gallery-overlay');
    const hamburgerButton = document.getElementById('hamburger-button');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const clickSound = document.getElementById('click-sound');

    // --- Logique de déblocage audio ---
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


    // --- Logique du son de clic ---
    function playClickSound() {
        if (clickSound) {
            clickSound.volume = 0.5;
            clickSound.currentTime = 0;
            const playPromise = clickSound.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Erreur de lecture audio :", error);
                });
            }
        }
    }

    // --- Logique de survol de la galerie ---
    contentArea.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.group')) {
            galleryOverlay.classList.add('bg-black/60');
            e.target.closest('.group').classList.add('gallery-item-highlighted');
        }
    });

    contentArea.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.group')) {
            galleryOverlay.classList.remove('bg-black/60');
            e.target.closest('.group').classList.remove('gallery-item-highlighted');
        }
    });
    
    // --- Logique Lightbox ---
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
        // La source de l'image est maintenant dans la propriété 'src' de l'objet
        const images = galleries[gallery].images;
        if (!images || index < 0 || index >= images.length) {
            return;
        }
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
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

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
    
    // --- Fin de la logique Lightbox ---

    function renderContent(page) {
        contentArea.classList.remove('flex', 'items-center', 'justify-center');
        if (page === 'home') {
            contentArea.classList.add('flex', 'items-center', 'justify-center');
        }
        contentArea.innerHTML = pageContent[page] || '<p>Page non trouvée.</p>';
        allNavButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.page === page) {
                button.classList.add('active');
            }
        });
    }

    allNavButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            playClickSound();
            const page = event.currentTarget.dataset.page;
            renderContent(page);
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

    // --- Logique pour le lecteur Lo-Fi déplaçable ---
    const lofiPlayer = document.getElementById('lofi-player');
    
    const dragHandle = document.createElement('div');
    dragHandle.className = 'lofi-drag-handle';
    dragHandle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
    lofiPlayer.appendChild(dragHandle);

    let isDragging = false;
    let offsetX, offsetY;

    function initializeDragPosition() {
        const rect = lofiPlayer.getBoundingClientRect();
        lofiPlayer.style.top = `${rect.top}px`;
        lofiPlayer.style.left = `${rect.left}px`;
        lofiPlayer.style.bottom = 'auto';
        lofiPlayer.style.right = 'auto';
    }

    const startDrag = (e) => {
        if (lofiPlayer.style.top === '') {
            initializeDragPosition();
        }

        isDragging = true;
        lofiPlayer.classList.add('dragging');

        const rect = lofiPlayer.getBoundingClientRect();
        
        if (e.type === 'mousedown') {
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        } else { // touchstart
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
        } else { // touchmove
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

