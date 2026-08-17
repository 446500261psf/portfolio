import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/tokens.dart';

enum AppTab { today, health, exercise, devices }

class DsBottomNav extends StatelessWidget {
  const DsBottomNav({
    super.key,
    required this.active,
    required this.onChanged,
  });

  final AppTab active;
  final ValueChanged<AppTab> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: DsTokens.surface,
        border: Border(top: BorderSide(color: DsTokens.border, width: 1)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 66,
          child: Row(
            children: [
              _item(AppTab.today, Icons.wb_sunny_outlined, Icons.wb_sunny, 'Today'),
              _item(AppTab.health, Icons.favorite_border, Icons.favorite, 'Health'),
              _item(AppTab.exercise, Icons.directions_run, Icons.directions_run, 'Exercise'),
              _item(AppTab.devices, Icons.watch_outlined, Icons.watch, 'Devices'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _item(AppTab tab, IconData outlined, IconData filled, String label) {
    final selected = active == tab;
    return Expanded(
      child: InkWell(
        onTap: () => onChanged(tab),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              decoration: BoxDecoration(
                color: selected ? DsTokens.accentSoft : Colors.transparent,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Icon(
                selected ? filled : outlined,
                size: 22,
                color: selected ? DsTokens.accent : DsTokens.textTertiary,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: selected ? DsTokens.accent : DsTokens.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
