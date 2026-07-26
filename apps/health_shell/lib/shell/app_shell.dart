import 'package:flutter/material.dart';

import '../screens/devices_screen.dart';
import '../screens/exercise_screen.dart';
import '../screens/health_screen.dart';
import '../screens/today_screen.dart';
import 'bottom_nav.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  AppTab _tab = AppTab.today;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: IndexedStack(
          index: _tab.index,
          children: const [
            TodayScreen(),
            HealthScreen(),
            ExerciseScreen(),
            DevicesScreen(),
          ],
        ),
      ),
      bottomNavigationBar: DsBottomNav(
        active: _tab,
        onChanged: (tab) => setState(() => _tab = tab),
      ),
    );
  }
}
