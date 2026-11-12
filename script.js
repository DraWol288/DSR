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
    for (let i = 0; i < 40; i++) {
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
    "Ты напишешь код, который будет работать без багов даже после ночного деплоя перед сессией.",
    "Ты получишь неожиданный подарок от вселенной.",
    "Твой код скомпилируется без варнингов, а тесты пройдут с первого запуска.",
    "Ты получишь автомат по предмету, который считал самым сложным и нелюбимым.",
    "Ты выспишься перед парой в восемь утра и не уснёшь на ней от усталости.",
    "Ты закончишь год с чистым репозиторием, закрытыми долгами по учёбе и лёгким сердцем.",
    "Ты перестанешь прокрастинировать хотя бы на неделю и удивишься своей продуктивности.",
    "Ты найдёшь баланс между учёбой, проектами и личной жизнью, не выгорев к весне.",
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
    "«Finish him!»",
    "«Press F to pay respects»",
    "«28 ударов ножом. Ты действовал наверняка.»",
    "«Гойда»",
    "«Fatality!»",
    "Тот, у кого хватит храбрости и терпения всю жизнь вглядываться во мрак, первым увидит в нём проблеск света",
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
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Отменяем стандартную отправку

    // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА НА ПУСТОТУ
    const nameValue = userNameInput.value.trim();
    const messageValue = userMessageInput.value.trim();

    if (nameValue === '' || messageValue === '') {
        alert('Пожалуйста, заполни оба поля: и имя, и сообщение!');
        return; // Останавливаем выполнение, ничего не отправляем
    }

    // Меняем текст кнопки
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    // Собираем данные
    const formData = new FormData(contactForm);

    // Отправляем на Formspree
    fetch('https://formspree.io/f/xwllyblg', { // Твой ID
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            contactForm.reset(); 
            successToast.classList.add('show'); 

            setTimeout(() => {
                successToast.classList.remove('show');
            }, 4000);
        } else {
            alert('Ой, что-то пошло не так. Попробуй еще раз!');
        }
    })
    .catch(error => {
        alert('Ошибка сети. Проверь подключение к интернету.');
    })
    .finally(() => {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    });
});

// 13. Бонусы для ПК (работают только если элементы есть на странице)
// Счетчик подарков (просто для красоты, рандомно увеличивается)
const pcGiftsCount = document.getElementById('pcGiftsCount');
if (pcGiftsCount) {
    setInterval(() => {
        let current = parseInt(pcGiftsCount.innerText);
        if (current < 99) {
            pcGiftsCount.innerText = current + 1;
        }
    }, 3000);
}

// Снеговик
const pcSnowman = document.getElementById('pcSnowman');
const pcSnowmanText = document.getElementById('pcSnowmanText');
const snowmanPhrases = [
    "Ой! Щекотно!",
    "Еще разок!",
    "Я растаял... шучу!",
    "С Новым Годом!",
    "Ты лучший!",
    "Хочешь морковку?"
];
if (pcSnowman) {
    pcSnowman.addEventListener('click', () => {
        pcSnowmanText.innerText = snowmanPhrases[Math.floor(Math.random() * snowmanPhrases.length)];
        pcSnowman.style.transform = 'scale(1.2) rotate(-10deg)';
        setTimeout(() => {
            pcSnowman.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    });
}

// --- ЛОГИКА ДЛЯ НОВЫХ ПК-ВИДЖЕТОВ ---

// 1. Таймер до Нового Года
function updateTimer() {
    const timerEl = document.getElementById('newYearTimer');
    if (!timerEl) return; // Если мы на телефоне, ничего не делаем

    const now = new Date();
    const currentYear = now.getFullYear();
    // Устанавливаем дату на 1 января следующего года (00:00:00)
    let nextYear = new Date(currentYear + 1, 0, 1);
    
    // Если мы уже в новом году (например, сейчас январь), берем следующий год
    if (now.getMonth() === 0 && now.getDate() === 1) {
        // Если сегодня 1 января, можно показывать, что Новый Год наступил
        // Но для теста оставим логику до следующего
    }

    const diff = nextYear - now;

    if (diff <= 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}

// Запускаем таймер, если элемент существует
if (document.getElementById('newYearTimer')) {
    updateTimer();
    setInterval(updateTimer, 1000);
}

// 2. Снежный ком
const snowball = document.getElementById('snowball');
let snowballSize = 50;
if (snowball) {
    snowball.addEventListener('click', () => {
        snowballSize += 5;
        if (snowballSize > 110) {
            snowballSize = 50; // Сбрасываем, если стал слишком большим
            snowball.style.background = '#fff';
        }
        snowball.style.width = snowballSize + 'px';
        snowball.style.height = snowballSize + 'px';
        
        // Меняем цвет на голубоватый по мере роста
        if (snowballSize > 80) {
            snowball.style.background = '#ccffff';
        }
    });
}

// 3. Ёлочный шар
const bauble = document.getElementById('bauble');
if (bauble) {
    bauble.addEventListener('click', () => {
        bauble.classList.add('spin');
        // Меняем цвет неона случайным образом
        const colors = ['var(--neon-pink)', 'var(--neon-cyan)', 'var(--neon-purple)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        bauble.style.boxShadow = `0 0 40px ${randomColor}`;
        
        setTimeout(() => {
            bauble.classList.remove('spin');
        }, 1000);
    });
}

// 4. Рецепт оливье (вычеркивание)
const recipeItems = document.querySelectorAll('.recipe-item');
recipeItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('bought');
    });
});

/* ============================================================
   ВИЗУАЛ И АТМОСФЕРА
   ============================================================ */

// ---------- 1. ПАРАЛЛАКС-ЗВЁЗДЫ ----------
(function initStars() {
    const layer = document.getElementById('starsLayer');
    if (!layer) return;
    const starCount = 80;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
        const s = document.createElement('div');
        s.classList.add('star');
        const size = Math.random() * 2 + 1;
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDuration = (Math.random() * 3 + 2) + 's';
        s.style.animationDelay = (Math.random() * 3) + 's';
        // Скорость параллакса для каждой звезды
        s.dataset.parallax = (Math.random() * 0.3 + 0.05).toFixed(2);
        layer.appendChild(s);
        stars.push(s);
    }
    // Параллакс при движении мыши
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        stars.forEach(s => {
            const p = parseFloat(s.dataset.parallax);
            s.style.transform = `translate(${mouseX * 20 * p}px, ${mouseY * 20 * p}px)`;
        });
    });
})();

// ---------- 2. КУРСОР-ЧАСТИЦЫ ПРИ КЛИКЕ ----------
(function initClickParticles() {
    const container = document.getElementById('clickParticles');
    if (!container) return;
    const symbols = ['❅', '❆', '✻', '✦', '❄'];
    document.addEventListener('click', (e) => {
        const count = 3;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.classList.add('click-flake');
            p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            p.style.left = (e.clientX + (Math.random() - 0.5) * 30) + 'px';
            p.style.top = (e.clientY + (Math.random() - 0.5) * 30) + 'px';
            p.style.color = Math.random() > 0.5 ? 'var(--neon-cyan)' : 'var(--neon-pink)';
            p.style.fontSize = (Math.random() * 10 + 12) + 'px';
            container.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    });
})();

// ---------- 3. ЗВУКИ (Web Audio API, без внешних файлов) ----------
const soundEngine = (function() {
    let ctx = null;
    let muted = false;
    function getCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        return ctx;
    }
    function playTone(freq, duration, type = 'sine', volume = 0.1) {
        if (muted) return;
        try {
            const c = getCtx();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, c.currentTime);
            gain.gain.setValueAtTime(volume, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start();
            osc.stop(c.currentTime + duration);
        } catch (e) { /* игнорируем */ }
    }
    return {
        click: () => playTone(880, 0.08, 'triangle', 0.05),
        success: () => {
            playTone(523, 0.12, 'sine', 0.08);
            setTimeout(() => playTone(659, 0.12, 'sine', 0.08), 100);
            setTimeout(() => playTone(784, 0.25, 'sine', 0.08), 200);
        },
        bell: () => playTone(1200, 0.4, 'sine', 0.06),
        error: () => playTone(200, 0.2, 'sawtooth', 0.06),
        toggleMute: () => { muted = !muted; return muted; },
        isMuted: () => muted
    };
})();

// Навешиваем звук на кнопки/действия
document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.quiz-option') ||
        e.target.closest('.tree-bulb') || e.target.closest('.atm-btn')) {
        soundEngine.click();
    }
});

// ---------- 4. КНОПКА MUTE ----------
const muteBtn = document.getElementById('muteBtn');
if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        const isMuted = soundEngine.toggleMute();
        muteBtn.innerText = isMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('active', isMuted);
    });
}

// ---------- 5. СНЕЖНАЯ БУРЯ ----------
const stormBtn = document.getElementById('stormBtn');
let stormActive = false;
let stormTimer = null;
if (stormBtn) {
    stormBtn.addEventListener('click', () => {
        stormActive = !stormActive;
        document.body.classList.toggle('storm', stormActive);
        stormBtn.classList.toggle('active', stormActive);
        if (stormActive) {
            // Ускоряем создание снега
            window._stormInterval = setInterval(createSnow, 60);
            stormTimer = setTimeout(() => {
                // Авто-выключение через 15 секунд
                if (stormActive) stormBtn.click();
            }, 15000);
        } else {
            clearInterval(window._stormInterval);
            clearTimeout(stormTimer);
        }
    });
}

// ---------- 6. ЁЛКА В УГЛУ ----------
const cornerTree = document.getElementById('cornerTree');
if (cornerTree) {
    cornerTree.addEventListener('click', () => {
        cornerTree.classList.add('tree-glow');
        soundEngine.bell();
        // Мигаем всеми лампочками
        const bulbs = cornerTree.querySelectorAll('.tree-bulb');
        bulbs.forEach((b, i) => {
            setTimeout(() => {
                b.style.transform = 'scale(2)';
                setTimeout(() => b.style.transform = '', 200);
            }, i * 60);
        });
        setTimeout(() => cornerTree.classList.remove('tree-glow'), 1000);
    });
}

/* ============================================================
   ТЕМАТИЧЕСКИЕ ФИШКИ
   ============================================================ */

// ---------- 7. ГЕНЕРАТОР НОВОГОДНЕГО ИМЕНИ ----------
(function initNameGen() {
    const box = document.getElementById('nameGenBox');
    const btn = document.getElementById('nameGenBtn');
    if (!box || !btn) return;

    const adjectives = [
        'Великолепный', 'Снежный', 'Неоновый', 'Морозный', 'Праздничный',
        'Оливье-мастер', 'Сессионный', 'Гирляндо-владелец', 'Мандариновый',
        'Код-волшебник', 'Снеговико-повелитель', 'Подарко-раздающий',
        'Ёлочный', 'Багфикс-герой', 'Новогодний', 'Сияющий'
    ];
    const titles = [
        'Стас Великолепный', 'Стас Снежный', 'Стас Неоновый',
        'Стас Морозный', 'Стас Праздничный', 'Стас Оливье-мастер',
        'Стас Сессионный', 'Стас Гирляндо-владелец', 'Стас Мандариновый',
        'Стас Код-волшебник', 'Стас Снеговико-повелитель',
        'Стас Подарко-раздающий', 'Стас Ёлочный', 'Стас Багфикс-герой',
        'Стас Новогодний', 'Стас Сияющий'
    ];
    // Дополнительные суффиксы для разнообразия
    const suffixes = [
        '', '', '', ' и Повелитель Мандаринов', ' — Гроза Дедлайнов',
        ' — Друг Оленей', ' — Хранитель Оливье', ' — Мастер Снежинок'
    ];

    btn.addEventListener('click', () => {
        const base = titles[Math.floor(Math.random() * titles.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        box.innerText = base + suffix;
        box.classList.remove('pop');
        void box.offsetWidth; // перезапуск анимации
        box.classList.add('pop');
        soundEngine.success();
    });
})();

// ---------- 8. ТЕСТ «КТО ТЫ ИЗ ПЕРСОНАЖЕЙ» ----------
(function initPersonaQuiz() {
    const container = document.getElementById('personaQuiz');
    const resultEl = document.getElementById('personaResult');
    if (!container || !resultEl) return;

    // Каждый ответ даёт очки одному из персонажей
    // Персонажи: ded (Дед Мороз), olen (Олень), sneg (Снеговик), elf (Эльф)
    const questions = [
        {
            q: '1. Твой идеальный новогодний вечер?',
            options: [
                { text: 'Раздавать подарки всем вокруг', type: 'ded' },
                { text: 'Носиться по сугробам', type: 'olen' },
                { text: 'Стоять на месте и улыбаться', type: 'sneg' },
                { text: 'Помогать всем и всё успевать', type: 'elf' }
            ]
        },
        {
            q: '2. Что у тебя в кармане?',
            options: [
                { text: 'Список хороших детей', type: 'ded' },
                { text: 'Морковка на перекус', type: 'olen' },
                { text: 'Пуговица (запасная)', type: 'sneg' },
                { text: 'Инструкция по сборке подарков', type: 'elf' }
            ]
        },
        {
            q: '3. Твой главный навык?',
            options: [
                { text: 'Появляться вовремя (почти)', type: 'ded' },
                { text: 'Быстро бегать', type: 'olen' },
                { text: 'Не таять при -5°C', type: 'sneg' },
                { text: 'Работать в команде', type: 'elf' }
            ]
        },
        {
            q: '4. Что тебя бесит больше всего?',
            options: [
                { text: 'Когда не верят в чудо', type: 'ded' },
                { text: 'Когда нет морковки', type: 'olen' },
                { text: 'Когда тает нос', type: 'sneg' },
                { text: 'Когда дедлайны горят', type: 'elf' }
            ]
        }
    ];

    const personas = {
        ded: {
            name: '🎅 Дед Мороз',
            desc: 'Ты — главный по подаркам и чудесам! У тебя доброе сердце, ты любишь делать приятно другим. В новом году тебя ждёт много благодарностей (и, возможно, борода).'
        },
        olen: {
            name: '🦌 Олень',
            desc: 'Ты — энергия и скорость! Ты всегда в движении, любишь приключения и не боишься сугробов. Главное — не забывай иногда останавливаться и кушать печеньки.'
        },
        sneg: {
            name: '⛄ Снеговик',
            desc: 'Ты — надёжность и спокойствие! Ты всегда на месте, всегда улыбаешься и не теряешь голову (даже когда она из снега). В новом году тебя ждёт стабильность и уют.'
        },
        elf: {
            name: '🧝 Эльф',
            desc: 'Ты — мастер на все руки! Ты помогаешь всем, успеваешь везде и всегда знаешь, что делать. В новом году тебя ждёт много классных проектов и заслуженных наград.'
        }
    };

    let scores = { ded: 0, olen: 0, sneg: 0, elf: 0 };
    let answeredCount = 0;

    questions.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('quiz-question');
        div.innerHTML = `<p>${item.q}</p>`;
        item.options.forEach((opt) => {
            const btn = document.createElement('div');
            btn.classList.add('quiz-option');
            btn.innerText = opt.text;
            btn.addEventListener('click', function() {
                if (div.dataset.answered) return;
                div.dataset.answered = 'true';
                // Помечаем выбранный
                div.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
                this.classList.add('selected');
                scores[opt.type]++;
                answeredCount++;
                soundEngine.click();

                if (answeredCount === questions.length) {
                    // Определяем победителя
                    let winner = 'ded';
                    let max = -1;
                    for (const key in scores) {
                        if (scores[key] > max) { max = scores[key]; winner = key; }
                    }
                    const p = personas[winner];
                    resultEl.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">${p.name}</div><div style="font-size: 14px; font-weight: normal; color: #ccc; line-height: 1.6;">${p.desc}</div>`;
                    soundEngine.success();
                }
            });
            div.appendChild(btn);
        });
        container.appendChild(div);
    });
})();
