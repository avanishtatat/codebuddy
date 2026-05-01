export const getDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date(); 
  // Normalize to start of the day in local timezone for consistent comparison
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
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