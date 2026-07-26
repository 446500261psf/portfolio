import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/tokens.dart';

/// Flutter port of AiPlanCoach · Meet motions from Design System:
/// - Intro (`133:728`)
/// - Keyboard focus (`136:695`)
/// - Chip tap → AI light sweep (`132:981`)
///
/// Node `143:738` was missing from the live Figma file; this screen
/// reconstructs the closest documented Meet “效果” stack.
class AiPlanCoachMeetPage extends StatefulWidget {
  const AiPlanCoachMeetPage({super.key});

  @override
  State<AiPlanCoachMeetPage> createState() => _AiPlanCoachMeetPageState();
}

class _AiPlanCoachMeetPageState extends State<AiPlanCoachMeetPage>
    with TickerProviderStateMixin {
  static const _chips = <String>[
    'Lose fat',
    'Build muscle',
    'Exercise habit',
    'High-intensity training plan',
    'Serious runner',
  ];

  late final AnimationController _intro;
  late final AnimationController _chipPulse;
  late final AnimationController _bubble;
  late final AnimationController _sweep;
  late final AnimationController _keyboard;

  final _focus = FocusNode();
  final _controller = TextEditingController();

  String _line1 = '';
  String _line2 = '';
  bool _showTip = false;
  bool _showChrome = false;
  bool _showChips = true;
  bool _greetingVisible = true;
  bool _showBubble = false;
  bool _showAi = false;
  String? _bubbleText;
  String? _pulsingChip;
  bool _introDone = false;

  @override
  void initState() {
    super.initState();
    _intro = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4400),
    );
    _chipPulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 180),
    );
    _bubble = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _sweep = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 950),
    );
    _keyboard = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );

    _focus.addListener(_onFocus);
    _runIntro();
  }

  Future<void> _runIntro() async {
    _intro.forward();
    // 0–550ms star handled by animation
    await Future<void>.delayed(const Duration(milliseconds: 650));
    if (!mounted) return;
    await _typewrite('Hi Sifan,', (v) => setState(() => _line1 = v), 800);
    await Future<void>.delayed(const Duration(milliseconds: 100));
    if (!mounted) return;
    await _typewrite(
      'i am your personal coach',
      (v) => setState(() => _line2 = v),
      1000,
    );
    await Future<void>.delayed(const Duration(milliseconds: 100));
    if (!mounted) return;
    setState(() => _showTip = true);
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() {
      _showChrome = true;
      _introDone = true;
    });
  }

  Future<void> _typewrite(
    String full,
    ValueChanged<String> onTick,
    int ms,
  ) async {
    final step = math.max(18, ms ~/ full.length);
    for (var i = 1; i <= full.length; i++) {
      onTick(full.substring(0, i));
      await Future<void>.delayed(Duration(milliseconds: step));
      if (!mounted) return;
    }
  }

  void _onFocus() {
    if (!_focus.hasFocus || !_introDone) return;
    setState(() {
      _showChips = false;
      _greetingVisible = false;
    });
    _keyboard.forward();
  }

  Future<void> _onChipTap(String label) async {
    if (!_introDone || _showAi) return;
    setState(() {
      _pulsingChip = label;
      _bubbleText = label;
      _showBubble = false;
      _showAi = false;
    });
    await _chipPulse.forward(from: 0);
    await Future<void>.delayed(const Duration(milliseconds: 100));
    if (!mounted) return;
    setState(() => _showBubble = true);
    await _bubble.forward(from: 0);
    await Future<void>.delayed(const Duration(milliseconds: 70));
    if (!mounted) return;
    setState(() => _showAi = true);
    // LightSweep ×2
    await _sweep.forward(from: 0);
    await Future<void>.delayed(const Duration(milliseconds: 120));
    if (!mounted) return;
    await _sweep.forward(from: 0);
  }

  @override
  void dispose() {
    _intro.dispose();
    _chipPulse.dispose();
    _bubble.dispose();
    _sweep.dispose();
    _keyboard.dispose();
    _focus.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;
    final keyboardOpen = bottomInset > 0 || _keyboard.value > 0;

    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [DsTokens.coachTop, DsTokens.coachBottom],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              AnimatedOpacity(
                duration: const Duration(milliseconds: 280),
                opacity: _showChrome ? 1 : 0,
                child: _TopBar(onBack: () => Navigator.of(context).maybePop()),
              ),
              Expanded(
                child: Stack(
                  children: [
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 180),
                      opacity: _greetingVisible ? 1 : 0,
                      child: AnimatedSlide(
                        duration: const Duration(milliseconds: 180),
                        offset: _greetingVisible
                            ? Offset.zero
                            : const Offset(0, -0.08),
                        child: _GreetingBlock(
                          intro: _intro,
                          line1: _line1,
                          line2: _line2,
                          showTip: _showTip,
                          showAi: _showAi,
                          sweep: _sweep,
                        ),
                      ),
                    ),
                    if (_showBubble && _bubbleText != null)
                      Positioned(
                        top: 12,
                        right: 16,
                        child: ScaleTransition(
                          scale: CurvedAnimation(
                            parent: _bubble,
                            curve: Curves.easeOutBack,
                          ),
                          child: FadeTransition(
                            opacity: _bubble,
                            child: _UserBubble(text: _bubbleText!),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              AnimatedOpacity(
                duration: const Duration(milliseconds: 280),
                opacity: _showChrome ? 1 : 0,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedSize(
                      duration: const Duration(milliseconds: 100),
                      curve: Curves.easeOut,
                      child: _showChips && !keyboardOpen
                          ? _ChipRow(
                              chips: _chips,
                              pulsing: _pulsingChip,
                              pulse: _chipPulse,
                              onTap: _onChipTap,
                            )
                          : const SizedBox(width: double.infinity, height: 0),
                    ),
                    _Composer(
                      focusNode: _focus,
                      controller: _controller,
                      onSend: () {
                        final t = _controller.text.trim();
                        if (t.isEmpty) return;
                        _onChipTap(t);
                        _controller.clear();
                        _focus.unfocus();
                      },
                    ),
                    SizedBox(height: keyboardOpen ? 8 : 12),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 4, 16, 4),
      child: Row(
        children: [
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          ),
          Text(
            '✦  Plan Coach',
            style: GoogleFonts.nunito(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: DsTokens.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _GreetingBlock extends StatelessWidget {
  const _GreetingBlock({
    required this.intro,
    required this.line1,
    required this.line2,
    required this.showTip,
    required this.showAi,
    required this.sweep,
  });

  final AnimationController intro;
  final String line1;
  final String line2;
  final bool showTip;
  final bool showAi;
  final AnimationController sweep;

  @override
  Widget build(BuildContext context) {
    final starT = CurvedAnimation(
      parent: intro,
      curve: const Interval(0.0, 0.125, curve: Curves.easeOut),
    );

    return Align(
      alignment: Alignment.center,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            FadeTransition(
              opacity: starT,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 0.35),
                  end: Offset.zero,
                ).animate(starT),
                child: _StarBadge(sweep: sweep, active: showAi),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              line1.isEmpty ? ' ' : line1,
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(
                fontSize: 34,
                fontWeight: FontWeight.w800,
                height: 1.15,
                color: DsTokens.textPrimary,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              line2.isEmpty ? ' ' : line2,
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                height: 1.25,
                color: DsTokens.textPrimary,
              ),
            ),
            const SizedBox(height: 14),
            AnimatedOpacity(
              duration: const Duration(milliseconds: 400),
              opacity: showTip ? 1 : 0,
              child: AnimatedSlide(
                duration: const Duration(milliseconds: 400),
                offset: showTip ? Offset.zero : const Offset(0, 0.2),
                child: Text(
                  'Tell me one goal and a timeframe —\nI’ll draft a precise plan.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    height: 1.4,
                    color: DsTokens.textSecondary,
                  ),
                ),
              ),
            ),
            if (showAi) ...[
              const SizedBox(height: 20),
              Text(
                'Generating…',
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: DsTokens.accent,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _StarBadge extends StatelessWidget {
  const _StarBadge({required this.sweep, required this.active});

  final AnimationController sweep;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: sweep,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: [
            child!,
            if (active)
              ClipOval(
                child: SizedBox(
                  width: 56,
                  height: 56,
                  child: Transform.translate(
                    offset: Offset(-60 + 120 * sweep.value, 0),
                    child: Transform.rotate(
                      angle: -0.6,
                      child: Container(
                        width: 28,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.white.withValues(alpha: 0),
                              Colors.white.withValues(alpha: 0.95),
                              const Color(0xFF7DD3FC).withValues(alpha: 0.85),
                              Colors.white.withValues(alpha: 0),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        );
      },
      child: Container(
        width: 56,
        height: 56,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.white.withValues(alpha: 0.7),
          boxShadow: const [
            BoxShadow(
              color: Color(0x1A007AFF),
              blurRadius: 16,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Text(
          '✦',
          style: GoogleFonts.nunito(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: DsTokens.accent,
          ),
        ),
      ),
    );
  }
}

class _UserBubble extends StatelessWidget {
  const _UserBubble({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 220),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: DsTokens.accent,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(18),
          topRight: Radius.circular(18),
          bottomLeft: Radius.circular(18),
          bottomRight: Radius.circular(6),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x33007AFF),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Text(
        text,
        style: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
      ),
    );
  }
}

class _ChipRow extends StatelessWidget {
  const _ChipRow({
    required this.chips,
    required this.pulsing,
    required this.pulse,
    required this.onTap,
  });

  final List<String> chips;
  final String? pulsing;
  final AnimationController pulse;
  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
        scrollDirection: Axis.horizontal,
        itemCount: chips.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final label = chips[i];
          final isPulse = pulsing == label;
          return AnimatedBuilder(
            animation: pulse,
            builder: (context, child) {
              final scale = isPulse
                  ? 1 + 0.08 * math.sin(pulse.value * math.pi)
                  : 1.0;
              return Transform.scale(scale: scale, child: child);
            },
            child: ActionChip(
              onPressed: () => onTap(label),
              backgroundColor: Colors.white,
              side: const BorderSide(color: DsTokens.border),
              label: Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: DsTokens.textPrimary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _Composer extends StatelessWidget {
  const _Composer({
    required this.focusNode,
    required this.controller,
    required this.onSend,
  });

  final FocusNode focusNode;
  final TextEditingController controller;
  final VoidCallback onSend;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(999),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x14000000),
                    blurRadius: 10,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: TextField(
                focusNode: focusNode,
                controller: controller,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => onSend(),
                style: GoogleFonts.nunito(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
                decoration: InputDecoration(
                  isCollapsed: true,
                  border: InputBorder.none,
                  hintText: 'e.g. Lose 5 kg in 7 weeks',
                  hintStyle: GoogleFonts.nunito(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: DsTokens.textTertiary,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Material(
            color: DsTokens.accent,
            shape: const CircleBorder(),
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: onSend,
              child: const SizedBox(
                width: 48,
                height: 48,
                child: Icon(Icons.arrow_upward_rounded, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
