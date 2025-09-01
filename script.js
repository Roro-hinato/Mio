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
                            <!-- src est vide initialement, il sera rempli par la miniature générée -->
                            <img src="" 
                                 data-src="${img.src}" 
                                 alt="Photo ${galleryName} ${i + 1}" 
                                 class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 cursor-pointer ${img.className || ''}"
                                 data-gallery="${galleryName}" 
                                 data-index="${i}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Fonction pour pré-charger les images de la galerie en arrière-plan
    function preloadGalleryImages() {
        console.log("Pré-chargement des images de la galerie en cours...");
        Object.values(galleries).forEach(gallery => {
            gallery.images.forEach(imgData => {
                const image = new Image();
                image.src = imgData.src;
            });
        });
    }

    // Fonction pour générer et afficher des miniatures basse résolution via canvas
    function renderLowResThumbnails() {
        const galleryImages = document.querySelectorAll('.grid img[data-src]');

        galleryImages.forEach(imgElement => {
            const highResSrc = imgElement.dataset.src;
            const loader = new Image();
            loader.crossOrigin = "Anonymous"; // Nécessaire pour le canvas si les images sont sur un autre domaine
            loader.src = highResSrc;

            loader.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // MODIFICATION: Viser une hauteur de 720px (720p) et calculer la largeur correspondante
                const targetHeight = 720;
                const aspectRatio = loader.naturalWidth / loader.naturalHeight;
                const targetWidth = Math.round(targetHeight * aspectRatio);

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                // Dessiner l'image haute résolution sur le canvas redimensionné
                ctx.drawImage(loader, 0, 0, targetWidth, targetHeight);

                // Appliquer la version basse résolution (via data URL) à l'élément image de la galerie
                // J'ai légèrement augmenté la qualité car la résolution est plus élevée
                imgElement.src = canvas.toDataURL('image/jpeg', 0.85); 
            };
            loader.onerror = () => {
                console.error(`Impossible de charger l'image: ${highResSrc}`);
            };
        });
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
                            <div class="mt-6 flex justify-center md:justify-start">
                                <a href="https://x.com/Mio_Nii0" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/70 hover:text-white transition-all duration-300 shadow-lg">
                                    <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg">
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
    const titleLink = document.querySelector('header nav a');

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
        // La lightbox utilise toujours la source originale haute résolution depuis l'objet de données
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

        // Si la page est la galerie, on génère les miniatures
        if (page === 'gallery') {
            // setTimeout s'assure que le DOM a été mis à jour avant de manipuler les images
            setTimeout(() => renderLowResThumbnails(), 0);
        }
    }

    // Ajout de l'écouteur d'événement pour le titre/logo
    if (titleLink) {
        titleLink.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            playClickSound();
            renderContent('home');
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
    preloadGalleryImages(); // On conserve le pré-chargement pour accélérer la génération des miniatures

    // --- Logique pour le lecteur Lo-Fi déplaçable ---
    const lofiPlayer = document.getElementById('lofi-player');
    
    const dragHandle = document.createElement('div');
    dragHandle.className = 'lofi-drag-handle';
    // Remplacement par le nouveau SVG
    dragHandle.innerHTML = `<svg fill="#7d7d7d" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" stroke="#7d7d7d"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M4.843 18.126l-3.64-3.644 3.64-3.612c.464-.45-.234-1.2-.71-.71L.14 14.127c-.187.186-.187.525 0 .71l3.993 4c.488.49 1.18-.238.71-.71zm19.314-7.252l3.64 3.644-3.64 3.61c-.464.453.234 1.202.71.712l3.994-3.967c.187-.186.187-.525 0-.71l-3.993-4c-.488-.49-1.18.238-.71.71zm-6.03 13.283l-3.645 3.64-3.61-3.64c-.453-.464-1.202.235-.712.71l3.967 3.994c.186.187.525.187.71 0l4-3.993c.49-.488-.238-1.18-.71-.71zM10.873 4.843l3.644-3.64 3.612 3.64c.45.464 1.2-.235.71-.71L14.873.14c-.186-.187-.525-.187-.71 0l-4 3.993c-.49.488.238 1.18.71.71zM14 3.5V14H3.5c-.65 0-.655 1 0 1H14v10.5c0 .67 1 .665 1 0V15h10.5c.667 0 .665-1 0-1H15V3.5c0-.682-1-.638-1 0z"></path> </g> </g></svg>`;
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

