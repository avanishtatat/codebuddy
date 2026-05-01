export const getDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date(); 
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const groupedByDates = (pairs) => {
    const grouped = {};
    pairs.forEach((pair) => {
      const date = getDateLabel(pair.askedAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push({question: pair.question, answer: pair.answer, createdAt: pair.askedAt});
    });
    return grouped;
}