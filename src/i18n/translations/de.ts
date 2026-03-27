/**
 * Times Tables Quest - German Translations
 */

import type { TranslationKey } from './en';

export const de: Record<TranslationKey, string> = {
  // App
  'app.title': 'Einmaleins Quest',
  'app.subtitle': 'Das Abenteuer wartet!',
  'app.tagline': 'Meistere Multiplikation und Division auf deiner Heldenreise!',

  // Start screen
  'start.singlePlayer': 'Einzelspieler',
  'start.twoPlayer': 'Zwei Spieler',
  'start.practice': 'Übungsmodus',
  'start.battle': 'Kampfmodus',

  // Setup screen
  'setup.title': 'Quest Einstellungen',
  'setup.selectAvatar': 'Wähle deinen Avatar',
  'setup.selectTables': 'Wähle Einmaleins-Reihen',
  'setup.selectOperation': 'Rechenart',
  'setup.selectDifficulty': 'Schwierigkeit',
  'setup.selectAnswerMode': 'Antwortmodus',
  'setup.selectRounds': 'Runden',
  'setup.player1': 'Spieler 1',
  'setup.player2': 'Spieler 2',
  'setup.speedMode': 'Gewinnermodus',
  'setup.speedWinsOff': 'Standard',
  'setup.speedWinsOffDesc': 'Beide richtig = Unentschieden',
  'setup.speedWinsOn': 'Schnellster gewinnt',
  'setup.speedWinsOnDesc': 'Schnellste Antwort gewinnt',
  'setup.startGame': 'Quest starten!',
  'setup.back': 'Zurück',

  // Operations
  'operation.multiply': 'Multiplikation',
  'operation.divide': 'Division',
  'operation.both': 'Beides',

  // Difficulty
  'difficulty.easy': 'Leicht',
  'difficulty.medium': 'Mittel',
  'difficulty.hard': 'Schwer',
  'difficulty.easyDesc': '15 Sekunden',
  'difficulty.mediumDesc': '10 Sekunden',
  'difficulty.hardDesc': '5 Sekunden + Geschwindigkeitsbonus',

  // Answer modes
  'answerMode.choice': 'Multiple Choice',
  'answerMode.input': 'Ziffernblock',

  // Game screen
  'game.round': 'Runde',
  'game.of': 'von',
  'game.score': 'Punkte',
  'game.yourTurn': 'Du bist dran!',
  'game.getReady': 'Mach dich bereit...',
  'game.timeUp': 'Zeit abgelaufen!',
  'game.correct': 'Richtig!',
  'game.incorrect': 'Falsch',
  'game.theAnswerWas': 'Die Antwort war',
  'game.speedBonus': 'Geschwindigkeitsbonus!',
  'game.streak': 'Serie',
  'game.points': 'Punkte',
  'game.enter': 'Eingabe',
  'game.clear': 'Löschen',

  // Results screen
  'results.title': 'Quest abgeschlossen!',
  'results.winner': 'Gewinner',
  'results.tie': 'Unentschieden!',
  'results.player1Wins': 'Spieler 1 gewinnt!',
  'results.player2Wins': 'Spieler 2 gewinnt!',
  'results.finalScore': 'Endpunktzahl',
  'results.roundsWon': 'Gewonnene Runden',
  'results.accuracy': 'Genauigkeit',
  'results.playAgain': 'Nochmal spielen',
  'results.newGame': 'Neues Spiel',
  'results.greatJob': 'Gut gemacht!',
  'results.amazing': 'Fantastisch!',
  'results.perfect': 'Perfekt!',
  'results.keepPracticing': 'Weiter üben!',

  // Avatars
  'avatar.wizard': 'Zauberer',
  'avatar.knight': 'Ritter',
  'avatar.dragon': 'Drache',
  'avatar.elf': 'Elfe',
  'avatar.archer': 'Bogenschütze',
  'avatar.pirate': 'Pirat',
  'avatar.princess': 'Prinzessin',
  'avatar.fairy': 'Fee',
  'avatar.mermaid': 'Meerjungfrau',
  'avatar.unicorn': 'Einhorn',
  'avatar.ninja': 'Ninja',
  'avatar.explorer': 'Entdecker',

  // Misc
  'misc.vs': 'VS',
  'misc.loading': 'Laden...',

  // PWA / Add to Home Screen
  'pwa.title': 'Vollbild spielen!',
  'pwa.instructions': 'Tippe auf {{icon}} dann "Zum Home-Bildschirm"',
  'pwa.dismiss': 'Später',
};
