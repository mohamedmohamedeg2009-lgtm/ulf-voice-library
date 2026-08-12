export function toggleFavorite(favoriteIds: readonly string[], voiceId: string): string[] {
  return favoriteIds.includes(voiceId)
    ? favoriteIds.filter((id) => id !== voiceId)
    : [...favoriteIds, voiceId];
}
