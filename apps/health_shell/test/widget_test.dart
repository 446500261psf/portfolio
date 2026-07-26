import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:health_shell/coach/ai_plan_coach_meet.dart';
import 'package:health_shell/main.dart';

void main() {
  testWidgets('Meet intro finalizes full greeting copy', (tester) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(const HealthShellApp());
    await tester.pump(const Duration(milliseconds: 4200));

    expect(find.text('Premium'), findsOneWidget);
    expect(find.text('Hi Sifan,'), findsOneWidget);
    expect(find.text('i am your personal coach'), findsOneWidget);
    expect(find.text(AiPlanCoachMeetPage.buildMarker), findsOneWidget);
  });
}
