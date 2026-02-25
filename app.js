document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // Preenche info
      document.getElementById('restaurant-name').textContent = data.restaurant.name;
      document.getElementById('description').textContent = data.restaurant.description;
      document.getElementById('address').textContent = 'Address: ' + data.restaurant.address;
      document.getElementById('phone').textContent = 'Telephone: ' + data.restaurant.phone;
      document.getElementById('hours').textContent = 'Schedules: ' + data.restaurant.hours;
      document.getElementById('rating').textContent = 'Assessment: ' + data.restaurant.rating;
      document.getElementById('services').textContent = 'Services: ' + data.restaurant.services.join(', ');
      document.getElementById('reviews').textContent = 'Review Summary: ' + data.reviewsSummary;

      // Galeria de imagens

      // Apresentação infinita: uma imagem de cada vez sobe para o centro, fica, sai e repete para sempre
const presentationContainer = document.querySelector('.presentation-container');

if (presentationContainer && data.restaurant.images && data.restaurant.images.length > 0) {
  const images = data.restaurant.images;
  const menuItems = data.menu.flatMap(cat => cat.items); // para nomes e preços

  let currentIndex = 0;

  function showNextImage() {
    // Limpa o container (remove a imagem anterior)
    presentationContainer.innerHTML = '';

    // Pega a imagem atual e info relacionada (loop cíclico)
    const url = images[currentIndex];
    const related = menuItems[currentIndex % menuItems.length] || {};
    const name = related.name || 'Prato Especial';
    const price = related.price ? `${related.price} ${related.currency}` : 'Sabor Autêntico';

    // Cria o novo slide
    const slide = document.createElement('div');
    slide.classList.add('presentation-item', 'entering'); // começa em baixo

    slide.innerHTML = `
      <img src="${url}" alt="${name}" loading="lazy">
      <div class="presentation-overlay">
        <h4>${name}</h4>
        <p>${price}</p>
      </div>
    `;

    presentationContainer.appendChild(slide);

    // Força o browser a reconhecer a mudança para animação funcionar
    slide.offsetHeight;

    // Ativa a animação de subida para o centro
    setTimeout(() => {
      slide.classList.add('active');
    }, 50); // pequeno delay para transição suave

    // Após X segundos visível → prepara saída e próxima
    setTimeout(() => {
      // Inicia fade out / saída suave
      slide.classList.remove('active');

      // Espera a animação de saída terminar antes de chamar a próxima
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length; // loop infinito
        showNextImage(); // chama a próxima imediatamente
      }, 1200); // tempo da transição de saída (ajusta se quiser mais lento/rápido)
    }, 5000); // tempo que cada imagem fica parada no centro (5 segundos – muda aqui)
  }

  // Inicia o ciclo infinito
  showNextImage();
} else {
  console.warn('Não há imagens ou container encontrado para a apresentação.');
}

      // Menu
const menuDiv = document.getElementById('menu-items');

data.menu.forEach(category => {
  const catTitle = document.createElement('h3');
  catTitle.textContent = category.category;
  menuDiv.appendChild(catTitle);

  category.items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('menu-item'); // importante para o CSS aplicar

    itemDiv.innerHTML = `
      <div class="menu-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-content">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price">${item.price} ${item.currency}</div>
      </div>
    `;

    menuDiv.appendChild(itemDiv);
  });
});

      // Mapa (embed Google Maps)
      const mapDiv = document.getElementById('map');
      mapDiv.innerHTML = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.123456789!2d${data.restaurant.coordinates.lng}!3d${data.restaurant.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1588e9e7f18d0fed%3A0xb41c54a6792f04d9!2sPakistani%20Restaurant!5e0!3m2!1sen!2ssa!4v1678901234567" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    });

  // Botão de tradução
  document.getElementById('translate-btn').addEventListener('click', () => {
    document.getElementById('google_translate_element').style.display = 'block';
  });

  // Formulário de reserva
  document.getElementById('reservation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Reserva confirmada! Detalhes: ' + 
      '\nNome: ' + document.getElementById('name').value +
      '\nEmail: ' + document.getElementById('email').value +
      '\nData: ' + document.getElementById('date').value +
      '\nHora: ' + document.getElementById('time').value +
      '\nPessoas: ' + document.getElementById('people').value);
    // Aqui poderia enviar para um backend real
  });
});

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Scroll Reveal simples (sem biblioteca, puro JS)
const revealElements = document.querySelectorAll('section, .menu-item, #images-gallery img');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  
  revealElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
      if (el.tagName === 'IMG') el.classList.add('loaded');
    }
  });
};







window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Chama no load inicial

// Para menu items carregarem com delay bonito
setTimeout(() => {
  document.querySelectorAll('.menu-item').forEach((item, index) => {
    setTimeout(() => item.classList.add('visible'), 150 * index);
  });
}, 800);

