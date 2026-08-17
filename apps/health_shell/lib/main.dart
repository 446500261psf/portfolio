import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'coach/ai_plan_coach_meet.dart';
import 'shell/app_shell.dart';
import 'theme/app_theme.dart';
import 'theme/tokens.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const HealthShellApp());
}

class HealthShellApp extends StatelessWidget {
  const HealthShellApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Default: Figma Meet Intro (`133:728`). `?shell=1` opens 4-tab shell.
    final openShell = Uri.base.queryParameters['shell'] == '1';

    return MaterialApp(
      title: 'Health Shell · Design System',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      routes: {
        '/': (_) => _PhoneFrame(
              child: openShell
                  ? const AppShell()
                  : const AiPlanCoachMeetPage(),
            ),
        '/shell': (_) => const _PhoneFrame(child: AppShell()),
        '/coach': (_) =>
            const _PhoneFrame(child: AiPlanCoachMeetPage()),
      },
    );
  }
}

class _PhoneFrame extends StatelessWidget {
  const _PhoneFrame({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width <= DsTokens.screenWidth + 24) return child;

    return ColoredBox(
      color: const Color(0xFFE7E5E4),
      child: Center(
        child: Container(
          width: DsTokens.screenWidth,
          height: math.min(844, MediaQuery.sizeOf(context).height - 32),
          decoration: BoxDecoration(
            color: DsTokens.pageBg,
            borderRadius: BorderRadius.circular(28),
            boxShadow: const [
              BoxShadow(
                color: Color(0x33000000),
                blurRadius: 40,
                offset: Offset(0, 16),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: child,
        ),
      ),
    );
  }
}
