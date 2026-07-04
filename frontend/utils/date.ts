export function formatDateToDisplay(dateString?: string | null): string | null {
  if (!dateString) return null;

  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
}

export function formatDateForInput(dateString?: string | null): string {
  if (!dateString) return '';

  return new Date(dateString).toISOString().split('T')[0];
}

export function formatDateToISO(dateString: string): string {
  return new Date(dateString).toISOString();
}