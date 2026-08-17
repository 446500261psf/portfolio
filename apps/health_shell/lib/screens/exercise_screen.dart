import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/tokens.dart';
import '../widgets/ds_card.dart';
import '../widgets/screen_header.dart';

class ExerciseScreen extends StatelessWidget {
  const ExerciseScreen({super.key});

  static const _sports = <(IconData, String, Color)>[
    (Icons.directions_run, 'Run', Color(0xFFFFE8D6)),
    (Icons.directions_bike, 'Bike', Color(0xFFD9F3FF)),
    (Icons.pool, 'Swim', Color(0xFFDCEBFF)),
    (Icons.directions_walk, 'Walk', Color(0xFFE7F8EC)),
    (Icons.fitness_center, 'Strength', Color(0xFFFFE4E1)),
    (Icons.self_improvement, 'Yoga', Color(0xFFF3E8FF)),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 24),
      children: [
        const ScreenHeader(
          title: 'Exercise',
          subtitle: 'Pick a sport · start session',
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _sports.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.05,
            ),
            itemBuilder: (context, i) {
              final (icon, name, tint) = _sports[i];
              return DsCard(
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: tint,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Icon(icon, color: DsTokens.textPrimary, size: 24),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      name,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: DsCard(
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFE8D6),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.directions_run),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Outdoor run',
                        style: GoogleFonts.nunito(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        '5.2 km · 28:36 · 312 kcal',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: DsTokens.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  'Yesterday',
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textTertiary,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SizedBox(
            height: 56,
            child: FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: DsTokens.accent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                elevation: 2,
              ),
              onPressed: () {},
              child: Text(
                'Start Workout',
                style: GoogleFonts.nunito(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: const [
              Expanded(
                child: _PlanCard(
                  title: 'Beginner cardio',
                  meta: '3 km · 30 min',
                  color: DsTokens.success,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: _PlanCard(
                  title: 'Advanced cardio',
                  meta: '8 km · 45 min',
                  color: DsTokens.accent,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({
    required this.title,
    required this.meta,
    required this.color,
  });

  final String title;
  final String meta;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return DsCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: GoogleFonts.nunito(
              fontSize: 15,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            meta,
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: DsTokens.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
