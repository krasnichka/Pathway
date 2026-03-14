// Веса для разных критериев
const WEIGHTS = {
  examScores: 0.40,        // 40% - баллы ЕГЭ
  favoriteSubjects: 0.25,  // 25% - любимые предметы
  careerInterests: 0.20,   // 20% - карьерные интересы
  hobbies: 0.10,           // 10% - хобби
  achievements: 0.05,      // 5% - достижения
};

// Соответствие предметов направлениям
const SUBJECT_TO_CATEGORIES = {
  'Математика': ['IT', 'Инженерия', 'Экономика', 'Наука'],
  'Информатика': ['IT'],
  'Физика': ['Инженерия', 'Наука', 'IT'],
  'Химия': ['Медицина', 'Биотехнологии', 'Наука'],
  'Биология': ['Медицина', 'Биотехнологии', 'Психология'],
  'Обществознание': ['Экономика', 'Юриспруденция', 'Психология', 'Медиа'],
  'История': ['Юриспруденция', 'Гуманитарные', 'Международные'],
  'Литература': ['Гуманитарные', 'Медиа', 'Дизайн'],
  'Иностранный язык': ['Международные', 'Медиа', 'Гуманитарные'],
};

// Соответствие хобби категориям
const HOBBY_TO_CATEGORIES = {
  'Программирование': ['IT'],
  'Веб-разработка': ['IT'],
  'Создание игр': ['IT'],
  'Дизайн и графика': ['Дизайн', 'IT'],
  'Видеомонтаж': ['Медиа', 'Дизайн'],
  'Фотография': ['Дизайн', 'Медиа'],
  'Написание текстов/стихов': ['Медиа', 'Гуманитарные'],
  'Изучение иностранных языков': ['Международные', 'Гуманитарные'],
  'Спорт (командный)': ['Спорт'],
  'Спорт (индивидуальный)': ['Спорт'],
  'Музыка (игра на инструменте)': ['Дизайн', 'Гуманитарные'],
  'Рисование': ['Дизайн'],
  'Научные эксперименты': ['Наука', 'Биотехнологии'],
  'Робототехника': ['IT', 'Инженерия'],
  '3D-моделирование': ['IT', 'Инженерия', 'Дизайн'],
  'Социальные проекты': ['Психология', 'Международные'],
  'Изучение истории': ['Юриспруденция', 'Гуманитарные', 'Международные'],
  'Астрономия': ['Наука'],
  'Биология/природа': ['Медицина', 'Биотехнологии', 'Наука'],
  'Волонтёрство': ['Медицина', 'Психология', 'Международные'],
  'Кулинария': ['Дизайн'],
};

// Соответствие интересов категориям
const INTEREST_TO_CATEGORIES = {
  'IT и программирование': ['IT'],
  'Веб-разработка': ['IT'],
  'Мобильная разработка': ['IT'],
  'Искусственный интеллект': ['IT'],
  'Кибербезопасность': ['IT'],
  'Анализ данных': ['IT', 'Экономика'],
  'Медицина': ['Медицина'],
  'Инженерия': ['Инженерия'],
  'Архитектура и строительство': ['Инженерия'],
  'Дизайн и искусство': ['Дизайн'],
  'Журналистика и медиа': ['Медиа'],
  'Психология': ['Психология'],
  'Педагогика': ['Гуманитарные'],
  'Экономика и финансы': ['Экономика'],
  'Менеджмент и бизнес': ['Экономика'],
  'Маркетинг и реклама': ['Экономика', 'Медиа'],
  'Юриспруденция': ['Юриспруденция'],
  'Политология': ['Международные', 'Юриспруденция'],
  'Биотехнологии': ['Биотехнологии', 'Наука'],
  'Экология': ['Наука'],
  'Фармацевтика': ['Медицина'],
  'Спорт и фитнес': ['Спорт'],
  'Туризм и гостиничный бизнес': ['Экономика'],
  'Лингвистика и перевод': ['Гуманитарные', 'Международные'],
  'Кино и телевидение': ['Медиа'],
  'Музыка': ['Дизайн', 'Гуманитарные'],
  'Фотография': ['Дизайн', 'Медиа'],
  'Игровая индустрия': ['IT', 'Дизайн'],
  'Космонавтика': ['Наука', 'Инженерия'],
};

// Достижения и их бонусы
const ACHIEVEMENT_BONUSES = {
  'Победитель олимпиады (всероссийский этап)': 20,
  'Призёр олимпиады (всероссийский этап)': 15,
  'Победитель олимпиады (региональный этап)': 12,
  'Призёр олимпиады (региональный этап)': 10,
  'Победитель олимпиады (муниципальный этап)': 8,
  'Призёр олимпиады (муниципальный этап)': 6,
  'Победитель олимпиады (школьный этап)': 4,
  'Призёр олимпиады (школьный этап)': 3,
  'Победитель научной конференции': 6,
  'Участник научной конференции': 3,
  'Победитель хакатона/конкурса проектов': 8,
  'Участник хакатона/конкурса проектов': 4,
  'Собственные проекты (сайт, приложение и др.)': 5,
  'Сертификаты о прохождении курсов': 3,
  'Волонтёрская деятельность': 3,
  'Спортивные достижения': 4,
  'Творческие конкурсы и фестивали': 4,
  'Публикации в СМИ/научных журналах': 6,
};

/**
 * Рассчитывает соответствие баллов ЕГЭ требованиям направления
 */
function calculateExamScoreMatch(userExamScores, directionMinScores) {
  let totalMatch = 0;
  let subjectCount = 0;
  let allRequirementsMet = true;

  for (const [subject, minScore] of Object.entries(directionMinScores)) {
    const userScore = userExamScores[subject] || 0;
    subjectCount++;

    if (userScore < minScore) {
      allRequirementsMet = false;
      // Даже если не проходит, считаем насколько близок
      totalMatch += Math.max(0, (userScore / minScore));
    } else {
      // Если проходит, считаем соответствие (максимум 1.0 = 100%)
      const ratio = userScore / minScore;
      totalMatch += Math.min(ratio, 1.0); // Ограничиваем 100%
    }
  }

  const baseScore = totalMatch / subjectCount;
  
  // Если не проходит по минимальным баллам, сильно снижаем оценку
  return allRequirementsMet ? baseScore : baseScore * 0.3;
}

/**
 * Рассчитывает соответствие любимых предметов направлению
 */
function calculateSubjectPreferenceMatch(favoriteSubjects, directionMinScores) {
  if (!favoriteSubjects || favoriteSubjects.length === 0) return 0.5;

  const requiredSubjects = Object.keys(directionMinScores);
  let matchScore = 0;
  let matchedCount = 0;

  for (const subject of favoriteSubjects) {
    if (requiredSubjects.includes(subject.name)) {
      // Учитываем оценку пользователя
      const gradeWeight = parseInt(subject.grade) / 5; // 5 = 1.0, 4 = 0.8, и т.д.
      matchScore += gradeWeight;
      matchedCount++;
    }
  }

  return matchedCount > 0 ? matchScore / matchedCount : 0.2;
}

/**
 * Рассчитывает соответствие карьерных интересов
 */
function calculateCareerInterestMatch(careerInterests, directionCategory) {
  if (!careerInterests || careerInterests.length === 0) return 0.3;

  const relevantCategories = new Set();
  
  for (const interest of careerInterests) {
    const categories = INTEREST_TO_CATEGORIES[interest] || [];
    categories.forEach(cat => relevantCategories.add(cat));
  }

  if (relevantCategories.has(directionCategory)) {
    // Проверяем точное совпадение
    const exactMatch = careerInterests.some(interest => {
      const cats = INTEREST_TO_CATEGORIES[interest] || [];
      return cats.includes(directionCategory);
    });
    return exactMatch ? 1.0 : 0.7;
  }

  return 0.2;
}

/**
 * Рассчитывает релевантность хобби
 */
function calculateHobbyMatch(hobbies, directionCategory) {
  if (!hobbies || hobbies.length === 0) return 0.3;

  const relevantHobbies = hobbies.filter(hobby => {
    const categories = HOBBY_TO_CATEGORIES[hobby] || [];
    return categories.includes(directionCategory);
  });

  if (relevantHobbies.length === 0) return 0.2;
  
  // Чем больше релевантных хобби, тем выше оценка
  return Math.min(0.5 + (relevantHobbies.length * 0.15), 1.0);
}

/**
 * Рассчитывает бонус за достижения
 */
function calculateAchievementBonus(achievements) {
  if (!achievements || achievements.length === 0) return 0;

  let totalBonus = 0;
  for (const achievement of achievements) {
    totalBonus += ACHIEVEMENT_BONUSES[achievement] || 0;
  }

  // Нормализуем (максимум 20 баллов = 1.0)
  return Math.min(totalBonus / 20, 1.0);
}

/**
 * Определяет, подходит ли направление по классу
 */
function isGradeAppropriate(userGrade, directionDuration) {
  if (!userGrade) return true;
  
  const gradeNum = parseInt(userGrade);
  // Если 9 класс или ниже, не рекомендуем направления 5-6 лет (специалитет)
  if (gradeNum <= 9 && directionDuration.includes('5') || directionDuration.includes('6')) {
    return false;
  }
  
  return true;
}

/**
 * Основная функция рекомендации
 */
export function calculateRecommendations(userData, universities) {
  if (!userData) return [];

  const {
    grade,
    examScores = {},
    favoriteSubjects = [],
    achievements = [],
    hobbies = [],
    careerInterests = [],
  } = userData;

  const recommendations = [];

  for (const university of universities) {
    for (const direction of university.directions) {
      // Проверяем соответствие по классу
      if (!isGradeAppropriate(grade, direction.duration)) {
        continue;
      }

      // Рассчитываем каждый критерий
      const examMatch = calculateExamScoreMatch(examScores, direction.minScores);
      const subjectMatch = calculateSubjectPreferenceMatch(favoriteSubjects, direction.minScores);
      const interestMatch = calculateCareerInterestMatch(careerInterests, direction.category);
      const hobbyMatch = calculateHobbyMatch(hobbies, direction.category);
      const achievementBonus = calculateAchievementBonus(achievements);

      // Итоговый score
      const totalScore = 
        examMatch * WEIGHTS.examScores +
        subjectMatch * WEIGHTS.favoriteSubjects +
        interestMatch * WEIGHTS.carrierInterests +
        hobbyMatch * WEIGHTS.hobbies +
        achievementBonus * WEIGHTS.achievements;

      // Определяем шанс поступления
      const admissionChance = calculateAdmissionChance(examScores, direction.minScores, university.rating);

      recommendations.push({
        university,
        direction,
        score: Math.round(totalScore * 100),
        admissionChance,
        details: {
          examMatch: Math.round(examMatch * 100),
          subjectMatch: Math.round(subjectMatch * 100),
          interestMatch: Math.round(interestMatch * 100),
          hobbyMatch: Math.round(hobbyMatch * 100),
          achievementBonus: Math.round(achievementBonus * 100),
        },
      });
    }
  }

  // Сортируем по score (убывание)
  return recommendations.sort((a, b) => b.score - a.score);
}

/**
 * Рассчитывает шанс поступления
 */
function calculateAdmissionChance(userScores, minScores, universityRating) {
  let avgSurplus = 0;
  let count = 0;

  for (const [subject, minScore] of Object.entries(minScores)) {
    const userScore = userScores[subject] || 0;
    if (userScore >= minScore) {
      avgSurplus += (userScore - minScore);
      count++;
    } else {
      return 'low'; // Если не проходит по баллам
    }
  }

  if (count === 0) return 'low';

  const avgSurplusPerSubject = avgSurplus / count;
  
  // Учитываем рейтинг вуза
  const ratingFactor = universityRating / 100;
  const adjustedSurplus = avgSurplusPerSubject * (1 + ratingFactor * 0.5);

  if (adjustedSurplus >= 15) return 'very-high';
  if (adjustedSurplus >= 10) return 'high';
  if (adjustedSurplus >= 5) return 'medium';
  if (adjustedSurplus >= 0) return 'low-medium';
  return 'low';
}

/**
 * Получает текст для шанса поступления
 */
export function getAdmissionChanceText(chance) {
  const texts = {
    'very-high': { text: 'Очень высокий', color: 'success', emoji: '🟢' },
    'high': { text: 'Высокий', color: 'success', emoji: '🟢' },
    'medium': { text: 'Средний', color: 'warning', emoji: '🟡' },
    'low-medium': { text: 'Ниже среднего', color: 'warning', emoji: '🟠' },
    'low': { text: 'Низкий', color: 'error', emoji: '🔴' },
  };
  
  return texts[chance] || texts['low'];
}

export default calculateRecommendations;