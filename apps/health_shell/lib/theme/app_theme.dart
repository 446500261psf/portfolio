import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'tokens.dart';

ThemeData buildAppTheme() {
  final base = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: DsTokens.pageBg,
    colorScheme: ColorScheme.fromSeed(
      seedColor: DsTokens.accent,
      primary: DsTokens.accent,
      surface: DsTokens.surface,
    ),
  );

  // SF Compact Rounded stand-in: rounded geometric sans.
  final textTheme = GoogleFonts.nunitoTextTheme(base.textTheme).apply(
    bodyColor: DsTokens.textPrimary,
    displayColor: DsTokens.textPrimary,
  );

  return base.copyWith(
    textTheme: textTheme,
    appBarTheme: AppBarTheme(
      backgroundColor: DsTokens.pageBg,
      foregroundColor: DsTokens.textPrimary,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.nunito(
        fontSize: 28,
        fontWeight: FontWeight.w800,
        color: DsTokens.textPrimary,
      ),
    ),
  );
}
