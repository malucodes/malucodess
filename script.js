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

// Carregar Projetos do JSON
fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects-list');
        data.forEach(project => {
            const card = document.createElement('div');
            card.classList.add('project-card');

            card.innerHTML = `
                <img src="${project.decoration}" class="corner-decoration" alt="Decoração">
                <h3>${project.title}</h3>
                <h4>${project.subtitle}</h4>
                <img src="${project.image}" class="project-image" alt="${project.title}">
                <a href="#" class="btn-more">Saber mais</a>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error('Erro ao carregar projetos:', error));