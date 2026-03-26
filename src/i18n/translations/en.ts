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
  'start.practice': 'Practice Mode',
  'start.battle': 'Battle Mode',

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
  'setup.startGame': 'Start Quest!',
  'setup.back': 'Back',

  // Operations
  'operation.multiply': 'Multiplication',
  'operation.divide': 'Division',

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
  'game.score': 'Score',
  'game.yourTurn': 'Your Turn!',
  'game.getReady': 'Get Ready...',
  'game.timeUp': "Time's Up!",
  'game.correct': 'Correct!',
  'game.incorrect': 'Incorrect',
  'game.theAnswerWas': 'The answer was',
  'game.speedBonus': 'Speed Bonus!',
  'game.streak': 'Streak',
  'game.points': 'points',
  'game.enter': 'Enter',
  'game.clear': 'Clear',

  // Results screen
  'results.title': 'Quest Complete!',
  'results.winner': 'Winner',
  'results.tie': "It's a Tie!",
  'results.player1Wins': 'Player 1 Wins!',
  'results.player2Wins': 'Player 2 Wins!',
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
  'avatar.explorer': 'Explorer',

  // Misc
  'misc.vs': 'VS',
  'misc.loading': 'Loading...',

  // PWA / Add to Home Screen
  'pwa.title': 'Play Fullscreen!',
  'pwa.instructions': 'Tap {{icon}} then "Add to Home Screen"',
  'pwa.dismiss': 'Maybe Later',
} as const;

export type TranslationKey = keyof typeof en;
