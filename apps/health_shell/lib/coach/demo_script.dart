import 'chat_models.dart';

/// Scripted Plan Coach demo: lose 3 kg in 15 days.
class WeightLoss15DayScript {
  static const goalChip = 'Lose 3 kg in 15 days';

  static const confirmChip = 'Yes, generate my plan';

  static const chips = <String>[
    goalChip,
    'High-intensity training plan',
    "I'm a serious runner",
    'I want to lose fat',
  ];

  static const confirmChips = <String>[
    confirmChip,
    'Looks good — generate it',
    'Make it easier first',
  ];

  static const planThinkingLines = <String>[
    'Considering your weekly training days…',
    'Arranging the right training sessions…',
    'Balancing strength and cardio…',
    'Creating reward stickers…',
    'Locking your 15-day plan framework…',
  ];

  /// Closing line shown under the weekly plan cards.
  static const planReadyMessage =
      'I’ve added your generated plan to the Today page. '
      'I’ll adjust it anytime based on your status. Let’s get started!';

  /// User confirmed they want the full plan generated.
  static bool isPlanConfirm(String userText) {
    final t = userText.toLowerCase().trim();
    if (t.contains('generate my plan')) return true;
    if (t.contains('generate it')) return true;
    if (t == 'yes' || t.startsWith('yes,')) return true;
    if (t.contains('looks good') && t.contains('generate')) return true;
    if (t == confirmChip.toLowerCase()) return true;
    return false;
  }

  /// After the Nth user message (1-based), return the coach beat.
  static ScriptBeat beatForUserTurn(int userTurnIndex, String userText) {
    final t = userText.toLowerCase();
    if (userTurnIndex <= 1) return _goal;
    if (t.contains('easier')) return _easier;
    if (userTurnIndex == 2) return _framework;
    return _framework;
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

  /// End-of-chat framework — user must confirm before full plan cards.
  static const _framework = ScriptBeat(
    assistantFull:
        'Here’s a rough framework for −3 kg / 15 days · 3×/week · home:\n\n'
        'Week shape\n'
        '• Day A — Full-body strength 35–40 min\n'
        '• Day B — Zone-2 cardio 30 min + core\n'
        '• Day C — Strength + finishers 40 min\n\n'
        'Daily non-negotiables\n'
        '• Protein ~1.6 g/kg · ~500 kcal deficit\n'
        '• 7k–9k steps · sleep 7h+\n\n'
        'This is only the skeleton. Confirm and I’ll generate '
        'your weekly plan cards.',
    followUps: confirmChips,
  );

  static const _easier = ScriptBeat(
    assistantFull:
        'Softer framework: still −3 kg / 15 days, but volume −20%.\n'
        '• Shorter finishers · deficit closer to 400 kcal\n'
        '• Add one full rest day if sleep <6.5h\n\n'
        'Confirm when you want me to generate the weekly cards.',
    followUps: confirmChips,
  );

  static const weeks = <WeekPlan>[
    WeekPlan(
      id: 'w1',
      title: 'Week 1',
      dayRange: 'Days 1–7',
      summary: 'Build the habit · 3 home sessions',
      sessions: 3,
      days: [
        DayPlan(
          label: 'Day 1 · Mon',
          focus: 'Day A — Full-body strength',
          duration: '35–40 min',
          moves: [
            'Goblet squat 4×8',
            'Push-up / knee push-up 3×10',
            'Backpack RDL 3×10',
            'Reverse lunge 3×8/leg',
            'Plank 3×40s',
          ],
          note: 'Rest 60–90s. Keep effort ≤8/10.',
        ),
        DayPlan(
          label: 'Day 3 · Wed',
          focus: 'Day B — Zone-2 + core',
          duration: '≈30 min',
          moves: [
            'Brisk walk / easy bike 25 min',
            'Dead bug 3×8/side',
            'Side plank 2×30s/side',
          ],
          note: 'Talk-pace heart rate only.',
        ),
        DayPlan(
          label: 'Day 5 · Fri',
          focus: 'Day C — Strength + finishers',
          duration: '≈40 min',
          moves: [
            'Split squat 3×8/leg',
            'Pike push-up 3×8',
            'Hip thrust 3×12',
            'Farmer carry 3×40s',
            'Finisher: mountain climber 2×30s',
          ],
        ),
      ],
    ),
    WeekPlan(
      id: 'w2',
      title: 'Week 2',
      dayRange: 'Days 8–14',
      summary: 'Add density · keep recovery honest',
      sessions: 3,
      days: [
        DayPlan(
          label: 'Day 8 · Mon',
          focus: 'Day A — Strength (progress)',
          duration: '40 min',
          moves: [
            'Goblet squat 4×10',
            'Push-up 3×12',
            'Backpack RDL 3×12',
            'Reverse lunge 3×10/leg',
            'Plank 3×45s',
          ],
        ),
        DayPlan(
          label: 'Day 10 · Wed',
          focus: 'Day B — Zone-2 + core',
          duration: '35 min',
          moves: [
            'Brisk walk / bike 28 min',
            'Dead bug 3×10/side',
            'Bird dog 3×8/side',
          ],
        ),
        DayPlan(
          label: 'Day 12 · Fri',
          focus: 'Day C — Strength + finishers',
          duration: '40 min',
          moves: [
            'Split squat 3×10/leg',
            'Pike push-up 3×10',
            'Hip thrust 3×12',
            'Finisher: jump rope or high knees 3×40s',
          ],
          note: 'If sleep <6.5h, drop the finisher.',
        ),
      ],
    ),
    WeekPlan(
      id: 'w3',
      title: 'Week 3',
      dayRange: 'Day 15',
      summary: 'Lock-in day · measure & reward',
      sessions: 1,
      days: [
        DayPlan(
          label: 'Day 15',
          focus: 'Check-in + light Day A',
          duration: '30 min',
          moves: [
            'Weigh-in & waist note',
            'Goblet squat 3×8',
            'Push-up 2×10',
            'Easy walk 15 min',
          ],
          note: 'Claim your reward sticker — you finished the block.',
        ),
      ],
    ),
  ];
}
