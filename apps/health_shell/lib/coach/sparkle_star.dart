import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

/// Soft 4-point sparkle that loops: spin one turn → brief pause → repeat.
class LoopingSpinStar extends StatefulWidget {
  const LoopingSpinStar({
    super.key,
    required this.size,
    this.delay = const Duration(seconds: 1),
    this.turnDuration = const Duration(milliseconds: 900),
    this.pauseDuration = const Duration(milliseconds: 380),
    this.showGlints = true,
  });

  final double size;
  final Duration delay;
  final Duration turnDuration;
  final Duration pauseDuration;
  final bool showGlints;

  @override
  State<LoopingSpinStar> createState() => _LoopingSpinStarState();
}

class _LoopingSpinStarState extends State<LoopingSpinStar>
    with SingleTickerProviderStateMixin {
  late final AnimationController _spin;
  Timer? _delay;
  Timer? _pause;
  bool _started = false;
  int _completedTurns = 0;

  @override
  void initState() {
    super.initState();
    _spin = AnimationController(vsync: this, duration: widget.turnDuration)
      ..addStatusListener(_onSpinStatus);
    _delay = Timer(widget.delay, () {
      if (!mounted) return;
      setState(() => _started = true);
      unawaited(_spin.forward(from: 0));
    });
  }

  void _onSpinStatus(AnimationStatus status) {
    if (!_started || status != AnimationStatus.completed || !mounted) return;
    setState(() => _completedTurns += 1);
    _pause?.cancel();
    _pause = Timer(widget.pauseDuration, () {
      if (!mounted) return;
      unawaited(_spin.forward(from: 0));
    });
  }

  @override
  void dispose() {
    _delay?.cancel();
    _pause?.cancel();
    _spin.removeStatusListener(_onSpinStatus);
    _spin.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final box = widget.size * (widget.showGlints ? 1.85 : 1.0);
    if (!_started) {
      return SizedBox(width: box, height: box);
    }

    return AnimatedBuilder(
      animation: _spin,
      builder: (context, child) {
        final t = Curves.easeInOutCubic.transform(_spin.value);
        final opacity = _completedTurns >= 1
            ? 1.0
            : Curves.easeOutCubic.transform(_spin.value);
        final glintProgress =
            _completedTurns >= 1 ? (0.55 + 0.45 * t) : opacity;

        return SizedBox(
          width: box,
          height: box,
          child: Opacity(
            opacity: opacity,
            child: Stack(
              alignment: Alignment.center,
              children: [
                if (widget.showGlints)
                  CustomPaint(
                    size: Size(box, box),
                    painter: _GlintFieldPainter(progress: glintProgress),
                  ),
                Transform.rotate(
                  angle: t * math.pi * 2,
                  child: child,
                ),
              ],
            ),
          ),
        );
      },
      child: SoftSparkleStar(size: widget.size),
    );
  }
}

class SoftSparkleStar extends StatelessWidget {
  const SoftSparkleStar({super.key, required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: SoftSparklePainter()),
    );
  }
}

class SoftSparklePainter extends CustomPainter {
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
        begin: Alignment(-0.2, -1),
        end: Alignment(0.4, 1),
        colors: [Color(0xFF40C4EC), Color(0xFF17ACDA), Color(0xFFE1F3F7)],
        stops: [0.31, 0.49, 0.79],
      ).createShader(Offset.zero & size);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _GlintFieldPainter extends CustomPainter {
  _GlintFieldPainter({required this.progress});

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) return;
    final cx = size.width / 2;
    final cy = size.height / 2;
    final baseR = size.width * 0.34;

    for (var i = 0; i < 8; i++) {
      final phase = i * (math.pi * 2 / 8);
      final a = phase + progress * math.pi * 2;
      final pulse = 0.55 + 0.45 * math.sin(progress * math.pi * 6 + i * 1.7);
      final r = baseR * (0.92 + 0.18 * math.sin(progress * math.pi * 4 + i));
      final x = cx + r * math.cos(a);
      final y = cy + r * math.sin(a);
      final opacity = (pulse * progress.clamp(0.0, 1.0)).clamp(0.0, 1.0);
      final dot = 1.2 + (i.isEven ? 1.6 : 0.8) * pulse;

      final paint = Paint()
        ..isAntiAlias = true
        ..color = Color.fromRGBO(
          125,
          211,
          252,
          opacity * (i.isEven ? 0.95 : 0.65),
        );
      canvas.drawCircle(Offset(x, y), dot, paint);

      if (i.isOdd) {
        final arm = 2.2 + 1.5 * pulse;
        paint
          ..strokeWidth = 1.1
          ..style = PaintingStyle.stroke;
        canvas.drawLine(Offset(x - arm, y), Offset(x + arm, y), paint);
        canvas.drawLine(Offset(x, y - arm), Offset(x, y + arm), paint);
        paint.style = PaintingStyle.fill;
      }
    }
  }

  @override
  bool shouldRepaint(covariant _GlintFieldPainter oldDelegate) =>
      oldDelegate.progress != progress;
}
