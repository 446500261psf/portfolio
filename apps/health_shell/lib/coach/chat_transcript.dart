import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_models.dart';

class ChatTranscript extends StatelessWidget {
  const ChatTranscript({
    super.key,
    required this.messages,
    required this.generating,
    required this.sweep,
    required this.scrollController,
  });

  final List<ChatMessage> messages;
  final bool generating;
  final Animation<double> sweep;
  final ScrollController scrollController;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: scrollController,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      itemCount: messages.length + (generating ? 1 : 0),
      itemBuilder: (context, i) {
        if (generating && i == messages.length) {
          return _GeneratingBlock(sweep: sweep);
        }
        final m = messages[i];
        if (m.role == ChatRole.user) {
          return _UserBubble(text: m.text);
        }
        return _AssistantBubble(text: m.text, streaming: m.isStreaming);
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

class _AssistantBubble extends StatelessWidget {
  const _AssistantBubble({required this.text, required this.streaming});

  final String text;
  final bool streaming;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 320),
          padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE5E5EB)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '✦',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF17ACDA),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Coach',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF6B6B73),
                    ),
                  ),
                  if (streaming) ...[
                    const SizedBox(width: 6),
                    SizedBox(
                      width: 8,
                      height: 8,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: const Color(0xFF007AFF),
                          borderRadius: BorderRadius.circular(99),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
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

class _GeneratingBlock extends StatelessWidget {
  const _GeneratingBlock({required this.sweep});

  final Animation<double> sweep;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 24, bottom: 16),
      child: Column(
        children: [
          SizedBox(
            width: 120,
            height: 120,
            child: AnimatedBuilder(
              animation: sweep,
              builder: (context, child) {
                return Stack(
                  alignment: Alignment.center,
                  children: [
                    child!,
                    ClipOval(
                      child: SizedBox(
                        width: 110,
                        height: 110,
                        child: Transform.translate(
                          offset: Offset(-80 + 160 * sweep.value, 0),
                          child: Transform.rotate(
                            angle: -0.55,
                            child: Container(
                              width: 36,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.white.withValues(alpha: 0),
                                    Colors.white.withValues(alpha: 0.9),
                                    const Color(0xFF7DD3FC)
                                        .withValues(alpha: 0.75),
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
              child: CustomPaint(
                size: const Size(64, 64),
                painter: _DarkSparklePainter(),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Generating…',
            style: GoogleFonts.nunito(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF6B6B73),
            ),
          ),
        ],
      ),
    );
  }
}

class _DarkSparklePainter extends CustomPainter {
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
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFF11566C), Color(0xFFDDF2F8)],
      ).createShader(Offset.zero & size);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
