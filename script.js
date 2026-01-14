// Verifica se estamos na página inicial antes de rodar lógica de scroll/nav
if (document.querySelector('nav')) {
let lastScrollTop = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
        nav.classList.add('hide-nav'); // Rolar para baixo -> esconde
    } else {
        nav.classList.remove('hide-nav'); // Rolar para cima -> mostra
    }

    if (scrollTop > 0) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
}

// Carregar Projetos do JSON
fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects-list');
        if (container) { // Só executa na home
        data.forEach((project, index) => {
            const card = document.createElement('div');
            card.classList.add('project-card');

            card.innerHTML = `
                <img src="${project.decoration}" class="corner-decoration" alt="Decoração">
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

        // Lógica para a página de detalhes do projeto
        const projectImg = document.getElementById('project-img');
        if (projectImg) {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');

            if (projectId && data[projectId]) {
                const project = data[projectId];
                const currentId = parseInt(projectId);

                // Navegação por setas do teclado
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        const prevId = currentId > 0 ? currentId - 1 : data.length - 1;
                        window.location.href = `project.html?id=${prevId}`;
                    } else if (e.key === 'ArrowRight') {
                        const nextId = currentId < data.length - 1 ? currentId + 1 : 0;
                        window.location.href = `project.html?id=${nextId}`;
                    }
                });

                // Navegação por clique nas setas visuais
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

                // Preencher Imagens
                document.getElementById('project-img').src = project.image;
                document.getElementById('project-decoration').src = project.decoration;

                // Preencher Tecnologias
                const techList = document.getElementById('tech-list');
                // Mapa de cores simples baseado no info_cards.json
                const colorMap = {
                    "HTML5": "#F78012", "CSS3": "#D5DD3F", "JavaScript": "#F8C400",
                    "Git / Github": "#000000", "Figma": "#F78012", "React": "#61DAFB",
                    "Node.js": "#339933", "Python": "#3776AB", "SQL": "#003B57"
                };
                
                if (project.technologies) {
                    project.technologies.forEach(tech => {
                        const color = colorMap[tech] || "#000"; // Cor padrão se não achar
                        const tag = document.createElement('div');
                        tag.classList.add('topic-tag');
                        tag.style.borderColor = color;
                        tag.style.color = color;
                        tag.textContent = tech;
                        techList.appendChild(tag);
                    });
                }

                // Preencher Card da Direita
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

// Carregar Info Cards (Skills) do JSON
if (document.querySelector('.container-main')) { // Só executa na home
fetch('info_cards.json')
    .then(response => response.json())
    .then(data => {
        const mainContainer = document.querySelector('.container-main');
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-cards-container');

        data.forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('info-card');

            // Criar HTML dos tópicos
            const topicsHtml = cardData.topics.map(topic => 
                `<div class="topic-tag" style="border-color: ${topic.color}; color: ${topic.color}">${topic.text}</div>`
            ).join('');

            card.innerHTML = `
                <img src="${cardData.icon}" class="info-card-icon" alt="Ícone">
                <h3 class="info-card-title">${cardData.title}</h3>
                <img src="${cardData.action_icon}" class="info-card-action" alt="Expandir">
                <div class="info-topics-container">
                    ${topicsHtml}
                </div>
            `;

            // Evento de clique para expandir
            card.addEventListener('click', () => {
                // Fecha outros cards se necessário (opcional, removi para permitir múltiplos abertos)
                // card.classList.toggle('expanded');
                
                // Lógica solicitada: clica estica, clica volta
                card.classList.toggle('expanded');

                // Mover título Contato
                const contato = document.getElementById('contato');
                const bastidores = document.querySelector('.bastidores-container');
                const footer = document.querySelector('footer');
                const hasExpandedCard = document.querySelector('.info-card.expanded');
                if (hasExpandedCard) {
                    contato.classList.add('moved-down');
                    if (bastidores) bastidores.classList.add('moved-down');
                    if (footer) footer.classList.add('moved-down');
                } else {
                    contato.classList.remove('moved-down');
                    if (bastidores) bastidores.classList.remove('moved-down');
                    if (footer) footer.classList.remove('moved-down');
                }
            });

            infoContainer.appendChild(card);
        });

        mainContainer.appendChild(infoContainer);
    })
    .catch(error => console.error('Erro ao carregar info cards:', error));
}