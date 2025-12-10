const DATE_PICKER_LOCALE = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dateFormat: 'dd.MM.yyyy.',
    firstDay: 1
};

const GRID_SIZE_1X1 = 0;
const GRID_SIZE_2X2 = 1;
const GRID_SIZE_4X4 = 2;

const MONTHS = {
    JANUARY:    1,
    FEBRUARY:   2,
    MARCH:      3,
    APRIL:      4,
    MAY:        5,
    JUNE:       6,
    JULY:       7,
    AUGUST:     8,
    SEPTEMBER:  9,
    OCTOBER:    10,
    NOVEMBER:   11,
    DECEMBER:   12
};

const ALPHABET = new Set([
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]);

const REPLACEABLE_LETTERS = new Map([
    ['ā', 'a'],
    ['č', 'c'],
    ['ē', 'e'],
    ['ģ', 'g'],
    ['ī', 'i'],
    ['ķ', 'k'],
    ['ļ', 'l'],
    ['ņ', 'n'],
    ['š', 's'],
    ['ū', 'u'],
    ['ž', 'z']
]);

const COLORS_OF_NUMBERS = new Map([
    [1, '#D32F2F'],
    [2, '#F57C00'],
    [3, '#FFE04A'],
    [4, '#388E3C'],
    [5, '#0288D1'],
    [6, '#3949AB'],
    [7, '#A23BBC'],
    [8, '#E8508F'],
    [9, '#D8B848']
]);
