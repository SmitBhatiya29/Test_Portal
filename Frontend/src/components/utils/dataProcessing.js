/** @param {any} data */
export const processAccuracyBySubject = (data) => {
  const subjectGroups = data.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = { totalAccuracy: 0, count: 0 };
    }
    acc[record.subject].totalAccuracy += record.accuracy;
    acc[record.subject].count += 1;
    return acc;
  }, {});

  return Object.entries(subjectGroups).map(([subject, data]) => ({
    subject,
    accuracy: Math.round(data.totalAccuracy / data.count)
  }));
};

/** @param {any} data */
export const processAccuracyByDifficulty = (data) => {
  const difficultyGroups = data.reduce((acc, record) => {
    if (!acc[record.difficultyLevel]) {
      acc[record.difficultyLevel] = { totalAccuracy: 0, count: 0 };
    }
    acc[record.difficultyLevel].totalAccuracy += record.accuracy;
    acc[record.difficultyLevel].count += 1;
    return acc;
  }, {});

  return Object.entries(difficultyGroups).map(([difficulty, data]) => ({
    difficulty,
    accuracy: Math.round(data.totalAccuracy / data.count),
    value: Math.round(data.totalAccuracy / data.count)
  }));
};

/** @param {any} data */
export const processAccuracyByChapterAndDifficulty = (data) => {
  const chapterGroups = data.reduce((acc, record) => {
    if (!acc[record.chapter]) {
      acc[record.chapter] = {};
    }
    if (!acc[record.chapter][record.difficultyLevel]) {
      acc[record.chapter][record.difficultyLevel] = { totalAccuracy: 0, count: 0 };
    }
    acc[record.chapter][record.difficultyLevel].totalAccuracy += record.accuracy;
    acc[record.chapter][record.difficultyLevel].count += 1;
    return acc;
  }, {});

  return Object.entries(chapterGroups).map(([chapter, difficulties]) => {
    const result = { chapter };
    Object.entries(difficulties).forEach(([difficulty, data]) => {
      result[difficulty] = Math.round(data.totalAccuracy / data.count);
    });
    return result;
  });
};

/** @param {any} data */
export const processQuestionsByChapter = (data) => {
  const chapterGroups = data.reduce((acc, record) => {
    if (!acc[record.chapter]) {
      acc[record.chapter] = { attempted: 0, correct: 0 };
    }
    acc[record.chapter].attempted += record.questionsAttempted;
    acc[record.chapter].correct += record.questionsCorrect;
    return acc;
  }, {});

  return Object.entries(chapterGroups).map(([chapter, data]) => ({
    chapter,
    attempted: data.attempted,
    correct: data.correct
  }));
};

/** @param {any} data */
export const processTimeByChapter = (data) => {
  const chapterGroups = data.reduce((acc, record) => {
    if (!acc[record.chapter]) {
      acc[record.chapter] = { totalTime: 0, count: 0 };
    }
    acc[record.chapter].totalTime += record.averageTimePerQuestion;
    acc[record.chapter].count += 1;
    return acc;
  }, {});

  return Object.entries(chapterGroups).map(([chapter, data]) => ({
    chapter,
    averageTime: Math.round(data.totalTime / data.count)
  }));
};