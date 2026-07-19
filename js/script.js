document.addEventListener("DOMContentLoaded", () => {

    // ЕЛЕМЕНТИ БУРГЕР-МЕНЮ
    const burgerToggle = document.getElementById("burgerToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".navigation a");

    if (burgerToggle && navMenu) {
        burgerToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            burgerToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                burgerToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.classList.remove("no-scroll");
            });
        });

        document.addEventListener("click", (event) => {
            if (!navMenu.contains(event.target) && !burgerToggle.contains(event.target)) {
                burgerToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.classList.remove("no-scroll");
            }
        });
    }

    // ЕЛЕМЕНТИ СЛАЙДЕРА (КАРУСЕЛІ)
    const grid = document.getElementById("sliderGrid");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const cards = document.querySelectorAll(".grid .card");

    if (grid && prevBtn && nextBtn && cards.length > 0) {
        let currentIndex = 0;

        function updateSliderPosition() {
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 24; // Має чітко відповідати gap у CSS

            grid.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
        }

        nextBtn.addEventListener("click", () => {
            // На ПК показуємо по 3 картки (залишається зсув на 2 кроки), на мобілці по 1
            const maxIndex = cards.length - (window.innerWidth > 768 ? 3 : 1);
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // По колу на початок
            }
            updateSliderPosition();
        });

        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                const maxIndex = cards.length - (window.innerWidth > 768 ? 3 : 1);
                currentIndex = maxIndex; // Перехід в кінець
            }
            updateSliderPosition();
        });

        window.addEventListener("resize", () => {
            // Скидаємо індекс при зміні екрана, щоб уникнути багів зсуву
            currentIndex = 0;
            updateSliderPosition();
        });
    }
    // МОДАЛЬНЕ ВІКНО ПРОГРАМИ ПО ДНЯХ
    const modal = document.getElementById("programModal");
    const modalClose = document.getElementById("modalClose");
    const modalDay = document.getElementById("modalDay");
    const modalTitle = document.getElementById("modalTitle");
    const modalTimeline = document.getElementById("modalTimeline");
    const sliderCards = document.querySelectorAll(".grid .card");

    // База даних з погодинною програмою для кожного дня
    const infoTours = {
        0: {
            day: "День 1",
            title: "Старт туру & озеро Eibsee",
            timeline: [
                "<strong></strong>  Виїжджаємо з Франкфурта о 2:00 ночі (забираємо з Нюрнберга та Мюнхена)",
                "<strong></strong> Зустрічаємо світанок на озері Eibsee з кавою та перекусом на фоні найвищої вершини Німеччини — Zugspitze ☕️🏔️",
                "<strong></strong> Після цього прибуваємо до кемпінгу, встановлюємо намети та облаштовуємо наш табір. 🏕️",
                "<strong></strong> Увечері знайомимося з долиною Antholz ,влаштуємо  BBQ-вечір під відкритим небом 🔥🥩",

            ]
        },
        1: {
            day: "День 2",
            title: "Трекінг Тре Чіме ді Лаваредо",
            timeline: [
                "<strong>08:00</strong> Сніданок у готелі.",
                "<strong>09:00</strong> Виїзд до стартової точки трекінгу біля притулку Auronzo.",
                "<strong>10:00</strong> Початок панорамного маршруту навколо трьох піків (близько 10 км).",
                "<strong>13:30</strong> Обід у високогірному притулку Locatelli з видом на скелі.",
                "<strong>17:00</strong> Повернення до автобуса, відпочинок у готелі."
            ]
        },
        2: {
            day: "День 3",
            title: "Магія перевалу Пассо Джау",
            timeline: [
                "<strong>08:30</strong> Сніданок.",
                "<strong>09:30</strong> Виїзд на один із найвищих перевалів Альп.",
                "<strong>11:00</strong> Легкий підйом на оглядовий майданчик, фотосесія.",
                "<strong>14:00</strong> Пікнік на альпійських луках.",
                "<strong>18:30</strong> Зустріч заходу сонця на висоті понад 2200 метрів."
            ]
        },
        3: {
            day: "День 4",
            title: "Полонини Альпе-ді-Сьюзі",
            timeline: [
                "<strong>08:00</strong> Сніданок.",
                "<strong>09:00</strong> Переїзд до підйомника на найбільше плато Європи.",
                "<strong>10:00</strong> Прогулянка серед зелених пагорбів та дерев'яних шале.",
                "<strong>13:00</strong> Традиційний тірольський обід у місцевій колибі.",
                "<strong>16:00</strong> Вільний час для сувенірів та відпочинку."
            ]
        },
        4: {
            day: "День 5",
            title: "Скеля Сечеда та фінал туру",
            timeline: [
                "<strong>07:30</strong> Ранній сніданок та виселення з готелю.",
                "<strong>08:30</strong> Підйом канатною дорогою на гору Seceda (2500м).",
                "<strong>11:30</strong> Фінальний шедевральний трекінг вздовж обриву скелі.",
                "<strong>14:00</strong> Прощальний обід групи.",
                "<strong>15:30</strong> Трансфер в аеропорт, виліт додому."
            ]
        }
    };

    // Вішаємо клік на кожну картку слайдера
    sliderCards.forEach((card, index) => {
        card.style.cursor = "pointer"; // Робимо вказівник мишки ручкою

        card.addEventListener("click", () => {
            const data = infoTours[index];
            if (data) {
                // Заповнюємо модалку даними з нашої бази
                modalDay.textContent = data.day;
                modalTitle.textContent = data.title;

                // Очищаємо старий список і створюємо новий
                modalTimeline.innerHTML = "";
                data.timeline.forEach(item => {
                    const li = document.createElement("li");
                    li.innerHTML = item;
                    modalTimeline.appendChild(li);
                });

                // Відкриваємо вікно і блокуємо скрол сайту
                modal.classList.add("open");
                document.body.classList.add("no-scroll");
            }
        });
    });

    // Закриття при кліку на хрестик
    modalClose.addEventListener("click", () => {
        modal.classList.remove("open");
        document.body.classList.remove("no-scroll");
    });

    // Закриття при кліку на темний фон поза вікном
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("open");
            document.body.classList.remove("no-scroll");
        }
    });
});
