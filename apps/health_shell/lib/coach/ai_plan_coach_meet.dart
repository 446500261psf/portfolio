import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_models.dart';
import 'chat_transcript.dart';
import 'demo_script.dart';

/// Meet + Chat + Plan flow:
/// 1) Intro Motion — Figma `133:728`
/// 2) Keyboard Focus — Figma `136:695`
/// 3) Chip/Send → user bubble → Coach shimmer → stream reply
/// 4) Confirm → plan thinking lines → weekly cards (in-place expand)
class AiPlanCoachMeetPage extends StatefulWidget {
  const AiPlanCoachMeetPage({super.key});

  static const buildMarker = 'meet-v15';

  @override
  State<AiPlanCoachMeetPage> createState() => _AiPlanCoachMeetPageState();
}

class _AiPlanCoachMeetPageState extends State<AiPlanCoachMeetPage>
    with TickerProviderStateMixin {
  static const _hiFull = 'Hi Sifan,';
  static const _coachFull = 'i am your personal coach';
  static const _tipFull =
      'In one sentence, tell me the goal and the timeframe — I’ll build a detailed plan for you.';

  static const _introDuration = Duration(milliseconds: 4400);
  static const _kbDuration = Duration(milliseconds: 450);
  static const _kbLift = 202.0;

  // Intro fractions (4.4s)
  static const _starEnd = 0.125;
  static const _hiStart = 0.14773;
  static const _hiEnd = 0.32955;
  static const _coachStart = 0.35227;
  static const _coachEnd = 0.57955;
  static const _tipStart = 0.60227;
  static const _chromeStart = 0.76136;
  static const _chromeEnd = 0.89773;

  // Keyboard focus fractions (0.45s) from Figma motion
  static const _kbChipCut = 0.22222; // ~100ms — chips vanish (step)
  static const _kbSlideEnd = 0.44444; // ~200ms — keyboard / composer settle

  late final AnimationController _intro;
  late final AnimationController _kb;
  final _focus = FocusNode();
  final _controller = TextEditingController();
  final _scroll = ScrollController();

  /// Keyboard stays up until return / explicit hide — not tied to FocusNode.
  bool _kbOpen = false;

  CoachPhase _phase = CoachPhase.meet;
  ChatTurnState _turn = ChatTurnState.idle;
  final List<ChatMessage> _messages = [];
  List<String> _followUps = [];
  List<WeekPlan> _weeks = [];
  bool _planThinking = false;
  String? _planThinkingLine;
  double _planThinkingOpacity = 0;
  int _sendSeq = 0;

  bool get _introDone => _intro.value >= _chromeEnd;
  bool get _busy =>
      _turn == ChatTurnState.generating ||
      _turn == ChatTurnState.streaming ||
      _turn == ChatTurnState.planThinking;

  @override
  void initState() {
    super.initState();
    _intro = AnimationController(vsync: this, duration: _introDuration)
      ..forward();
    _kb = AnimationController(vsync: this, duration: _kbDuration);
  }

  @override
  void dispose() {
    _intro.dispose();
    _kb.dispose();
    _focus.dispose();
    _controller.dispose();
    _scroll.dispose();
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

  void _openKeyboard() {
    if (!_introDone) return;
    setState(() => _kbOpen = true);
    _focus.requestFocus();
    _kb.forward();
  }

  void _hideKeyboard() {
    setState(() => _kbOpen = false);
    _focus.unfocus();
    _kb.reverse();
  }

  void _insertText(String ch) {
    final t0 = _controller.text;
    final sel = _controller.selection;
    final start = sel.isValid ? sel.start : t0.length;
    final end = sel.isValid ? sel.end : t0.length;
    final next = t0.replaceRange(start, end, ch);
    _controller.value = TextEditingValue(
      text: next,
      selection: TextSelection.collapsed(offset: start + ch.length),
    );
    // Keep field focused after mock-key taps.
    if (!_focus.hasFocus) _focus.requestFocus();
  }

  void _backspace() {
    final t0 = _controller.text;
    if (t0.isEmpty) return;
    final sel = _controller.selection;
    if (sel.isValid && !sel.isCollapsed) {
      final next = t0.replaceRange(sel.start, sel.end, '');
      _controller.value = TextEditingValue(
        text: next,
        selection: TextSelection.collapsed(offset: sel.start),
      );
    } else {
      final pos = sel.isValid && sel.baseOffset > 0
          ? sel.baseOffset
          : t0.length;
      if (pos <= 0) return;
      final next = t0.replaceRange(pos - 1, pos, '');
      _controller.value = TextEditingValue(
        text: next,
        selection: TextSelection.collapsed(offset: pos - 1),
      );
    }
    if (!_focus.hasFocus) _focus.requestFocus();
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scroll.hasClients) return;
      _scroll.animateTo(
        _scroll.position.maxScrollExtent,
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOut,
      );
    });
  }

  void _onReturnKey() {
    final t = _controller.text.trim();
    if (t.isNotEmpty && !_busy) {
      unawaited(_sendMessage(t));
    } else {
      _hideKeyboard();
    }
  }

  Future<void> _runPlanThinkingCycle(int seq) async {
    const fadeMs = 280;
    const hold = Duration(milliseconds: 1100);
    final lines = WeightLoss15DayScript.planThinkingLines;
    const steps = 8;
    final stepWait = Duration(milliseconds: fadeMs ~/ steps);

    for (final line in lines) {
      if (!mounted || seq != _sendSeq) return;
      setState(() {
        _planThinkingLine = line;
        _planThinkingOpacity = 0;
      });
      for (var s = 1; s <= steps; s++) {
        if (!mounted || seq != _sendSeq) return;
        await Future<void>.delayed(stepWait);
        setState(() => _planThinkingOpacity = s / steps);
      }
      await Future<void>.delayed(hold);
      if (!mounted || seq != _sendSeq) return;
      for (var s = steps - 1; s >= 0; s--) {
        if (!mounted || seq != _sendSeq) return;
        await Future<void>.delayed(stepWait);
        setState(() => _planThinkingOpacity = s / steps);
      }
    }

    if (!mounted || seq != _sendSeq) return;
    setState(() {
      _planThinking = false;
      _planThinkingLine = null;
      _planThinkingOpacity = 0;
      _phase = CoachPhase.planReady;
      _turn = ChatTurnState.awaitingUser;
      _weeks = List<WeekPlan>.of(WeightLoss15DayScript.weeks);
      _followUps = const [];
    });
    _scrollToEnd();
  }

  Future<void> _startPlanGeneration({
    required int seq,
    required String userId,
    required String text,
  }) async {
    setState(() {
      _phase = CoachPhase.planGenerating;
      _followUps = [];
      _weeks = [];
      _messages.add(
        ChatMessage(id: userId, role: ChatRole.user, text: text),
      );
      _turn = ChatTurnState.planThinking;
      _planThinking = true;
      _planThinkingLine = WeightLoss15DayScript.planThinkingLines.first;
      _planThinkingOpacity = 0;
    });
    _scrollToEnd();
    await _runPlanThinkingCycle(seq);
  }

  Future<void> _sendMessage(String raw) async {
    final text = raw.trim();
    if (text.isEmpty || _busy) return;

    final seq = ++_sendSeq;
    _hideKeyboard();
    _controller.clear();

    final userTurn =
        _messages.where((m) => m.role == ChatRole.user).length + 1;
    final userId = 'u-$userTurn';
    final assistantId = 'a-$userTurn';

    // Confirm → plan generating (light on Coach + thinking lines).
    if (WeightLoss15DayScript.isPlanConfirm(text)) {
      await _startPlanGeneration(seq: seq, userId: userId, text: text);
      return;
    }

    setState(() {
      _phase = CoachPhase.chat;
      _followUps = [];
      _messages.add(
        ChatMessage(id: userId, role: ChatRole.user, text: text),
      );
      _turn = ChatTurnState.generating;
    });
    _scrollToEnd();

    await Future<void>.delayed(const Duration(milliseconds: 850));
    if (!mounted || seq != _sendSeq) return;

    final beat = WeightLoss15DayScript.beatForUserTurn(userTurn, text);

    setState(() {
      _turn = ChatTurnState.streaming;
      _messages.add(
        ChatMessage(
          id: assistantId,
          role: ChatRole.assistant,
          text: '',
          isStreaming: true,
        ),
      );
    });
    _scrollToEnd();

    final full = beat.assistantFull;
    // ~35 chars/sec — Cursor-like stream feel.
    const tick = Duration(milliseconds: 28);
    for (var i = 1; i <= full.length; i++) {
      if (!mounted || seq != _sendSeq) return;
      await Future<void>.delayed(tick);
      setState(() {
        final idx = _messages.indexWhere((m) => m.id == assistantId);
        if (idx >= 0) {
          _messages[idx] = _messages[idx].copyWith(text: full.substring(0, i));
        }
      });
      if (i % 12 == 0 || i == full.length) _scrollToEnd();
    }

    if (!mounted || seq != _sendSeq) return;
    setState(() {
      final idx = _messages.indexWhere((m) => m.id == assistantId);
      if (idx >= 0) {
        _messages[idx] = _messages[idx].copyWith(isStreaming: false);
      }
      _turn = ChatTurnState.awaitingUser;
      _followUps = List<String>.of(beat.followUps);
    });
    _scrollToEnd();
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
      // Custom keyboard handles lift — don't also fight the OS inset.
      resizeToAvoidBottomInset: false,
      body: DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFD1F0F8), Color(0xFFF8F7F6)],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: AnimatedBuilder(
            animation: Listenable.merge([_intro, _kb]),
            builder: (context, _) {
              final t = _intro.value;
              final k = _kb.value;
              final inChat = _phase != CoachPhase.meet;

              final star = _ramp(t, 0, _starEnd);
              final hiP = _ramp(t, _hiStart, _hiEnd);
              final coachP = _ramp(t, _coachStart, _coachEnd);
              final tip = _ramp(t, _tipStart, _tipStart + 0.136);
              final chrome = inChat ? 1.0 : _ramp(t, _chromeStart, _chromeEnd);

              final hiText = t >= _hiEnd ? _hiFull : _typed(_hiFull, hiP);
              final coachText =
                  t >= _coachEnd ? _coachFull : _typed(_coachFull, coachP);

              // Keyboard focus (136:695)
              final chipsGone = k >= _kbChipCut;
              final middleFade = _ramp(k, _kbChipCut, _kbSlideEnd); // 0→1 fade out
              final middleOpacity = inChat ? 1.0 : (1 - middleFade);
              final lift = _kbLift * _ramp(k, _kbChipCut, _kbSlideEnd);
              final kbOpacity = k >= _kbChipCut ? 1.0 : 0.0;
              final kbDy = _kbLift * (1 - _ramp(k, _kbChipCut, _kbSlideEnd));

              final composerChips = inChat
                  ? _followUps
                  : WeightLoss15DayScript.chips;
              final showChips = !_busy &&
                  composerChips.isNotEmpty &&
                  !chipsGone &&
                  (inChat
                      ? _turn == ChatTurnState.awaitingUser
                      : chrome > 0.5 && _introDone);

              return Stack(
                children: [
                  Column(
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
                        child: Opacity(
                          opacity: chrome > 0 || inChat ? middleOpacity : 1,
                          child: inChat
                              ? ChatTranscript(
                                  messages: _messages,
                                  generating:
                                      _turn == ChatTurnState.generating,
                                  planThinking: _planThinking,
                                  planThinkingLine: _planThinkingLine,
                                  planThinkingOpacity: _planThinkingOpacity,
                                  weeks: _weeks,
                                  scrollController: _scroll,
                                )
                              : LayoutBuilder(
                                  builder: (context, constraints) {
                                    return SingleChildScrollView(
                                      physics:
                                          const NeverScrollableScrollPhysics(),
                                      child: ConstrainedBox(
                                        constraints: BoxConstraints(
                                          minHeight: constraints.maxHeight,
                                        ),
                                        child: Padding(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 20,
                                          ),
                                          child: Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              SizedBox(
                                                height: 96,
                                                child: Opacity(
                                                  opacity: star,
                                                  child: Transform.translate(
                                                    offset: Offset(
                                                      0,
                                                      28 * (1 - star),
                                                    ),
                                                    child: const Center(
                                                      child: _SparkleStar(
                                                        size: 64,
                                                      ),
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
                                                  offset: Offset(
                                                    0,
                                                    18 * (1 - tip),
                                                  ),
                                                  child: Text(
                                                    _tipFull,
                                                    textAlign: TextAlign.center,
                                                    style: GoogleFonts.nunito(
                                                      fontSize: 14,
                                                      height: 1.45,
                                                      fontWeight:
                                                          FontWeight.w500,
                                                      color: const Color(
                                                        0xFF6B6B73,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(height: 8),
                                              Text(
                                                AiPlanCoachMeetPage
                                                    .buildMarker,
                                                style: GoogleFonts.nunito(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w600,
                                                  color: const Color(
                                                    0xFF9CA3AF,
                                                  ),
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
                      // Composer lifts with keyboard (translate -202), matching Figma.
                      Opacity(
                        opacity: chrome,
                        child: Transform.translate(
                          offset: Offset(0, 12 * (1 - chrome) - lift),
                          child: Padding(
                            padding: EdgeInsets.only(
                              bottom: 12 + MediaQuery.paddingOf(context).bottom,
                            ),
                            child: _Composer(
                              chips: composerChips,
                              showChips: showChips,
                              focusNode: _focus,
                              controller: _controller,
                              keyboardOpen: _kbOpen,
                              canSend: !_busy,
                              onInputTap: _openKeyboard,
                              onSend: () {
                                if (!_introDone && !inChat) return;
                                unawaited(_sendMessage(_controller.text));
                              },
                              onChipTap: (label) {
                                if (_busy) return;
                                if (!_introDone && !inChat) return;
                                // Chip = immediate send (Cursor-style quick reply).
                                unawaited(_sendMessage(label));
                              },
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  // Mock iOS keyboard — stays up while _kbOpen (not tied to focus).
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: IgnorePointer(
                      ignoring: kbOpacity < 0.5,
                      child: Opacity(
                        opacity: kbOpacity,
                        child: Transform.translate(
                          offset: Offset(0, kbDy),
                          child: _IosKeyboard(
                            onKey: _insertText,
                            onBackspace: _backspace,
                            onHide: _onReturnKey,
                          ),
                        ),
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
        Opacity(
          opacity: 0,
          child: Text(reserve, textAlign: TextAlign.center, style: style),
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

    final paint = Paint()
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
            const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _SparkleStar(size: 18),
                SizedBox(width: 6),
                Text(
                  'Premium',
                  style: TextStyle(
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
    required this.keyboardOpen,
    required this.canSend,
    required this.onInputTap,
    required this.onChipTap,
    required this.onSend,
  });

  final List<String> chips;
  final bool showChips;
  final FocusNode focusNode;
  final TextEditingController controller;
  final bool keyboardOpen;
  final bool canSend;
  final VoidCallback onInputTap;
  final ValueChanged<String> onChipTap;
  final VoidCallback onSend;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showChips)
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: chips.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final label = chips[i];
                  return GestureDetector(
                    key: ValueKey('chip-$label'),
                    behavior: HitTestBehavior.opaque,
                    onTap: () => onChipTap(label),
                    child: Container(
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
                        label,
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          height: 16 / 12,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.012,
                          color: const Color(0xFF6B7280),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          if (showChips) const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 10, 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(
                color: keyboardOpen
                    ? const Color(0xFF007AFF)
                    : const Color(0xFFE5E5EB),
                width: keyboardOpen ? 1.5 : 1,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    focusNode: focusNode,
                    controller: controller,
                    enabled: canSend,
                    // Real typing: laptop keyboard + mock iOS keys both work.
                    readOnly: false,
                    autofocus: false,
                    showCursor: true,
                    cursorColor: const Color(0xFF007AFF),
                    keyboardType: TextInputType.text,
                    textInputAction: TextInputAction.send,
                    onTap: onInputTap,
                    onTapOutside: (_) {
                      // Keep session open — only return / send dismisses.
                    },
                    onSubmitted: (_) {
                      if (canSend) onSend();
                    },
                    style: GoogleFonts.nunito(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF111827),
                    ),
                    decoration: InputDecoration(
                      isCollapsed: true,
                      border: InputBorder.none,
                      hintText: 'e.g. Lose 3 kg in 15 days',
                      hintStyle: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF6B6B73),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                GestureDetector(
                  onTap: canSend ? onSend : null,
                  child: Opacity(
                    opacity: canSend ? 1 : 0.4,
                    child: Container(
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

/// Mid-fi iOS keyboard matching Figma `Keyboard/iOS` on `136:695`.
class _IosKeyboard extends StatelessWidget {
  const _IosKeyboard({
    required this.onKey,
    required this.onBackspace,
    required this.onHide,
  });

  final ValueChanged<String> onKey;
  final VoidCallback onBackspace;
  final VoidCallback onHide;

  static const _row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  static const _row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  static const _row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.paddingOf(context).bottom;
    return Container(
      color: const Color(0xFFD1D5DB),
      padding: EdgeInsets.fromLTRB(4, 10, 4, 6 + bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _keyRow(_row1),
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: _keyRow(_row2),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              _specialKey('⇧', width: 40),
              const SizedBox(width: 5),
              ..._row3.expand((k) => [
                    Expanded(child: _letterKey(k)),
                    const SizedBox(width: 5),
                  ]),
              _specialKey('⌫', width: 40, onTap: onBackspace),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              _specialKey('123', width: 40),
              const SizedBox(width: 5),
              Expanded(
                child: _specialKey('space', onTap: () => onKey(' ')),
              ),
              const SizedBox(width: 5),
              _specialKey(
                'return',
                width: 78,
                fill: const Color(0xFF738094),
                color: Colors.white,
                onTap: onHide,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _keyRow(List<String> keys) {
    return Row(
      children: [
        for (var i = 0; i < keys.length; i++) ...[
          if (i > 0) const SizedBox(width: 5),
          Expanded(child: _letterKey(keys[i])),
        ],
      ],
    );
  }

  Widget _letterKey(String label) {
    return _specialKey(
      label,
      onTap: () => onKey(label.toLowerCase()),
    );
  }

  Widget _specialKey(
    String label, {
    double? width,
    Color fill = Colors.white,
    Color color = const Color(0xFF111827),
    VoidCallback? onTap,
  }) {
    final child = Material(
      color: fill,
      borderRadius: BorderRadius.circular(5),
      child: InkWell(
        // Use onTapDown so the key feels instant and doesn't steal a frame
        // that would clear TextField selection oddly.
        onTap: onTap,
        borderRadius: BorderRadius.circular(5),
        child: SizedBox(
          height: 42,
          width: width,
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: label.length > 1 ? 13 : 15,
                fontWeight: FontWeight.w500,
                color: color,
              ),
            ),
          ),
        ),
      ),
    );
    return width == null ? child : SizedBox(width: width, child: child);
  }
}
