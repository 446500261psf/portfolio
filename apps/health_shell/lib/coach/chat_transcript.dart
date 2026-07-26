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
          return _CoachThinkingRow(sweep: sweep);
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
                  const _CoachLabel(),
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

class _CoachLabel extends StatelessWidget {
  const _CoachLabel();

  @override
  Widget build(BuildContext context) {
    return Row(
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
      ],
    );
  }
}

/// Thinking: only ✦ Coach, with a visible highlight sweep. No status copy.
class _CoachThinkingRow extends StatelessWidget {
  const _CoachThinkingRow({required this.sweep});

  final Animation<double> sweep;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Align(
        alignment: Alignment.centerLeft,
        child: AnimatedBuilder(
          animation: sweep,
          builder: (context, child) {
            // Ease so the bright band spends less time idle at edges.
            final t = Curves.easeInOut.transform(sweep.value);
            return ShaderMask(
              blendMode: BlendMode.srcIn,
              shaderCallback: (bounds) {
                // Narrow cyan→white band racing left→right across glyphs.
                final start = -1.2 + 2.8 * t;
                return LinearGradient(
                  begin: Alignment(start, -0.4),
                  end: Alignment(start + 0.85, 0.4),
                  colors: const [
                    Color(0xFF6B6B73),
                    Color(0xFF6B6B73),
                    Color(0xFF7DD3FC),
                    Color(0xFFFFFFFF),
                    Color(0xFF7DD3FC),
                    Color(0xFF6B6B73),
                    Color(0xFF6B6B73),
                  ],
                  stops: const [0.0, 0.32, 0.44, 0.50, 0.56, 0.68, 1.0],
                ).createShader(bounds);
              },
              child: child,
            );
          },
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '✦',
                style: GoogleFonts.nunito(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                'Coach',
                style: GoogleFonts.nunito(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
