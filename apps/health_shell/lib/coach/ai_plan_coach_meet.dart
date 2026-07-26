import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Flutter port of Figma `AiPlanCoach · Meet · Intro Motion` (`133:728`).
///
/// Build marker: if you still see clipped "Hi" / "i am your personal",
/// you are not running this revision — pull + flutter clean + rerun.
class AiPlanCoachMeetPage extends StatefulWidget {
  const AiPlanCoachMeetPage({super.key});

  static const buildMarker = 'meet-v4';

  @override
  State<AiPlanCoachMeetPage> createState() => _AiPlanCoachMeetPageState();
}

class _AiPlanCoachMeetPageState extends State<AiPlanCoachMeetPage> {
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

  final _focus = FocusNode();
  final _controller = TextEditingController();

  double _starOpacity = 0;
  double _starDy = 28;
  String _hi = '';
  String _coach = '';
  double _tipOpacity = 0;
  double _tipDy = 18;
  double _chromeOpacity = 0;
  double _chromeDy = 12;

  bool _showChips = true;
  bool _greetingVisible = true;
  bool _introDone = false;

  final _timers = <Timer>[];

  @override
  void initState() {
    super.initState();
    _focus.addListener(() {
      if (!_focus.hasFocus || !_introDone) return;
      setState(() {
        _showChips = false;
        _greetingVisible = false;
      });
    });
    _runIntro();
  }

  void _later(int ms, VoidCallback fn) {
    _timers.add(Timer(Duration(milliseconds: ms), () {
      if (!mounted) return;
      fn();
    }));
  }

  Future<void> _runIntro() async {
    // 0–550ms: star rise
    _later(16, () {
      setState(() {
        _starOpacity = 1;
        _starDy = 0;
      });
    });

    // 650–1450ms: type "Hi Sifan,"
    _later(650, () => _typeInto(_hiFull, (v) => setState(() => _hi = v), 800));

    // 1550–2550ms: type coach line
    _later(1550, () {
      _typeInto(_coachFull, (v) => setState(() => _coach = v), 1000);
    });

    // 2650–3250ms: tip
    _later(2650, () {
      setState(() {
        _tipOpacity = 1;
        _tipDy = 0;
      });
    });

    // 3350–3950ms: chrome
    _later(3350, () {
      setState(() {
        _chromeOpacity = 1;
        _chromeDy = 0;
      });
    });

    // Hard finalize — never leave truncated copy on screen.
    _later(4000, () {
      setState(() {
        _hi = _hiFull;
        _coach = _coachFull;
        _starOpacity = 1;
        _starDy = 0;
        _tipOpacity = 1;
        _tipDy = 0;
        _chromeOpacity = 1;
        _chromeDy = 0;
        _introDone = true;
      });
    });
  }

  void _typeInto(String full, ValueChanged<String> set, int ms) {
    if (full.isEmpty) return;
    final step = (ms / full.length).ceil().clamp(16, 80);
    for (var i = 1; i <= full.length; i++) {
      _later((i - 1) * step, () => set(full.substring(0, i)));
    }
  }

  @override
  void dispose() {
    for (final t in _timers) {
      t.cancel();
    }
    _focus.dispose();
    _controller.dispose();
    super.dispose();
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
          child: Column(
            children: [
              const _StatusBar(),
              AnimatedOpacity(
                duration: const Duration(milliseconds: 400),
                opacity: _chromeOpacity,
                child: Transform.translate(
                  offset: Offset(0, _chromeDy),
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
                        child: ConstrainedBox(
                          constraints: BoxConstraints(
                            minHeight: constraints.maxHeight,
                          ),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                AnimatedOpacity(
                                  duration: const Duration(milliseconds: 450),
                                  opacity: _starOpacity,
                                  child: Transform.translate(
                                    offset: Offset(0, _starDy),
                                    child: Padding(
                                      padding: const EdgeInsets.all(8),
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
                                            height: 1.2,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  _hi.isEmpty ? ' ' : _hi,
                                  textAlign: TextAlign.center,
                                  style: titleStyle,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  _coach.isEmpty ? ' ' : _coach,
                                  textAlign: TextAlign.center,
                                  style: titleStyle,
                                ),
                                const SizedBox(height: 12),
                                AnimatedOpacity(
                                  duration: const Duration(milliseconds: 500),
                                  opacity: _tipOpacity,
                                  child: Transform.translate(
                                    offset: Offset(0, _tipDy),
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
              AnimatedOpacity(
                duration: const Duration(milliseconds: 400),
                opacity: _chromeOpacity,
                child: Transform.translate(
                  offset: Offset(0, _chromeDy),
                  child: _Composer(
                    chips: _chips,
                    showChips: _showChips,
                    focusNode: _focus,
                    controller: _controller,
                  ),
                ),
              ),
            ],
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
