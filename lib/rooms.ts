/**
 * Gallery Rooms - Curatorial categories for the exhibition
 * Each room groups related writings by theme
 */

export interface Room {
  id: string
  nameHindi: string
  nameEnglish: string
  description?: string
  order: number
  /** Audio file for this room's ambient sound */
  audioSrc?: string
}

export const ROOMS: Record<string, Room> = {
  rain: {
    id: 'rain',
    nameHindi: 'बारिश',
    nameEnglish: 'Rain',
    description: 'The rain as muse — birth, memory, sensory awakening',
    order: 1,
    audioSrc: '/audio/rooms/rain.mp3',
  },
  window: {
    id: 'window',
    nameHindi: 'खिड़की से',
    nameEnglish: 'From the Window',
    description: 'Observations from stillness — life seen through a frame',
    order: 2,
    audioSrc: '/audio/rooms/window.mp3',
  },
  transit: {
    id: 'transit',
    nameHindi: 'गतिमान',
    nameEnglish: 'In Transit',
    description: 'Movement, displacement, the wandering self',
    order: 3,
    audioSrc: '/audio/rooms/transit.mp3',
  },
  books: {
    id: 'books',
    nameHindi: 'किताबें',
    nameEnglish: 'Books',
    description: 'The grief and joy of reading, finishing, searching',
    order: 4,
    audioSrc: '/audio/rooms/books.mp3',
  },
  dreams: {
    id: 'dreams',
    nameHindi: 'स्वप्न',
    nameEnglish: 'Dreams',
    description: 'The subconscious, surreal landscapes, half-asleep states',
    order: 5,
    audioSrc: '/audio/rooms/dreams.mp3',
  },
  creation: {
    id: 'creation',
    nameHindi: 'सृजन',
    nameEnglish: 'Creation',
    description: 'The urge to create, the search for the right place to write',
    order: 6,
    audioSrc: '/audio/rooms/creation.mp3',
  },
  laughter: {
    id: 'laughter',
    nameHindi: 'हँसी',
    nameEnglish: 'Laughter',
    description: 'Joy, absurdity, and the silence after',
    order: 7,
    audioSrc: '/audio/rooms/laughter.mp3',
  },
  tenderness: {
    id: 'tenderness',
    nameHindi: 'कोमलता',
    nameEnglish: 'Tenderness',
    description: 'Gentle touch, letters to no one, cosmic smallness',
    order: 8,
    audioSrc: '/audio/rooms/tenderness.mp3',
  },
  mortality: {
    id: 'mortality',
    nameHindi: 'मृत्यु',
    nameEnglish: 'Mortality',
    description: 'Death, endings, the world continuing',
    order: 9,
    audioSrc: '/audio/rooms/mortality.mp3',
  },
}

export function getRoom(roomId: string): Room | undefined {
  return ROOMS[roomId]
}

export function getAllRooms(): Room[] {
  return Object.values(ROOMS).sort((a, b) => a.order - b.order)
}

export function getRoomIds(): string[] {
  return Object.keys(ROOMS)
}

