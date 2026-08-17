import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

/// Soft 4-point sparkle that loops: spin one turn → brief pause → repeat.
/// Background glints stay fixed and twinkle irregularly (do not rotate).
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
    with TickerProviderStateMixin {
  late final AnimationController _spin;
  late final AnimationController _twinkle;
  Timer? _delay;
  Timer? _pause;
  bool _started = false;
  int _completedTurns = 0;

  @override
  void initState() {
    super.initState();
    _spin = AnimationController(vsync: this, duration: widget.turnDuration)
      ..addStatusListener(_onSpinStatus);
    // Independent clock for irregular fixed-position twinkles.
    _twinkle = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    );
    _delay = Timer(widget.delay, () {
      if (!mounted) return;
      setState(() => _started = true);
      _twinkle.repeat();
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
    _twinkle.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final box = widget.size * (widget.showGlints ? 1.85 : 1.0);
    if (!_started) {
      return SizedBox(width: box, height: box);
    }

    return AnimatedBuilder(
      animation: Listenable.merge([_spin, _twinkle]),
      builder: (context, child) {
        final t = Curves.easeInOutCubic.transform(_spin.value);
        final opacity = _completedTurns >= 1
            ? 1.0
            : Curves.easeOutCubic.transform(_spin.value);

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
                    painter: _FixedTwinklePainter(time: _twinkle.value),
                  ),
                // Only the main star rotates.
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

/// Fixed-position dots / mini-stars that flicker irregularly (no orbit).
class _FixedTwinklePainter extends CustomPainter {
  _FixedTwinklePainter({required this.time});

  final double time;

  // Angle (turns), radius factor, isMiniStar, speed, phase.
  static const _specs = <(double, double, bool, double, double)>[
    (0.00, 0.36, false, 1.7, 0.1), // 12 o'clock dot
    (0.08, 0.40, true, 2.3, 0.4), // ~1 o'clock star
    (0.25, 0.35, false, 1.1, 0.8), // 3 o'clock dot
    (0.33, 0.41, true, 2.9, 0.2), // ~4 o'clock star
    (0.50, 0.36, false, 1.9, 0.55), // 6 o'clock dot
    (0.67, 0.38, false, 2.5, 0.15), // 9-ish
    (0.78, 0.42, true, 1.4, 0.9), // ~11 o'clock star
    (0.90, 0.34, false, 3.1, 0.35), // upper-left dot
  ];

  double _flicker(double speed, double phase) {
    // Two out-of-phase waves → irregular bright/dim, not a steady pulse.
    final a = math.sin((time * speed + phase) * math.pi * 2);
    final b = math.sin((time * speed * 1.73 + phase * 2.1) * math.pi * 2);
    final c = math.sin((time * speed * 0.61 + phase * 0.7) * math.pi * 2);
    final raw = (a * 0.55 + b * 0.35 + c * 0.25).clamp(-1.0, 1.0);
    // Bias toward mostly dim with occasional brighter flashes.
    return ((raw + 0.35) / 1.35).clamp(0.08, 1.0);
  }

  void _drawMiniStar(Canvas canvas, Offset c, double s, Color color) {
    final path = Path();
    final outer = s;
    final inner = s * 0.38;
    for (var i = 0; i < 4; i++) {
      final aOuter = -math.pi / 2 + i * math.pi / 2;
      final aInner = aOuter + math.pi / 4;
      final ox = c.dx + outer * math.cos(aOuter);
      final oy = c.dy + outer * math.sin(aOuter);
      final ix = c.dx + inner * math.cos(aInner);
      final iy = c.dy + inner * math.sin(aInner);
      if (i == 0) {
        path.moveTo(ox, oy);
      } else {
        path.lineTo(ox, oy);
      }
      path.lineTo(ix, iy);
    }
    path.close();
    canvas.drawPath(
      path,
      Paint()
        ..isAntiAlias = true
        ..color = color,
    );
  }

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final baseR = size.width * 0.5;

    for (final spec in _specs) {
      final (turn, rFactor, isStar, speed, phase) = spec;
      final a = turn * math.pi * 2 - math.pi / 2;
      final x = cx + baseR * rFactor * math.cos(a);
      final y = cy + baseR * rFactor * math.sin(a);
      final f = _flicker(speed, phase);
      final color = Color.fromRGBO(125, 211, 252, f * 0.95);

      if (isStar) {
        _drawMiniStar(canvas, Offset(x, y), 2.4 + 1.8 * f, color);
      } else {
        canvas.drawCircle(
          Offset(x, y),
          1.1 + 1.2 * f,
          Paint()
            ..isAntiAlias = true
            ..color = color,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant _FixedTwinklePainter oldDelegate) =>
      oldDelegate.time != time;
}
