import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Pixel-closer Flutter port of Figma
/// `AiPlanCoach · Meet · Intro Motion` (`133:728`).
class AiPlanCoachMeetPage extends StatefulWidget {
  const AiPlanCoachMeetPage({super.key});

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

  static const _duration = Duration(milliseconds: 4400);

  late final AnimationController _timeline;
  final _focus = FocusNode();
  final _controller = TextEditingController();

  bool _showChips = true;
  bool _greetingVisible = true;

  // Timeline fractions from Figma motion (4.4s)
  static const _starEnd = 0.125; // 550ms
  static const _hiStart = 0.14773; // ~650ms
  static const _hiEnd = 0.32955; // ~1450ms
  static const _coachStart = 0.35227; // ~1550ms
  static const _coachEnd = 0.57955; // ~2550ms
  static const _tipStart = 0.60227; // ~2650ms
  static const _tipEnd = 0.73864; // ~3250ms
  static const _chromeStart = 0.76136; // ~3350ms
  static const _chromeEnd = 0.89773; // ~3950ms

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

  double _seg(double t, double a, double b) {
    if (t <= a) return 0;
    if (t >= b) return 1;
    return Curves.easeOut.transform((t - a) / (b - a));
  }

  @override
  Widget build(BuildContext context) {
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
              final star = _seg(t, 0, _starEnd);
              final hi = _seg(t, _hiStart, _hiEnd);
              final coach = _seg(t, _coachStart, _coachEnd);
              final tip = _seg(t, _tipStart, _tipEnd);
              final chrome = _seg(t, _chromeStart, _chromeEnd);

              return Column(
                children: [
                  const _StatusBar(),
                  _TopBar(opacity: chrome, dy: 12 * (1 - chrome)),
                  Expanded(
                    child: AnimatedOpacity(
                      duration: const Duration(milliseconds: 180),
                      opacity: _greetingVisible ? 1 : 0,
                      child: AnimatedSlide(
                        duration: const Duration(milliseconds: 180),
                        offset: _greetingVisible
                            ? Offset.zero
                            : const Offset(0, -0.06),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 28),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Opacity(
                                opacity: star,
                                child: Transform.translate(
                                  offset: Offset(0, 28 * (1 - star)),
                                  child: ShaderMask(
                                    blendMode: BlendMode.srcIn,
                                    shaderCallback: (bounds) =>
                                        const LinearGradient(
                                      begin: Alignment(-0.2, -1),
                                      end: Alignment(0.4, 1),
                                      colors: [
                                        Color(0xFF40C4EC),
                                        Color(0xFF17ACDA),
                                        Color(0xFFE1F3F7),
                                      ],
                                      stops: [0.31, 0.49, 0.79],
                                    ).createShader(bounds),
                                    child: Text(
                                      '✦',
                                      style: GoogleFonts.inter(
                                        fontSize: 64,
                                        fontWeight: FontWeight.w600,
                                        height: 1,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),
                              _TypeClip(
                                text: 'Hi Sifan,',
                                progress: hi,
                                visible: t >= _hiStart,
                                maxWidth: 111,
                                style: GoogleFonts.nunito(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w800,
                                  color: const Color(0xFF111827),
                                  height: 1.15,
                                ),
                              ),
                              const SizedBox(height: 12),
                              _TypeClip(
                                text: 'i am your personal coach',
                                progress: coach,
                                visible: t >= _coachStart,
                                maxWidth: 324,
                                style: GoogleFonts.nunito(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w800,
                                  color: const Color(0xFF111827),
                                  height: 1.15,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Opacity(
                                opacity: tip,
                                child: Transform.translate(
                                  offset: Offset(0, 18 * (1 - tip)),
                                  child: Text(
                                    'In one sentence, tell me the goal and the timeframe — I’ll build a detailed plan for you.',
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.nunito(
                                      fontSize: 14,
                                      height: 20 / 14,
                                      fontWeight: FontWeight.w500,
                                      color: const Color(0xFF6B6B73),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
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
  const _TopBar({required this.opacity, required this.dy});

  final double opacity;
  final double dy;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: opacity,
      child: Transform.translate(
        offset: Offset(0, dy),
        child: SizedBox(
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
                    ShaderMask(
                      blendMode: BlendMode.srcIn,
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [
                          Color(0xFF40C4EC),
                          Color(0xFF17ACDA),
                          Color(0xFFE1F3F7),
                        ],
                      ).createShader(bounds),
                      child: Text(
                        '✦',
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
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
        ),
      ),
    );
  }
}

class _TypeClip extends StatelessWidget {
  const _TypeClip({
    required this.text,
    required this.progress,
    required this.visible,
    required this.maxWidth,
    required this.style,
  });

  final String text;
  final double progress;
  final bool visible;
  final double maxWidth;
  final TextStyle style;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: visible ? 1 : 0,
      child: Align(
        alignment: Alignment.center,
        child: ClipRect(
          child: Align(
            alignment: Alignment.centerLeft,
            widthFactor: math.max(0.01, progress),
            child: SizedBox(
              width: maxWidth,
              child: Text(text, style: style, maxLines: 1, overflow: TextOverflow.clip),
            ),
          ),
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
