if (document.querySelector('nav')) {
let lastScrollTop = 0;
const nav = document.querySelector('nav');

const hamburger = document.createElement('button');
hamburger.classList.add('hamburger');
hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.innerHTML = `
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
`;
nav.appendChild(hamburger);

const navMenu = nav.querySelector('ul');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    const isActive = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isActive);
    hamburger.setAttribute('aria-label', isActive ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
        nav.classList.add('hide-nav');
    } else {
        nav.classList.remove('hide-nav');
    }

    if (scrollTop > 0) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
}

fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects-list');
        if (container) {
        data.forEach((project, index) => {
            const card = document.createElement('div');
            card.classList.add('project-card');

            card.innerHTML = `
                <img src="${project.decoration}" class="corner-decoration" alt="">
                <h3>${project.title}</h3>
                <h4>${project.subtitle}</h4>
                <img src="${project.image}" class="project-image" alt="${project.title}">
                <a href="project.html?id=${index}" class="btn-more">
                    Saber mais
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            `;

            container.appendChild(card);
        });
        }

        const projectImg = document.getElementById('project-img');
        if (projectImg) {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');

            if (projectId && data[projectId]) {
                const project = data[projectId];
                const currentId = parseInt(projectId);

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        const prevId = currentId > 0 ? currentId - 1 : data.length - 1;
                        window.location.href = `project.html?id=${prevId}`;
                    } else if (e.key === 'ArrowRight') {
                        const nextId = currentId < data.length - 1 ? currentId + 1 : 0;
                        window.location.href = `project.html?id=${nextId}`;
                    }
                });

                const prevBtn = document.getElementById('prev-project');
                const nextBtn = document.getElementById('next-project');

                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        const prevId = currentId > 0 ? currentId - 1 : data.length - 1;
                        window.location.href = `project.html?id=${prevId}`;
                    });
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        const nextId = currentId < data.length - 1 ? currentId + 1 : 0;
                        window.location.href = `project.html?id=${nextId}`;
                    });
                }

                document.getElementById('project-img').src = project.image;
                document.getElementById('project-decoration').src = project.decoration;

                const techList = document.getElementById('tech-list');
                const colorMap = {
                    "HTML5": "#F78012", "CSS3": "#D5DD3F", "JavaScript": "#F8C400",
                    "Git / Github": "#000000", "Figma": "#F78012", "React": "#61DAFB",
                    "Node.js": "#339933", "Python": "#3776AB", "SQL": "#003B57"
                };
                
                if (project.technologies) {
                    project.technologies.forEach(tech => {
                        const color = colorMap[tech] || "#000";
                        const tag = document.createElement('div');
                        tag.classList.add('topic-tag');
                        tag.style.borderColor = color;
                        tag.style.color = color;
                        tag.textContent = tech;
                        techList.appendChild(tag);
                    });
                }

                const cardContainer = document.getElementById('project-card-container');
                cardContainer.innerHTML = `
                    <div class="project-info-header">
                        <h1><span>${project.title}</span></h1>
                    </div>
                    <div class="project-info-body">
                        <div class="project-description">
                            ${project.description || "Descrição do projeto indisponível."}
                        </div>
                        <div class="project-buttons">
                            <a href="${project.site_link}" target="_blank" class="btn-project btn-site">Site</a>
                            <a href="${project.code_link}" target="_blank" class="btn-project btn-code">Código</a>
                        </div>
                    </div>
                `;
            }
        }
    })
    .catch(error => console.error('Erro ao carregar projetos:', error));

if (document.querySelector('.container-main')) {
fetch('info_cards.json')
    .then(response => response.json())
    .then(data => {
        const mainContainer = document.querySelector('.container-main');
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-cards-container');

        data.forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('info-card');
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-expanded', 'false');
            card.setAttribute('aria-label', `Ver detalhes de ${cardData.title}`);

            const topicsHtml = cardData.topics.map(topic => 
                `<div class="topic-tag" style="border-color: ${topic.color}; color: ${topic.color}">${topic.text}</div>`
            ).join('');

            card.innerHTML = `
                <img src="${cardData.icon}" class="info-card-icon" alt="">
                <h3 class="info-card-title">${cardData.title}</h3>
                <img src="${cardData.action_icon}" class="info-card-action" alt="">
                <div class="info-topics-container">
                    ${topicsHtml}
                </div>
            `;

            const toggleCard = () => {
                card.classList.toggle('expanded');
                const isExpanded = card.classList.contains('expanded');
                card.setAttribute('aria-expanded', isExpanded);

                const contato = document.getElementById('contato');
                const bastidores = document.querySelector('.bastidores-container');
                const footer = document.querySelector('footer');
                const form = document.querySelector('.contact-form-container');
                const hasExpandedCard = document.querySelector('.info-card.expanded');
                if (hasExpandedCard) {
                    contato.classList.add('moved-down');
                    if (bastidores) bastidores.classList.add('moved-down');
                    if (footer) footer.classList.add('moved-down');
                    if (form) form.classList.add('moved-down');
                } else {
                    contato.classList.remove('moved-down');
                    if (bastidores) bastidores.classList.remove('moved-down');
                    if (footer) footer.classList.remove('moved-down');
                    if (form) form.classList.remove('moved-down');
                }
            };

            card.addEventListener('click', toggleCard);

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard();
                }
            });

            infoContainer.appendChild(card);
        });

        mainContainer.appendChild(infoContainer);
    })
    .catch(error => console.error('Erro ao carregar info cards:', error));
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        const btn = contactForm.querySelector('button');
        
        const originalBtnText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;

        try {
            const response = await fetch(e.target.action, {
                method: 'POST',
                body: new FormData(e.target),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Mensagem enviada com sucesso! 🚀";
                status.style.color = "green";
                contactForm.reset();
            } else {
                status.innerHTML = "Ops! Houve um erro ao enviar.";
                status.style.color = "red";
            }
        } catch (error) {
            status.innerHTML = "Erro de conexão. Tente novamente.";
            status.style.color = "red";
        } finally {
            btn.innerText = originalBtnText;
            btn.disabled = false;
        }
    });
}