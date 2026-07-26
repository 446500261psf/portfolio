import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_models.dart';

/// Collapsed weekly plan cards — tap expands detail in-place (same width).
class WeekPlanCardList extends StatefulWidget {
  const WeekPlanCardList({super.key, required this.weeks});

  final List<WeekPlan> weeks;

  @override
  State<WeekPlanCardList> createState() => _WeekPlanCardListState();
}

class _WeekPlanCardListState extends State<WeekPlanCardList> {
  String? _expandedId;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
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
          for (var i = 0; i < widget.weeks.length; i++) ...[
            if (i > 0) const SizedBox(height: 10),
            WeekPlanExpandCard(
              key: ValueKey('week-card-${widget.weeks[i].id}'),
              week: widget.weeks[i],
              expanded: _expandedId == widget.weeks[i].id,
              onToggle: () {
                setState(() {
                  final id = widget.weeks[i].id;
                  _expandedId = _expandedId == id ? null : id;
                });
              },
            ),
          ],
        ],
      ),
    );
  }
}

class WeekPlanExpandCard extends StatelessWidget {
  const WeekPlanExpandCard({
    super.key,
    required this.week,
    required this.expanded,
    required this.onToggle,
  });

  final WeekPlan week;
  final bool expanded;
  final VoidCallback onToggle;

  static const _radius = 24.0;
  static const _surface = Color(0xFFFFFFFF);

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 320),
      curve: Curves.easeInOutCubic,
      width: double.infinity,
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(_radius),
        border: Border.all(
          color: expanded
              ? const Color(0xFFB7E4F3)
              : const Color(0xFFE5E5EB),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(_radius),
        child: InkWell(
          onTap: onToggle,
          borderRadius: BorderRadius.circular(_radius),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 14, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _WeekHeader(week: week, expanded: expanded),
                AnimatedSize(
                  duration: const Duration(milliseconds: 320),
                  curve: Curves.easeInOutCubic,
                  alignment: Alignment.topCenter,
                  child: expanded
                      ? _WeekExpandedBody(week: week)
                      : const SizedBox(width: double.infinity),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _WeekHeader extends StatelessWidget {
  const _WeekHeader({required this.week, required this.expanded});

  final WeekPlan week;
  final bool expanded;

  @override
  Widget build(BuildContext context) {
    return Row(
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
                maxLines: expanded ? 3 : 1,
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
        AnimatedRotation(
          turns: expanded ? 0.25 : 0,
          duration: const Duration(milliseconds: 280),
          curve: Curves.easeInOut,
          child: const Icon(
            Icons.chevron_right_rounded,
            color: Color(0xFF9CA3AF),
          ),
        ),
      ],
    );
  }
}

class _WeekExpandedBody extends StatelessWidget {
  const _WeekExpandedBody({required this.week});

  final WeekPlan week;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            height: 1,
            color: const Color(0xFFE8E8EE),
          ),
          const SizedBox(height: 14),
          for (var i = 0; i < week.days.length; i++) ...[
            if (i > 0) const SizedBox(height: 10),
            _DayDetailBlock(day: week.days[i]),
          ],
        ],
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
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF7FBFD),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            day.label,
            style: GoogleFonts.nunito(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF17ACDA),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            day.focus,
            style: GoogleFonts.nunito(
              fontSize: 14,
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
          const SizedBox(height: 8),
          for (final move in day.moves)
            Padding(
              padding: const EdgeInsets.only(bottom: 3),
              child: Text(
                '• $move',
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF374151),
                  height: 1.35,
                ),
              ),
            ),
          if (day.note != null) ...[
            const SizedBox(height: 6),
            Text(
              day.note!,
              style: GoogleFonts.nunito(
                fontSize: 12,
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
