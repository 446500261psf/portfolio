import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:health_shell/coach/ai_plan_coach_meet.dart';
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
    expect(find.text('High-intensity training plan'), findsOneWidget);

    await tester.tap(find.byType(TextField));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 120));

    // Chips vanish at ~100ms (step-end).
    expect(find.text('High-intensity training plan'), findsNothing);

    await tester.pump(const Duration(milliseconds: 350));
    expect(find.text('return'), findsOneWidget);
    expect(find.text('Q'), findsOneWidget);
  });
}
