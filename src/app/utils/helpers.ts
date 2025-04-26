export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd')           // Replace đ/Đ with d
    .replace(/[^a-z0-9\s-]/g, '')    // Remove invalid chars
    .replace(/\s+/g, '-')            // Replace spaces with -
    .replace(/-+/g, '-')             // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start
    .replace(/-+$/, '');             // Trim - from end
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}