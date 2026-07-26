import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../coach/ai_plan_coach_meet.dart';
import '../theme/tokens.dart';
import '../widgets/ds_card.dart';
import '../widgets/screen_header.dart';

class TodayScreen extends StatelessWidget {
  const TodayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 24),
      children: [
        ScreenHeader(
          title: 'Good morning',
          subtitle: 'Today · Sun, Jul 26',
          onAvatarTap: () => _snack(context, 'Profile modal (Free / Premium)'),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: DsCard(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const AiPlanCoachMeetPage(),
                ),
              );
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      '✦  Plan Coach',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: DsTokens.accent,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      'Open Meet →',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: DsTokens.accent,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Simulate AiPlanCoach Meet motions\n(intro · keyboard · chip → light sweep)',
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textPrimary,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: DsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "TODAY'S PLAN",
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.8,
                    color: DsTokens.textTertiary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Close the gap from where you are to today’s targets.',
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textSecondary,
                  ),
                ),
                const SizedBox(height: 14),
                const _GapRow(
                  label: 'Cardio',
                  current: '12',
                  goal: '30 min',
                  remain: '18 min left',
                ),
                const SizedBox(height: 10),
                const _GapRow(
                  label: 'Nutrition',
                  current: '1,580',
                  goal: '2,000 kcal',
                  remain: '420 kcal room',
                ),
                const SizedBox(height: 10),
                const _GapRow(
                  label: 'Sleep',
                  current: '82',
                  goal: '80+',
                  remain: 'On track',
                  remainColor: DsTokens.success,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: DsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Week focus',
                  style: GoogleFonts.nunito(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '−5 kg · Week 3 of 7',
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textSecondary,
                  ),
                ),
                const SizedBox(height: 14),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: const LinearProgressIndicator(
                    value: 3 / 7,
                    minHeight: 8,
                    backgroundColor: Color(0xFFE8EEF7),
                    color: DsTokens.accent,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Stay consistent on cardio gaps this week.',
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Expanded(
                child: _P0Tile(
                  title: 'Diet gap',
                  value: '420',
                  unit: 'kcal',
                  tint: Color(0xFFFFF4E8),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: _P0Tile(
                  title: 'Sleep',
                  value: '82',
                  unit: 'score',
                  tint: Color(0xFFF3E8FF),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _snack(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }
}

class _GapRow extends StatelessWidget {
  const _GapRow({
    required this.label,
    required this.current,
    required this.goal,
    required this.remain,
    this.remainColor = DsTokens.accent,
  });

  final String label;
  final String current;
  final String goal;
  final String remain;
  final Color remainColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        SizedBox(
          width: 78,
          child: Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: DsTokens.textSecondary,
            ),
          ),
        ),
        Expanded(
          child: Text(
            '$current → $goal',
            style: GoogleFonts.nunito(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: DsTokens.textPrimary,
            ),
          ),
        ),
        Text(
          remain,
          style: GoogleFonts.nunito(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: remainColor,
          ),
        ),
      ],
    );
  }
}

class _P0Tile extends StatelessWidget {
  const _P0Tile({
    required this.title,
    required this.value,
    required this.unit,
    required this.tint,
  });

  final String title;
  final String value;
  final String unit;
  final Color tint;

  @override
  Widget build(BuildContext context) {
    return DsCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: tint,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              title,
              style: GoogleFonts.nunito(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: DsTokens.textSecondary,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: GoogleFonts.nunito(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              height: 1,
            ),
          ),
          Text(
            unit,
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: DsTokens.textTertiary,
            ),
          ),
        ],
      ),
    );
  }
}
