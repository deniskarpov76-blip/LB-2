/* ============================================================
   Учебный сайт-тренажёр. Лабораторная работа № 2
   Дисциплина «Digital-маркетинг»

   ЕДИНСТВЕННОЕ, ЧТО НУЖНО ЗДЕСЬ ИЗМЕНИТЬ, — номер счётчика
   в строке ниже. Номер вы получите при создании счётчика
   в Яндекс Метрике (это число, например 12345678).
   ============================================================ */

var COUNTER_ID = 113098119;   // <-- ЗАМЕНИТЕ 0 НА НОМЕР ВАШЕГО СЧЁТЧИКА

/* ------------------------------------------------------------
   Ниже — рабочий код тренажёра. Менять его не нужно.
   ------------------------------------------------------------ */

// Отправка цели в Метрику. Если счётчик ещё не указан или не загрузился,
// функция просто напишет об этом в консоль браузера и не сломает страницу.
function sendGoal(goalId) {   // отправка цели в Метрику
  if (typeof ym === 'function' && COUNTER_ID > 0) {
    ym(COUNTER_ID, 'reachGoal', goalId);
    console.log('Цель отправлена в Метрику:', goalId);
  } else {
    console.warn(
      'Цель "' + goalId + '" НЕ отправлена. Проверьте: ' +
      '1) вставлен ли код счётчика в <head> страницы; ' +
      '2) указан ли номер счётчика в файле script.js.'
    );
  }
}

document.addEventListener('DOMContentLoaded', function () {

  // --- Клики по элементам с атрибутом data-goal ---
  document.querySelectorAll('a[data-goal], button[data-goal]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var goal = el.getAttribute('data-goal');
      sendGoal(goal);
      // Для учебной кнопки «Скачать прайс» переход никуда не ведёт
      if (el.id === 'btn-price') {
        e.preventDefault();
        alert('В учебном макете файл не скачивается.\nЦель "' + goal + '" отправлена в Метрику.');
      }
    });
  });

  // --- Отправка форм с атрибутом data-goal ---
  document.querySelectorAll('form[data-goal]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendGoal(form.getAttribute('data-goal'));
      var ok = document.getElementById('subscribe-ok');
      if (ok) { ok.style.display = 'block'; form.style.display = 'none'; }
    });
  });

  // --- Раскрывающиеся вопросы (FAQ) ---
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });

  // --- Многошаговая форма заказа (страница order.html) ---
  var steps = document.querySelectorAll('.form-step');
  var dots = document.querySelectorAll('.step-dot');
  var current = 0;

  function showStep(n) {
    steps.forEach(function (s, i) { s.classList.toggle('active', i === n); });
    dots.forEach(function (d, i) { d.classList.toggle('done', i <= n); });
    current = n;
    // Каждый шаг отправляется отдельной целью — из них собирается составная цель
    sendGoal('order_step_' + (n + 1));
  }

  if (steps.length > 0) {
    // Показываем первый шаг и сразу отправляем цель order_step_1:
    // открытие формы — это и есть начало воронки оформления заказа
    steps[0].classList.add('active');
    if (dots.length) dots[0].classList.add('done');
    sendGoal('order_step_1');

    document.querySelectorAll('[data-step-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (current < steps.length - 1) showStep(current + 1);
      });
    });
    document.querySelectorAll('[data-step-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (current > 0) {
          steps.forEach(function (s, i) { s.classList.toggle('active', i === current - 1); });
          dots.forEach(function (d, i) { d.classList.toggle('done', i <= current - 1); });
          current = current - 1;
        }
      });
    });
  }

});
