// 1. Снегопад на фоне
function createSnow() {
    const snowContainer = document.getElementById('snow-container');
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❅';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowflake.style.opacity = Math.random() * 0.5 + 0.3;
    snowflake.style.fontSize = Math.random() * 15 + 10 + 'px';
    snowContainer.appendChild(snowflake);
    setTimeout(() => { snowflake.remove(); }, 5000);
}
setInterval(createSnow, 200);

// 2. Гирлянда
const plug = document.getElementById('plug');
const body = document.body;
plug.addEventListener('click', () => {
    body.classList.toggle('night-mode');
    body.classList.toggle('on');
});

// 3. СНЕЖНЫЙ ШАР (интерактивные частицы)
const globe = document.getElementById('snowGlobe');
const particlesContainer = document.getElementById('globeParticles');
let particles = [];

// Создаем начальные частицы
function initParticles() {
    for (let i = 0; i < 25; i++) {
        const flake = document.createElement('div');
        flake.classList.add('globe-flake');
        flake.innerHTML = '❅';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.top = Math.random() * 100 + '%';
        // Начальные скорости
        flake.dataset.vx = (Math.random() - 0.5) * 2;
        flake.dataset.vy = (Math.random() - 0.5) * 2;
        flake.dataset.angle = Math.random() * 360;
        particlesContainer.appendChild(flake);
        particles.push(flake);
    }
}
initParticles();

// Анимация частиц (постоянное движение)
function animateParticles() {
    particles.forEach(flake => {
        let vx = parseFloat(flake.dataset.vx);
        let vy = parseFloat(flake.dataset.vy);
        
        // Замедление
        vx *= 0.98;
        vy *= 0.98;
        
        // Добавляем гравитацию (легкое падение)
        vy += 0.02;

        // Обновляем позицию
        let currentLeft = parseFloat(flake.style.left) || 0;
        let currentTop = parseFloat(flake.style.top) || 0;
        
        let newLeft = currentLeft + vx;
        let newTop = currentTop + vy;

        // Отскок от границ (в процентах, примерно)
        if (newLeft < 0 || newLeft > 100) { vx *= -0.8; newLeft = currentLeft; }
        if (newTop < 0 || newTop > 100) { vy *= -0.8; newTop = currentTop; }

        flake.style.left = newLeft + '%';
        flake.style.top = newTop + '%';
        
        // Сохраняем обновленные скорости
        flake.dataset.vx = vx;
        flake.dataset.vy = vy;

        // Вращение
        let angle = parseFloat(flake.dataset.angle) || 0;
        angle += vx * 5;
        flake.dataset.angle = angle;
        flake.style.transform = `rotate(${angle}deg)`;
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Взаимодействие мышью (раздуваем снежинки)
globe.addEventListener('mousemove', (e) => {
    const rect = globe.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    particles.forEach(flake => {
        const flakeX = parseFloat(flake.style.left);
        const flakeY = parseFloat(flake.style.top);
        
        const distX = flakeX - mouseX;
        const distY = flakeY - mouseY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 25) { // Радиус влияния
            // Отталкиваем
            let vx = parseFloat(flake.dataset.vx) || 0;
            let vy = parseFloat(flake.dataset.vy) || 0;
            vx += (distX / dist) * 0.8;
            vy += (distY / dist) * 0.8;
            flake.dataset.vx = vx;
            flake.dataset.vy = vy;
        }
    });
});

// Для телефонов (touch)
globe.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = globe.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseX = ((touch.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((touch.clientY - rect.top) / rect.height) * 100;

    particles.forEach(flake => {
        const flakeX = parseFloat(flake.style.left);
        const flakeY = parseFloat(flake.style.top);
        const distX = flakeX - mouseX;
        const distY = flakeY - mouseY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 25) {
            let vx = parseFloat(flake.dataset.vx) || 0;
            let vy = parseFloat(flake.dataset.vy) || 0;
            vx += (distX / dist) * 0.8;
            vy += (distY / dist) * 0.8;
            flake.dataset.vx = vx;
            flake.dataset.vy = vy;
        }
    });
}, { passive: false });

// 4. Кликер
let cookies = 0;
const cookieCount = document.getElementById('cookieCount');
const deer = document.getElementById('deer');
const feedBtn = document.getElementById('feedBtn');
const certModal = document.getElementById('certModal');
const progressFill = document.getElementById('progressFill');
let isGoalReached = false;

function feed() {
    if (cookies >= 20) return;
    cookies++;
    cookieCount.innerText = cookies;
    progressFill.style.width = (cookies / 20) * 100 + '%';
    deer.style.transform = 'scale(1.2) rotate(-10deg)';
    setTimeout(() => deer.style.transform = 'scale(1) rotate(0deg)', 150);

    if (cookies >= 20 && !isGoalReached) {
        isGoalReached = true;
        certModal.style.display = 'flex';
    }
}
deer.addEventListener('click', feed);
feedBtn.addEventListener('click', feed);
document.getElementById('closeModal').addEventListener('click', () => {
    certModal.style.display = 'none';
});

// 5. Игра Поймай снежинку
const gameArea = document.getElementById('gameArea');
const scoreSpan = document.getElementById('score');
const timeSpan = document.getElementById('time');
const startGameBtn = document.getElementById('startGameBtn');
let score = 0;
let timeLeft = 0;
let gameInterval;
let spawnInterval;

startGameBtn.addEventListener('click', () => {
    if (gameInterval) return;
    score = 0;
    timeLeft = 10;
    scoreSpan.innerText = score;
    timeSpan.innerText = timeLeft;
    gameArea.innerHTML = '';
    startGameBtn.disabled = true;
    startGameBtn.innerText = 'Игра идет...';

    gameInterval = setInterval(() => {
        timeLeft--;
        timeSpan.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
            gameInterval = null;
            startGameBtn.disabled = false;
            startGameBtn.innerText = 'Играть снова';
            gameArea.innerHTML = '<p style="text-align:center; padding-top:80px; color:var(--neon-pink);">Игра окончена! Твой счет: ' + score + '</p>';
        }
    }, 1000);

    spawnInterval = setInterval(() => {
        if (timeLeft <= 0) return;
        const flake = document.createElement('div');
        flake.classList.add('catch-snowflake');
        flake.innerHTML = '❅';
        flake.style.left = Math.random() * 90 + '%';
        flake.style.top = Math.random() * 80 + '%';
        flake.addEventListener('click', () => {
            if (timeLeft <= 0) return;
            score++;
            scoreSpan.innerText = score;
            flake.remove();
        });
        gameArea.appendChild(flake);
        setTimeout(() => { if(flake.parentNode) flake.remove(); }, 1500);
    }, 500);
});

// 6. Предсказание
const predictions = [
    "Тебя ждет незабываемая сессия... в хорошем смысле!",
    "В новом году ты найдешь идеальный рецепт оливье.",
    "Твой код скомпилируется с первого раза. Проверь.",
    "Тебя ждет встреча с интересным человеком (возможно, с Дедом Морозом).",
    "В следующем году ты точно выспишься. Наверное.",
    "Удача будет на твоей стороне, особенно в 00:00.",
    "Ты получишь неожиданный подарок от вселенной.",
    "Сбудется то, о чем ты думаешь прямо сейчас!"
];
document.getElementById('predictBtn').addEventListener('click', () => {
    document.getElementById('predictionBox').innerText = predictions[Math.floor(Math.random() * predictions.length)];
});

// 7. Тест
const quizData = [
    { q: "Что делают в новогоднюю ночь?", options: ["Спят", "Смотрят 'Иронию судьбы'", "Учат матан"], correct: 1 },
    { q: "Лучший подарок на НГ?", options: ["Носки", "Сданная сессия", "Гирлянда"], correct: 1 },
    { q: "Кто приносит подарки?", options: ["Дед Мороз", "Санта", "Курьер из Озона"], correct: 2 }
];
const quizContainer = document.getElementById('quizContainer');
const quizResult = document.getElementById('quizResult');
let answered = 0;
let correctCount = 0;

quizData.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('quiz-question');
    div.innerHTML = `<p>${index + 1}. ${item.q}</p>`;
    item.options.forEach((opt, i) => {
        const btn = document.createElement('div');
        btn.classList.add('quiz-option');
        btn.innerText = opt;
        btn.dataset.index = i;
        btn.dataset.correct = i === item.correct ? 'true' : 'false';
        btn.addEventListener('click', function() {
            if (this.parentNode.dataset.answered) return;
            this.parentNode.dataset.answered = 'true';
            if (this.dataset.correct === 'true') {
                this.classList.add('correct');
                correctCount++;
            } else {
                this.classList.add('wrong');
            }
            answered++;
            if (answered === quizData.length) {
                quizResult.innerText = `Ты ответил правильно на ${correctCount} из ${quizData.length} вопросов!`;
            }
        });
        div.appendChild(btn);
    });
    quizContainer.appendChild(div);
});

// 8. Погода
const weatherText = document.getElementById('weatherText');
const weathers = [
    "За окном: <span>-15°C</span>, В душе: <span>+100°C</span> от предвкушения подарков",
    "За окном: <span>-20°C</span>, В душе: <span>+36.6°C</span> и легкая грусть по лету",
    "За окном: <span>Метель</span>, В душе: <span>Штиль</span> и оливье",
    "За окном: <span>Гололед</span>, В душе: <span>Неоновый свет</span> и вечеринка",
    "За окном: <span>-5°C</span>, В душе: <span>+1000°C</span> после просмотра этого сайта"
];
function setWeather() {
    weatherText.innerHTML = weathers[Math.floor(Math.random() * weathers.length)];
}
setWeather();
setInterval(setWeather, 5000);

// 9. Цитаты
const quotes = [
    "«Зима близко.» — Дед Мороз (и Джон Сноу)",
    "«Я не герой. Я просто парень, который хочет съесть весь оливье.»",
    "«Лучший подарок — это когда твой сейв не крашнулся перед Новым Годом.»",
    "«Надо, Федя, надо!» (Сказать, когда лень идти за хлебом)",
    "«Валгалла ждет, но сначала — печеньки.»",
    "«Гарри, ты волшебник!» (Когда нашел мандаринку в кармане куртки)",
    "«Ты — Избранный» (Сказать одногруппнику, когда он сдал сессию)",
    "«Это не баг, это новогодняя фича.»",
    "«Один дома... опять.» (Намек на новогодние фильмы)",
    "«Свет! Камера! Мотор! С Новым Годом!»"
];
const quoteBox = document.getElementById('quoteBox');
document.getElementById('quoteBtn').addEventListener('click', () => {
    quoteBox.innerText = quotes[Math.floor(Math.random() * quotes.length)];
});

// 10. Чек-лист (с сохранением)
const tasks = ['task1', 'task2', 'task3', 'task4', 'task5'];
tasks.forEach(id => {
    const checkbox = document.getElementById(id);
    if (localStorage.getItem(id) === 'true') {
        checkbox.checked = true;
    }
    checkbox.addEventListener('change', () => {
        localStorage.setItem(id, checkbox.checked);
    });
});

// 11. Показать форму после прочтения
document.getElementById('readMoreBtn').addEventListener('click', function() {
    document.getElementById('formSection').style.display = 'block';
    this.style.display = 'none';
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
});

// 12. Отправка формы через Fetch (без перезагрузки страницы)
const contactForm = document.getElementById('contactForm');
const successToast = document.getElementById('successToast');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Отменяем стандартную отправку (перезагрузку)

    // Меняем текст кнопки, чтобы показать, что идет процесс
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    // Собираем данные из формы
    const formData = new FormData(contactForm);

    // Отправляем на Formspree
    // ВАЖНО: Замени xwllyblg на свой ID, если он другой!
    fetch('https://formspree.io/f/xwllyblg', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Успех!
            contactForm.reset(); // Очищаем поля
            successToast.classList.add('show'); // Показываем плашку

            // Скрываем плашку через 4 секунды
            setTimeout(() => {
                successToast.classList.remove('show');
            }, 4000);
        } else {
            // Ошибка на стороне сервера
            alert('Ой, что-то пошло не так. Попробуй еще раз!');
        }
    })
    .catch(error => {
        // Ошибка сети (например, нет интернета)
        alert('Ошибка сети. Проверь подключение к интернету.');
    })
    .finally(() => {
        // Возвращаем кнопку в исходное состояние
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    });
});
