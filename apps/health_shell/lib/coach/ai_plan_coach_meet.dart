import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Flutter port of Figma `AiPlanCoach · Meet · Intro Motion` (`133:728`).
class AiPlanCoachMeetPage extends StatefulWidget {
  const AiPlanCoachMeetPage({super.key});

  static const buildMarker = 'meet-v5';

  @override
  State<AiPlanCoachMeetPage> createState() => _AiPlanCoachMeetPageState();
}

class _AiPlanCoachMeetPageState extends State<AiPlanCoachMeetPage>
    with SingleTickerProviderStateMixin {
  static const _chips = <String>[
    'High-intensity training plan',
    "I'm a serious runner",
    'I want to lose fat',
    'Build muscle',
    'Build an exercise habit',
  ];

  static const _hiFull = 'Hi Sifan,';
  static const _coachFull = 'i am your personal coach';
  static const _tipFull =
      'In one sentence, tell me the goal and the timeframe — I’ll build a detailed plan for you.';

  static const _duration = Duration(milliseconds: 4400);

  // Figma timeline fractions (4.4s)
  static const _starEnd = 0.125; // 0–550ms
  static const _hiStart = 0.14773;
  static const _hiEnd = 0.32955;
  static const _coachStart = 0.35227;
  static const _coachEnd = 0.57955;
  static const _tipStart = 0.60227;
  static const _tipEnd = 0.73864;
  static const _chromeStart = 0.76136;
  static const _chromeEnd = 0.89773;

  late final AnimationController _timeline;
  final _focus = FocusNode();
  final _controller = TextEditingController();

  bool _showChips = true;
  bool _greetingVisible = true;

  @override
  void initState() {
    super.initState();
    _timeline = AnimationController(vsync: this, duration: _duration)
      ..forward();
    _focus.addListener(() {
      if (!_focus.hasFocus || _timeline.value < _chromeEnd) return;
      setState(() {
        _showChips = false;
        _greetingVisible = false;
      });
    });
  }

  @override
  void dispose() {
    _timeline.dispose();
    _focus.dispose();
    _controller.dispose();
    super.dispose();
  }

  double _ramp(double t, double a, double b) {
    if (t <= a) return 0;
    if (t >= b) return 1;
    return Curves.easeOutCubic.transform((t - a) / (b - a));
  }

  String _typed(String full, double progress) {
    if (progress <= 0) return '';
    if (progress >= 1) return full;
    final n = (full.length * progress).ceil().clamp(0, full.length);
    return full.substring(0, n);
  }

  @override
  Widget build(BuildContext context) {
    final titleStyle = GoogleFonts.nunito(
      fontSize: 28,
      fontWeight: FontWeight.w800,
      color: const Color(0xFF111827),
      height: 1.3,
    );

    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFD1F0F8), Color(0xFFF8F7F6)],
          ),
        ),
        child: SafeArea(
          child: AnimatedBuilder(
            animation: _timeline,
            builder: (context, _) {
              final t = _timeline.value;
              final star = _ramp(t, 0, _starEnd);
              final hiP = _ramp(t, _hiStart, _hiEnd);
              final coachP = _ramp(t, _coachStart, _coachEnd);
              final tip = _ramp(t, _tipStart, _tipEnd);
              final chrome = _ramp(t, _chromeStart, _chromeEnd);

              // After each segment ends, always show the full string.
              final hiText = t >= _hiEnd ? _hiFull : _typed(_hiFull, hiP);
              final coachText =
                  t >= _coachEnd ? _coachFull : _typed(_coachFull, coachP);

              return Column(
                children: [
                  const _StatusBar(),
                  Opacity(
                    opacity: chrome,
                    child: Transform.translate(
                      offset: Offset(0, 12 * (1 - chrome)),
                      child: const _TopBar(),
                    ),
                  ),
                  Expanded(
                    child: AnimatedOpacity(
                      duration: const Duration(milliseconds: 180),
                      opacity: _greetingVisible ? 1 : 0,
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          return SingleChildScrollView(
                            physics: const ClampingScrollPhysics(),
                            child: ConstrainedBox(
                              constraints: BoxConstraints(
                                minHeight: constraints.maxHeight,
                              ),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 8,
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    // Fixed star slot — typing cannot shove it around.
                                    SizedBox(
                                      height: 96,
                                      child: Opacity(
                                        opacity: star,
                                        child: Transform.translate(
                                          offset: Offset(0, 28 * (1 - star)),
                                          child: const Center(
                                            child: _SparkleStar(size: 64),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    _ReservedLine(
                                      reserve: _hiFull,
                                      shown: hiText,
                                      style: titleStyle,
                                      visible: t >= _hiStart,
                                    ),
                                    const SizedBox(height: 12),
                                    _ReservedLine(
                                      reserve: _coachFull,
                                      shown: coachText,
                                      style: titleStyle,
                                      visible: t >= _coachStart,
                                    ),
                                    const SizedBox(height: 12),
                                    Opacity(
                                      opacity: tip,
                                      child: Transform.translate(
                                        offset: Offset(0, 18 * (1 - tip)),
                                        child: Text(
                                          _tipFull,
                                          textAlign: TextAlign.center,
                                          style: GoogleFonts.nunito(
                                            fontSize: 14,
                                            height: 1.45,
                                            fontWeight: FontWeight.w500,
                                            color: const Color(0xFF6B6B73),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      AiPlanCoachMeetPage.buildMarker,
                                      style: GoogleFonts.nunito(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF9CA3AF),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  Opacity(
                    opacity: chrome,
                    child: Transform.translate(
                      offset: Offset(0, 12 * (1 - chrome)),
                      child: _Composer(
                        chips: _chips,
                        showChips: _showChips,
                        focusNode: _focus,
                        controller: _controller,
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}

/// Keeps layout height stable while the visible string types out.
class _ReservedLine extends StatelessWidget {
  const _ReservedLine({
    required this.reserve,
    required this.shown,
    required this.style,
    required this.visible,
  });

  final String reserve;
  final String shown;
  final TextStyle style;
  final bool visible;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Invisible full string = reserved width/height, prevents reflow.
        Opacity(
          opacity: 0,
          child: Text(
            reserve,
            textAlign: TextAlign.center,
            style: style,
          ),
        ),
        Opacity(
          opacity: visible ? 1 : 0,
          child: Text(
            shown.isEmpty ? '' : shown,
            textAlign: TextAlign.center,
            style: style,
          ),
        ),
      ],
    );
  }
}

/// Drawn sparkle — avoids font-load flash / wrong glyph while Google Fonts fetch.
class _SparkleStar extends StatelessWidget {
  const _SparkleStar({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: _SparklePainter()),
    );
  }
}

class _SparklePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final outer = size.width * 0.48;
    final inner = size.width * 0.16;

    final path = Path();
    for (var i = 0; i < 4; i++) {
      final aOuter = -math.pi / 2 + i * math.pi / 2;
      final aInner = aOuter + math.pi / 4;
      final ox = cx + outer * math.cos(aOuter);
      final oy = cy + outer * math.sin(aOuter);
      final ix = cx + inner * math.cos(aInner);
      final iy = cy + inner * math.sin(aInner);
      if (i == 0) {
        path.moveTo(ox, oy);
      } else {
        path.lineTo(ox, oy);
      }
      path.lineTo(ix, iy);
    }
    path.close();

    final rect = Offset.zero & size;
    final paint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment(-0.2, -1),
        end: Alignment(0.4, 1),
        colors: [
          Color(0xFF40C4EC),
          Color(0xFF17ACDA),
          Color(0xFFE1F3F7),
        ],
        stops: [0.31, 0.49, 0.79],
      ).createShader(rect)
      ..style = PaintingStyle.fill;

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _StatusBar extends StatelessWidget {
  const _StatusBar();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Row(
          children: [
            Text(
              '9:41',
              style: GoogleFonts.nunito(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF111827),
              ),
            ),
            const Spacer(),
            Text(
              '●●●  100%',
              style: GoogleFonts.nunito(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF6B6B73),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Material(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => Navigator.of(context).maybePop(),
                child: const SizedBox(
                  width: 32,
                  height: 32,
                  child: Center(
                    child: Text('←', style: TextStyle(fontSize: 18)),
                  ),
                ),
              ),
            ),
            const Spacer(),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const _SparkleStar(size: 18),
                const SizedBox(width: 6),
                Text(
                  'Premium',
                  style: GoogleFonts.nunito(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
            const Spacer(),
            const SizedBox(width: 32),
          ],
        ),
      ),
    );
  }
}

class _Composer extends StatelessWidget {
  const _Composer({
    required this.chips,
    required this.showChips,
    required this.focusNode,
    required this.controller,
  });

  final List<String> chips;
  final bool showChips;
  final FocusNode focusNode;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedSize(
            duration: const Duration(milliseconds: 100),
            child: showChips
                ? SizedBox(
                    height: 40,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: chips.length,
                      separatorBuilder: (_, _) => const SizedBox(width: 8),
                      itemBuilder: (context, i) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFE5E5EB)),
                          ),
                          child: Text(
                            chips[i],
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              height: 16 / 12,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.012,
                              color: const Color(0xFF6B7280),
                            ),
                          ),
                        );
                      },
                    ),
                  )
                : const SizedBox(width: double.infinity, height: 0),
          ),
          if (showChips) const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 10, 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFFE5E5EB)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    focusNode: focusNode,
                    controller: controller,
                    style: GoogleFonts.nunito(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF111827),
                    ),
                    decoration: InputDecoration(
                      isCollapsed: true,
                      border: InputBorder.none,
                      hintText: 'e.g. Lose 5 kg in 7 weeks',
                      hintStyle: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF6B6B73),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: const BoxDecoration(
                    color: Color(0xFF007AFF),
                    borderRadius: BorderRadius.all(Radius.circular(18)),
                  ),
                  child: Text(
                    '↑',
                    style: GoogleFonts.nunito(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
