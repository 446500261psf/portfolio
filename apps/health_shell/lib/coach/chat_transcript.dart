import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_models.dart';
import 'demo_script.dart';
import 'plan_thinking.dart';
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
                  _PausingRotatingStar(size: 14),
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

/// Thinking-only star: wait 1s → fade in over 2 slow turns + glints → pause loop.
class _PausingRotatingStar extends StatefulWidget {
  const _PausingRotatingStar({required this.size});

  final double size;

  @override
  State<_PausingRotatingStar> createState() => _PausingRotatingStarState();
}

class _PausingRotatingStarState extends State<_PausingRotatingStar>
    with TickerProviderStateMixin {
  late final AnimationController _enter;
  late final AnimationController _spin;
  Timer? _pause;
  Timer? _delay;
  bool _entered = false;
  bool _started = false;

  @override
  void initState() {
    super.initState();
    _enter = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2100),
    );
    _spin = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..addStatusListener(_onSpinStatus);
    _delay = Timer(const Duration(seconds: 1), () {
      if (!mounted) return;
      setState(() => _started = true);
      unawaited(_runEnter());
    });
  }

  Future<void> _runEnter() async {
    await _enter.forward();
    if (!mounted) return;
    setState(() => _entered = true);
    unawaited(_spin.forward(from: 0));
  }

  void _onSpinStatus(AnimationStatus status) {
    if (!_entered || status != AnimationStatus.completed || !mounted) return;
    _pause?.cancel();
    _pause = Timer(const Duration(milliseconds: 320), () {
      if (!mounted) return;
      unawaited(_spin.forward(from: 0));
    });
  }

  @override
  void dispose() {
    _delay?.cancel();
    _pause?.cancel();
    _spin.removeStatusListener(_onSpinStatus);
    _enter.dispose();
    _spin.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final box = widget.size * 2.2;
    final star = SizedBox(
      width: widget.size,
      height: widget.size,
      child: CustomPaint(painter: _CyanSparklePainter()),
    );

    if (!_started) {
      return SizedBox(width: box, height: box);
    }

    if (!_entered) {
      return AnimatedBuilder(
        animation: _enter,
        builder: (context, child) {
          final t = Curves.easeInOutCubic.transform(_enter.value);
          return SizedBox(
            width: box,
            height: box,
            child: Opacity(
              opacity: t,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CustomPaint(
                    size: Size(box, box),
                    painter: _ThinkingGlintPainter(progress: t),
                  ),
                  Transform.rotate(
                    angle: t * math.pi * 4,
                    child: child,
                  ),
                ],
              ),
            ),
          );
        },
        child: star,
      );
    }

    return SizedBox(
      width: box,
      height: box,
      child: Center(
        child: AnimatedBuilder(
          animation: _spin,
          builder: (context, child) {
            final t = Curves.easeInOutCubic.transform(_spin.value);
            return Transform.rotate(
              angle: t * math.pi * 2,
              child: child,
            );
          },
          child: star,
        ),
      ),
    );
  }
}

class _ThinkingGlintPainter extends CustomPainter {
  _ThinkingGlintPainter({required this.progress});

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) return;
    final cx = size.width / 2;
    final cy = size.height / 2;
    final baseR = size.width * 0.36;

    for (var i = 0; i < 6; i++) {
      final phase = i * (math.pi * 2 / 6);
      final a = phase + progress * math.pi * 4 * 0.9;
      final pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 5 + i * 1.4);
      final r = baseR * (0.9 + 0.2 * math.sin(progress * math.pi * 3 + i));
      final x = cx + r * math.cos(a);
      final y = cy + r * math.sin(a);
      final opacity = (pulse * progress).clamp(0.0, 1.0);
      final paint = Paint()
        ..isAntiAlias = true
        ..color = Color.fromRGBO(125, 211, 252, opacity * 0.9);
      canvas.drawCircle(Offset(x, y), 1.0 + pulse, paint);
      if (i.isOdd) {
        final arm = 1.8 + pulse;
        paint
          ..strokeWidth = 1
          ..style = PaintingStyle.stroke;
        canvas.drawLine(Offset(x - arm, y), Offset(x + arm, y), paint);
        canvas.drawLine(Offset(x, y - arm), Offset(x, y + arm), paint);
        paint.style = PaintingStyle.fill;
      }
    }
  }

  @override
  bool shouldRepaint(covariant _ThinkingGlintPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

class _CyanSparklePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final outer = size.width * 0.48;
    final inner = size.width * 0.20;
    const tipSoft = 0.62;
    final path = Path();
    for (var i = 0; i < 4; i++) {
      final aOuter = -math.pi / 2 + i * math.pi / 2;
      final aInner = aOuter + math.pi / 4;
      final aPrevInner = aOuter - math.pi / 4;
      final tip = Offset(
        cx + outer * math.cos(aOuter),
        cy + outer * math.sin(aOuter),
      );
      final prevInner = Offset(
        cx + inner * math.cos(aPrevInner),
        cy + inner * math.sin(aPrevInner),
      );
      final nextInner = Offset(
        cx + inner * math.cos(aInner),
        cy + inner * math.sin(aInner),
      );
      final nearIn = Offset.lerp(tip, prevInner, 1 - tipSoft)!;
      final nearOut = Offset.lerp(tip, nextInner, 1 - tipSoft)!;
      if (i == 0) {
        path.moveTo(prevInner.dx, prevInner.dy);
      } else {
        path.lineTo(prevInner.dx, prevInner.dy);
      }
      path.lineTo(nearIn.dx, nearIn.dy);
      path.quadraticBezierTo(tip.dx, tip.dy, nearOut.dx, nearOut.dy);
      path.lineTo(nextInner.dx, nextInner.dy);
    }
    path.close();
    final paint = Paint()
      ..isAntiAlias = true
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFF17ACDA), Color(0xFF7DD3FC)],
      ).createShader(Offset.zero & size);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
