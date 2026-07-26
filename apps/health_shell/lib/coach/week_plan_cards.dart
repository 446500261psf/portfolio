import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_models.dart';

/// Collapsed weekly plan cards — tap opens detail via OpenContainer.
class WeekPlanCardList extends StatelessWidget {
  const WeekPlanCardList({super.key, required this.weeks});

  final List<WeekPlan> weeks;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(
              'Your 15-day plan',
              style: GoogleFonts.nunito(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF111827),
              ),
            ),
          ),
          for (var i = 0; i < weeks.length; i++) ...[
            if (i > 0) const SizedBox(height: 10),
            WeekPlanOpenCard(week: weeks[i]),
          ],
        ],
      ),
    );
  }
}

class WeekPlanOpenCard extends StatelessWidget {
  const WeekPlanOpenCard({super.key, required this.week});

  final WeekPlan week;

  static const _closedRadius = 18.0;
  static const _surface = Color(0xFFFFFFFF);
  static const _openSurface = Color(0xFFF8F7F6);

  @override
  Widget build(BuildContext context) {
    return OpenContainer(
      // Morph from closed card bounds → full page (radius/color/size continuous).
      transitionType: ContainerTransitionType.fade,
      transitionDuration: const Duration(milliseconds: 480),
      closedElevation: 0,
      openElevation: 0,
      closedColor: _surface,
      openColor: _openSurface,
      middleColor: _surface,
      closedShape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(_closedRadius),
        side: const BorderSide(color: Color(0xFFE5E5EB)),
      ),
      openShape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.zero,
      ),
      tappable: false,
      closedBuilder: (context, open) {
        return _WeekClosedTile(week: week, onTap: open);
      },
      openBuilder: (context, close) {
        return _WeekDetailPage(week: week, onClose: close);
      },
    );
  }
}

class _WeekClosedTile extends StatelessWidget {
  const _WeekClosedTile({required this.week, required this.onTap});

  final WeekPlan week;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 14, 14),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F7FC),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '✦',
                  style: GoogleFonts.nunito(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF17ACDA),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      week.title,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${week.dayRange} · ${week.sessions} sessions',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF6B6B73),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      week.summary,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF9CA3AF),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right_rounded,
                color: Color(0xFF9CA3AF),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _WeekDetailPage extends StatelessWidget {
  const _WeekDetailPage({required this.week, required this.onClose});

  final WeekPlan week;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F7F6),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 4, 16, 8),
              child: Row(
                children: [
                  IconButton(
                    onPressed: onClose,
                    icon: const Icon(Icons.close_rounded),
                  ),
                  Expanded(
                    child: Text(
                      week.title,
                      style: GoogleFonts.nunito(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF111827),
                      ),
                    ),
                  ),
                  Text(
                    week.dayRange,
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF6B6B73),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                children: [
                  Text(
                    week.summary,
                    style: GoogleFonts.nunito(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF6B6B73),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 20),
                  for (final day in week.days) ...[
                    _DayDetailBlock(day: day),
                    const SizedBox(height: 14),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DayDetailBlock extends StatelessWidget {
  const _DayDetailBlock({required this.day});

  final DayPlan day;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E5EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            day.label,
            style: GoogleFonts.nunito(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF17ACDA),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            day.focus,
            style: GoogleFonts.nunito(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            day.duration,
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF9CA3AF),
            ),
          ),
          const SizedBox(height: 10),
          for (final move in day.moves)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(
                '• $move',
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF374151),
                  height: 1.35,
                ),
              ),
            ),
          if (day.note != null) ...[
            const SizedBox(height: 8),
            Text(
              day.note!,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                fontStyle: FontStyle.italic,
                color: const Color(0xFF6B6B73),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
