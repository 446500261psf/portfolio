import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_models.dart';
import 'demo_script.dart';
import 'plan_thinking.dart';
import 'sparkle_star.dart';
import 'week_plan_cards.dart';

class ChatTranscript extends StatelessWidget {
  const ChatTranscript({
    super.key,
    required this.messages,
    required this.generating,
    required this.scrollController,
    this.planThinking = false,
    this.planThinkingLine,
    this.planThinkingOpacity = 0,
    this.weeks = const [],
  });

  final List<ChatMessage> messages;
  final bool generating;
  final ScrollController scrollController;
  final bool planThinking;
  final String? planThinkingLine;
  final double planThinkingOpacity;
  final List<WeekPlan> weeks;

  @override
  Widget build(BuildContext context) {
    final showWeeks = weeks.isNotEmpty && !planThinking;
    // Thinking only = reply not produced yet (generating / planThinking).
    final extras = <Widget>[
      if (generating) const _ThinkingBubble(),
      if (planThinking)
        _ThinkingBubble(
          body: PlanThinkingLineView(
            line: planThinkingLine ?? '',
            opacity: planThinkingOpacity,
          ),
        ),
      if (showWeeks)
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            WeekPlanCardList(weeks: weeks),
            const _AssistantBubble(
              text: WeightLoss15DayScript.planReadyMessage,
            ),
          ],
        ),
    ];

    return ListView.builder(
      controller: scrollController,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      itemCount: messages.length + extras.length,
      itemBuilder: (context, i) {
        if (i < messages.length) {
          final m = messages[i];
          if (m.role == ChatRole.user) {
            return _UserBubble(text: m.text);
          }
          return _AssistantBubble(text: m.text);
        }
        return extras[i - messages.length];
      },
    );
  }
}

class _UserBubble extends StatelessWidget {
  const _UserBubble({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Align(
        alignment: Alignment.centerRight,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 300),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFF007AFF),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Text(
            text,
            style: GoogleFonts.nunito(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              height: 1.35,
            ),
          ),
        ),
      ),
    );
  }
}

/// Reply bubble — no star / shimmer (content already exists).
class _AssistantBubble extends StatelessWidget {
  const _AssistantBubble({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 320),
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _PlanCoachLabel(),
              const SizedBox(height: 8),
              Text(
                text.isEmpty ? '…' : text,
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF111827),
                  height: 1.45,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Pre-reply thinking shell: Plan Coach shimmer + rotating star.
class _ThinkingBubble extends StatelessWidget {
  const _ThinkingBubble({this.body});

  final Widget? body;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 320),
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _ShimmerPlanCoachLabel(),
                  SizedBox(width: 8),
                  LoopingSpinStar(
                    size: 14,
                    showGlints: true,
                    delay: Duration(seconds: 1),
                  ),
                ],
              ),
              if (body != null) ...[
                const SizedBox(height: 4),
                body!,
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _PlanCoachLabel extends StatelessWidget {
  const _PlanCoachLabel();

  @override
  Widget build(BuildContext context) {
    return Text(
      'Plan Coach',
      style: GoogleFonts.nunito(
        fontSize: 13,
        fontWeight: FontWeight.w800,
        color: const Color(0xFF007AFF),
      ),
    );
  }
}

/// Thinking-only: highlight band racing across “Plan Coach”.
class _ShimmerPlanCoachLabel extends StatefulWidget {
  const _ShimmerPlanCoachLabel();

  @override
  State<_ShimmerPlanCoachLabel> createState() => _ShimmerPlanCoachLabelState();
}

class _ShimmerPlanCoachLabelState extends State<_ShimmerPlanCoachLabel>
    with SingleTickerProviderStateMixin {
  late final AnimationController _sweep;

  @override
  void initState() {
    super.initState();
    _sweep = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    )..repeat();
  }

  @override
  void dispose() {
    _sweep.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _sweep,
      builder: (context, child) {
        final t = Curves.easeInOut.transform(_sweep.value);
        return ShaderMask(
          blendMode: BlendMode.srcIn,
          shaderCallback: (bounds) {
            final start = -1.2 + 2.8 * t;
            return LinearGradient(
              begin: Alignment(start, -0.35),
              end: Alignment(start + 0.9, 0.35),
              colors: const [
                Color(0xFF007AFF),
                Color(0xFF007AFF),
                Color(0xFF7DD3FC),
                Color(0xFFFFFFFF),
                Color(0xFF7DD3FC),
                Color(0xFF007AFF),
                Color(0xFF007AFF),
              ],
              stops: const [0.0, 0.30, 0.44, 0.50, 0.56, 0.70, 1.0],
            ).createShader(bounds);
          },
          child: child,
        );
      },
      child: Text(
        'Plan Coach',
        style: GoogleFonts.nunito(
          fontSize: 13,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
      ),
    );
  }
}
