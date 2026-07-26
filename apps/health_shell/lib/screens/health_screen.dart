import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/tokens.dart';
import '../widgets/ds_card.dart';
import '../widgets/screen_header.dart';

class HealthScreen extends StatelessWidget {
  const HealthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 24),
      children: [
        const ScreenHeader(
          title: 'Health',
          subtitle: 'Hub · vitals overview',
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: DsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Heart rate',
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: DsTokens.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '72',
                      style: GoogleFonts.nunito(
                        fontSize: 56,
                        fontWeight: FontWeight.w800,
                        height: 1,
                        color: DsTokens.danger,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 6, bottom: 10),
                      child: Text(
                        'bpm',
                        style: GoogleFonts.nunito(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: DsTokens.textTertiary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 48,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: List.generate(15, (i) {
                      final h = 12.0 + ((i * 17) % 36);
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 1.5),
                          child: Container(
                            height: h,
                            decoration: BoxDecoration(
                              color: DsTokens.danger.withValues(alpha: 0.75),
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                      );
                    }),
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
              Expanded(child: _MetricMini(title: 'SpO₂', value: '98%', bar: 0.98, color: DsTokens.accent)),
              SizedBox(width: 12),
              Expanded(child: _MetricMini(title: 'Steps', value: '6,420', bar: 0.64, color: DsTokens.success)),
            ],
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
                  'Sleep',
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: DsTokens.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '7h 20m',
                  style: GoogleFonts.nunito(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: SizedBox(
                    height: 14,
                    child: Row(
                      children: const [
                        Expanded(flex: 18, child: ColoredBox(color: Color(0xFF3B82F6))),
                        Expanded(flex: 28, child: ColoredBox(color: Color(0xFF6366F1))),
                        Expanded(flex: 22, child: ColoredBox(color: Color(0xFF9650DF))),
                        Expanded(flex: 20, child: ColoredBox(color: Color(0xFFA78BFA))),
                        Expanded(flex: 12, child: ColoredBox(color: Color(0xFFC4B5FD))),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '23:10  ·  Awake · Light · Deep · REM  ·  06:30',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textTertiary,
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
              Expanded(child: _StatPair(label: 'Weight', value: '70.2 kg')),
              SizedBox(width: 12),
              Expanded(child: _StatPair(label: 'Body fat', value: '22.4%')),
            ],
          ),
        ),
        const SizedBox(height: 12),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Expanded(child: _StatPair(label: 'Stress', value: '42', hint: 'Moderate')),
              SizedBox(width: 12),
              Expanded(child: _StatPair(label: 'Blood pressure', value: '118/76', hint: 'Normal')),
            ],
          ),
        ),
      ],
    );
  }
}

class _MetricMini extends StatelessWidget {
  const _MetricMini({
    required this.title,
    required this.value,
    required this.bar,
    required this.color,
  });

  final String title;
  final String value;
  final double bar;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return DsCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.nunito(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: DsTokens.textSecondary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.nunito(
              fontSize: 24,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: bar,
              minHeight: 6,
              backgroundColor: const Color(0xFFE8EEF7),
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatPair extends StatelessWidget {
  const _StatPair({required this.label, required this.value, this.hint});

  final String label;
  final String value;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    return DsCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: DsTokens.textSecondary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.nunito(
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          if (hint != null) ...[
            const SizedBox(height: 4),
            Text(
              hint!,
              style: GoogleFonts.nunito(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: DsTokens.success,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
