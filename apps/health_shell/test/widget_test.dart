import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:health_shell/coach/ai_plan_coach_meet.dart';
import 'package:health_shell/coach/demo_script.dart';
import 'package:health_shell/main.dart';

void main() {
  testWidgets('Intro then keyboard focus hides chips and shows keys', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(const HealthShellApp());
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 4500));

    expect(find.text(AiPlanCoachMeetPage.buildMarker), findsOneWidget);
    expect(find.text('Hi Sifan,'), findsWidgets);
    expect(find.text(WeightLoss15DayScript.goalChip), findsOneWidget);

    await tester.tap(find.byType(TextField));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 120));

    // Chips vanish at ~100ms (step-end).
    expect(find.text(WeightLoss15DayScript.goalChip), findsNothing);

    await tester.pump(const Duration(milliseconds: 350));
    expect(find.text('return'), findsOneWidget);
    expect(find.text('Q'), findsOneWidget);

    // Typing a letter must NOT dismiss the keyboard.
    await tester.tap(find.text('L'));
    await tester.pump();
    await tester.tap(find.text('O'));
    await tester.pump();
    expect(find.text('return'), findsOneWidget);
    expect(find.text('lo'), findsOneWidget);
  });

  testWidgets('Goal chip sends into chat then AI streams a reply', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(const HealthShellApp());
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 4500));

    await tester.tap(find.text(WeightLoss15DayScript.goalChip));
    await tester.pump();

    // Optimistic user bubble + compact Coach thinking (light sweep, no big star).
    expect(find.text(WeightLoss15DayScript.goalChip), findsWidgets);
    expect(find.text('Coach'), findsOneWidget);
    expect(find.text('Generating…'), findsOneWidget);

    // Finish generating window.
    await tester.pump(const Duration(milliseconds: 900));
    expect(find.text('Generating…'), findsNothing);
    expect(find.text('Coach'), findsOneWidget);

    // Stream enough ticks for the first line to appear.
    await tester.pump(const Duration(milliseconds: 1200));
    expect(find.textContaining('lose 3 kg in 15 days'), findsWidgets);

    // Drain remaining stream timers so the test ends cleanly.
    await tester.pump(const Duration(seconds: 20));
    expect(find.text('3 days / week · Home only'), findsOneWidget);
  });
}
