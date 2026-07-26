import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Displays one thinking line with the given opacity (parent drives the cycle).
class PlanThinkingLineView extends StatelessWidget {
  const PlanThinkingLineView({
    super.key,
    required this.line,
    required this.opacity,
  });

  final String line;
  final double opacity;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 2, top: 4, bottom: 20),
      child: Opacity(
        opacity: opacity.clamp(0.0, 1.0),
        child: Text(
          line,
          style: GoogleFonts.nunito(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF6B6B73),
            height: 1.4,
          ),
        ),
      ),
    );
  }
}
