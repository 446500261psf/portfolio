import 'chat_models.dart';

/// Scripted Plan Coach demo: lose 3 kg in 15 days.
class WeightLoss15DayScript {
  static const goalChip = 'Lose 3 kg in 15 days';
  static const goalChipZh = '15天减重3公斤';

  static const chips = <String>[
    goalChip,
    goalChipZh,
    'High-intensity training plan',
    "I'm a serious runner",
    'I want to lose fat',
  ];

  /// After the Nth user message (1-based), return the coach beat.
  static ScriptBeat beatForUserTurn(int userTurnIndex, String userText) {
    final t = userText.toLowerCase();
    if (userTurnIndex <= 1) return _goal;
    if (userTurnIndex == 2) {
      if (t.contains('easier') || t.contains('轻松')) return _easier;
      return _constraints;
    }
    if (t.contains('day b') || t.contains('show day b')) return _dayB;
    return _expand;
  }

  static const _goal = ScriptBeat(
    assistantFull:
        'Got it — lose 3 kg in 15 days.\n'
        'That’s aggressive (~0.2 kg/day). I can draft a tight plan, '
        'but I need two constraints first:\n'
        '1) How many days/week can you train?\n'
        '2) Gym or home only?',
    followUps: [
      '3 days / week · Home only',
      'Gym OK · 4 days',
      'Knees sensitive',
    ],
  );

  static const _constraints = ScriptBeat(
    assistantFull:
        'Locked: 3 days/week · home · −3 kg / 15 days.\n\n'
        'Week structure\n'
        '• Day A — Full-body strength 35–40 min\n'
        '• Day B — Zone-2 cardio 30 min + core\n'
        '• Day C — Strength + finishers 40 min\n\n'
        'Daily non-negotiables\n'
        '• Protein ~1.6 g/kg · ~500 kcal deficit\n'
        '• 7k–9k steps · sleep 7h+\n\n'
        'Want me to expand Day A into a set-by-set workout?',
    followUps: [
      'Expand Day A',
      'Make it easier',
      'Looks good',
    ],
  );

  static const _easier = ScriptBeat(
    assistantFull:
        'Softer version: still −3 kg / 15 days, but volume −20%.\n'
        '• Shorter finishers · deficit closer to 400 kcal\n'
        '• Add one full rest day if sleep <6.5h\n\n'
        'Say “Expand Day A” when you want the detailed session.',
    followUps: ['Expand Day A', 'Keep original plan'],
  );

  static const _expand = ScriptBeat(
    assistantFull:
        'Day A — Home full-body (≈40 min)\n'
        '1. Goblet squat 4×8\n'
        '2. Push-up or knee push-up 3×10\n'
        '3. Hip hinge (backpack RDL) 3×10\n'
        '4. Reverse lunge 3×8/leg\n'
        '5. Plank 3×40s\n\n'
        'Rest 60–90s. If any set feels >8/10 hard, drop one set tomorrow.',
    followUps: [
      'Show Day B',
      'Start tomorrow plan',
    ],
  );

  static const _dayB = ScriptBeat(
    assistantFull:
        'Day B — Zone-2 + core (≈30 min)\n'
        '• Brisk walk / easy bike 25 min (talk pace)\n'
        '• Dead bug 3×8/side\n'
        '• Side plank 2×30s/side\n\n'
        'Keep heart rate conversational. Tomorrow is Day C.',
    followUps: ['Start tomorrow plan'],
  );
}
