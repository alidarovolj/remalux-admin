export function formatDate(isoDate) {
    // Создаем объект Date из ISO строки
    const date = new Date(isoDate);

    // Параметры для форматирования даты
    const options = {
        month: "short", // сокращенное название месяца
        day: "numeric", // день месяца
        hour: "numeric", // час
        minute: "numeric", // минуты
        hour12: true, // формат 12-часового времени
    };

    // Используем toLocaleString для форматирования
    return date.toLocaleString("ru-RU", options);
}