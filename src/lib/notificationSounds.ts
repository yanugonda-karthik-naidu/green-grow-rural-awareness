// Base64 encoded short notification sounds
export const NOTIFICATION_SOUNDS = {
  chime: {
    name: 'Chime',
    description: 'Soft, pleasant chime',
    // Short chime sound
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleW0pUaDC3buZYCwrZZ694LqQV0VZm77jt5BAMESQu+bQqXo3UY2z6c6idEpblq7nxph1U2qls+O6l3ZgdKiv4rWUe3x7p63fs4+EiYWYq97AkIF/h5eo3K+Ogop8lKfSx56FfHyPps/NqI9zdXmSpsm7m5N0Z3GPoMm1l5d7aWeNnb+0nJZ8a2aQnLy1lpd8bmiPnL21lpZ6a2eQnLy1lpZ8bmiPnLy1lpd8bmeQnLy0lpd9bmeQnLy1lpd9bmiQnLy1lpd9bmiQnL21lpd9bmiQnLy1lpd9bmiQnL21lph9bmiQnLy1l5h9bmiQnLy1l5h9bmiQnLy1',
  },
  bell: {
    name: 'Bell',
    description: 'Classic notification bell',
    url: 'data:audio/wav;base64,UklGRloBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTYBAABwgH5+fn5+f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/',
  },
  pop: {
    name: 'Pop',
    description: 'Quick pop sound',
    url: 'data:audio/wav;base64,UklGRpQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAAAAB/gH9/f4CAgH9/f4CAf39/gIB/f3+AgH9/f4CAf39/gIB/f3+AgH9/f4CAf39/gIB/f3+AgH9/f4CAf39/gIB/f3+AgH9/f4CAf39/gIB/f3+AgH9/f4CAf39/gIB/f3+AgH9/f4CAf39/',
  },
  drop: {
    name: 'Water Drop',
    description: 'Gentle water drop',
    url: 'data:audio/wav;base64,UklGRpQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAAAACAgIB/f39+fn9/gICAgH9/f35+f39/gICAgH9/f35+fn9/gICAgH9/f35+fn9/gICAgH9/f35+fn9/gICAgH9/f35+fn9/gICAgH9/f35+fn9/gICAgH9/f35+fn9/gICAgH9/f35+fn9/',
  },
  ding: {
    name: 'Ding',
    description: 'Clear ding tone',
    url: 'data:audio/wav;base64,UklGRpQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAAAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teobm0pUaDC3buZYCwrZZ694LqQV0VZm77jt5BAMESQu+bQqXo3UY2z6c6idEpblq7nxph1U2qls+O6l3ZgdKiv4rWUe3x7p63fs4+E',
  },
  nature: {
    name: 'Nature',
    description: 'Forest-themed sound',
    url: 'data:audio/wav;base64,UklGRpQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAAAABwgH5+fn5+f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/fn5+f39/gICAgH9/f35+fn9/f4CAgIB/f39+fn5/f3+AgICAf39/',
  },
} as const;

export type SoundType = keyof typeof NOTIFICATION_SOUNDS;

export const playNotificationSound = (soundType: SoundType, volume: number = 0.5) => {
  const sound = NOTIFICATION_SOUNDS[soundType];
  if (!sound) return;

  try {
    const audio = new Audio(sound.url);
    audio.volume = volume;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};
