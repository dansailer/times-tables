/**
 * Times Tables Quest - English Translations
 */

export const en = {
  // App
  'app.title': 'Times Tables Quest',
  'app.subtitle': 'Adventure Awaits!',
  'app.tagline': 'Master multiplication and division on your quest for glory!',

  // Start screen
  'start.singlePlayer': 'Single Player',
  'start.twoPlayer': 'Two Players',
  'start.howToPlay': 'How to Play',
  'start.howToPlay1': 'Choose times tables to practice (2-11)',
  'start.howToPlay2': 'Answer multiplication or division questions',
  'start.howToPlay3': 'Beat the clock and build your streak!',
  'start.twoPlayerHint': 'Two players take turns on the same device',

  // Setup screen
  'setup.title': 'Quest Setup',
  'setup.selectAvatar': 'Choose Your Avatar',
  'setup.selectTables': 'Select Times Tables',
  'setup.selectOperation': 'Operation',
  'setup.selectDifficulty': 'Difficulty',
  'setup.selectAnswerMode': 'Answer Mode',
  'setup.selectRounds': 'Rounds',
  'setup.player1': 'Player 1',
  'setup.player2': 'Player 2',
  'setup.speedMode': 'Winner Mode',
  'setup.speedWinsOff': 'Standard',
  'setup.speedWinsOffDesc': 'Both correct = Tie',
  'setup.speedWinsOn': 'Speed Wins',
  'setup.speedWinsOnDesc': 'Fastest answer wins',
  'setup.celebrations': 'Celebrations',
  'setup.celebrationsOn': 'On',
  'setup.celebrationsOnDesc': 'Confetti, messages & effects',
  'setup.celebrationsOff': 'Off',
  'setup.celebrationsOffDesc': 'Minimal feedback',
  'setup.startGame': 'Start Quest!',
  'setup.back': 'Back',

  // Operations
  'operation.multiply': 'Multiplication',
  'operation.divide': 'Division',
  'operation.both': 'Both',

  // Difficulty
  'difficulty.easy': 'Easy',
  'difficulty.medium': 'Medium',
  'difficulty.hard': 'Hard',
  'difficulty.easyDesc': '15 seconds',
  'difficulty.mediumDesc': '10 seconds',
  'difficulty.hardDesc': '5 seconds + Speed Bonus',

  // Answer modes
  'answerMode.choice': 'Multiple Choice',
  'answerMode.input': 'Number Pad',

  // Game screen
  'game.round': 'Round',
  'game.of': 'of',
  'game.yourTurn': 'Your Turn!',
  'game.getReady': 'Get Ready...',
  'game.timeUp': "Time's Up!",
  'game.correct': 'Correct!',
  'game.incorrect': 'Incorrect',
  'game.theAnswerWas': 'The answer was',
  'game.points': 'points',
  'game.enter': 'Enter',
  'game.clear': 'Clear',

  // Results screen
  'results.title': 'Quest Complete!',
  'results.winner': 'Winner',
  'results.tie': "It's a Tie!",
  'results.finalScore': 'Final Score',
  'results.roundsWon': 'Rounds Won',
  'results.accuracy': 'Accuracy',
  'results.playAgain': 'Play Again',
  'results.newGame': 'New Game',
  'results.greatJob': 'Great Job!',
  'results.amazing': 'Amazing!',
  'results.perfect': 'Perfect!',
  'results.keepPracticing': 'Keep Practicing!',

  // Avatars
  'avatar.wizard': 'Wizard',
  'avatar.knight': 'Knight',
  'avatar.dragon': 'Dragon',
  'avatar.elf': 'Elf',
  'avatar.archer': 'Archer',
  'avatar.pirate': 'Pirate',
  'avatar.princess': 'Princess',
  'avatar.fairy': 'Fairy',
  'avatar.mermaid': 'Mermaid',
  'avatar.unicorn': 'Unicorn',
  'avatar.ninja': 'Ninja',
  'avatar.cat': 'Cat',

  // Celebrations & Encouragement
  'celebration.correct1': 'Awesome!',
  'celebration.correct2': 'Great job!',
  'celebration.correct3': 'Amazing!',
  'celebration.correct4': 'Fantastic!',
  'celebration.correct5': 'Brilliant!',
  'celebration.correct6': 'Super!',
  'celebration.correct7': 'Wonderful!',
  'celebration.correct8': 'Excellent!',
  'celebration.streak3': 'On fire!',
  'celebration.streak5': 'Unstoppable!',
  'celebration.streak10': 'LEGENDARY!',
  'celebration.fast': 'Lightning fast!',

  // PWA / Add to Home Screen
  'pwa.title': 'Play Fullscreen!',
  'pwa.instructions': 'Tap {{icon}} then "Add to Home Screen"',
  'pwa.dismiss': 'Maybe Later',
} as const;

export type TranslationKey = keyof typeof en;
