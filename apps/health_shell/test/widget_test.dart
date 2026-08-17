import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:health_shell/coach/ai_plan_coach_meet.dart';
import 'package:health_shell/coach/demo_script.dart';
import 'package:health_shell/main.dart';

Finder chip(String label) => find.byKey(ValueKey('chip-$label'));

Future<void> pumpUntil(
  WidgetTester tester,
  Finder finder, {
  Duration step = const Duration(milliseconds: 400),
  int maxSteps = 80,
}) async {
  for (var i = 0; i < maxSteps; i++) {
    await tester.pump(step);
    if (finder.evaluate().isNotEmpty) return;
  }
  // One last pump for clearer failures.
  await tester.pump(step);
}

void main() {
  testWidgets('Intro then keyboard focus hides chips and shows keys', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(const HealthShellApp());
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 7200));

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

    // Tap blank content area (above the keyboard) dismisses it.
    expect(find.byKey(const ValueKey('dismiss-keyboard-area')), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('dismiss-keyboard-area')));
    await tester.pump();
    expect(find.byKey(const ValueKey('dismiss-keyboard-area')), findsNothing);
    await tester.pump(const Duration(milliseconds: 450));
    // Keyboard finished closing — keys no longer hit-testable.
    await tester.tap(find.text('Q'), warnIfMissed: false);
    await tester.pump();
    expect(find.text('lo'), findsOneWidget); // unchanged — Q did not type
  });

  testWidgets('Goal chip sends into chat then AI streams a reply', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(const HealthShellApp());
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 7200));

    await tester.tap(chip(WeightLoss15DayScript.goalChip));
    await tester.pump();

    expect(find.text(WeightLoss15DayScript.goalChip), findsWidgets);
    // Thinking: white bubble with Plan Coach + rotating star.
    expect(find.text('Plan Coach'), findsOneWidget);
    expect(find.text('Generating…'), findsNothing);

    await pumpUntil(tester, chip('3 days / week · Home only'));
    expect(chip('3 days / week · Home only'), findsOneWidget);
  });

  testWidgets('Confirm runs plan thinking then shows week cards', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(const HealthShellApp());
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 7200));

    await tester.tap(chip(WeightLoss15DayScript.goalChip));
    await pumpUntil(tester, chip('3 days / week · Home only'));

    await tester.tap(chip('3 days / week · Home only'));
    await pumpUntil(tester, chip(WeightLoss15DayScript.confirmChip));

    await tester.tap(chip(WeightLoss15DayScript.confirmChip));
    await tester.pump();

    // Thinking copy appears (may need a couple frames).
    await pumpUntil(
      tester,
      find.text(WeightLoss15DayScript.planThinkingLines.first),
      maxSteps: 20,
    );

    await pumpUntil(tester, find.text('Week 1'), maxSteps: 60);
    expect(find.text('Your 15-day plan'), findsOneWidget);
    expect(find.text('Week 1'), findsOneWidget);
    expect(find.text('Week 2'), findsOneWidget);

    // Mood chips appear; Today closing line waits for a tap.
    await pumpUntil(tester, chip(WeightLoss15DayScript.likeChip));
    expect(chip(WeightLoss15DayScript.likeChip), findsOneWidget);
    expect(chip(WeightLoss15DayScript.dislikeChip), findsOneWidget);
    expect(
      find.textContaining('added your generated plan to the Today page'),
      findsNothing,
    );

    await tester.tap(chip(WeightLoss15DayScript.likeChip));
    await tester.pump();
    await pumpUntil(
      tester,
      find.text(WeightLoss15DayScript.planReadyMessage),
      maxSteps: 120,
    );
    // Drain stream ticks so no FakeTimer is left pending.
    await tester.pump(const Duration(milliseconds: 800));
    expect(
      find.text(WeightLoss15DayScript.planReadyMessage),
      findsOneWidget,
    );

    // Order: plan cards → mood user bubble → Today coach reply.
    final planY = tester.getTopLeft(find.text('Your 15-day plan')).dy;
    final moodY = tester.getTopLeft(find.textContaining("That’s it!")).dy;
    final todayY = tester
        .getTopLeft(
          find.textContaining('added your generated plan to the Today page'),
        )
        .dy;
    expect(planY < moodY, isTrue);
    expect(moodY < todayY, isTrue);

    // Expand in-place (same card width) — detail appears without a new route.
    final week1 = find.byKey(const ValueKey('week-card-w1'));
    await tester.ensureVisible(week1);
    await tester.pump();
    await tester.tap(week1);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 350));
    expect(find.text('Day 1 · Mon'), findsOneWidget);
  });
}
