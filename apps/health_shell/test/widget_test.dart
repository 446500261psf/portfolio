import 'package:flutter_test/flutter_test.dart';
import 'package:health_shell/main.dart';

void main() {
  testWidgets('Meet intro loads Premium title', (tester) async {
    await tester.pumpWidget(const HealthShellApp());
    await tester.pump(const Duration(milliseconds: 4500));
    expect(find.text('Premium'), findsOneWidget);
    expect(find.textContaining('personal coach'), findsOneWidget);
  });
}
