import 'package:flutter_test/flutter_test.dart';
import 'package:health_shell/main.dart';

void main() {
  testWidgets('Today shell loads Plan Coach entry', (tester) async {
    await tester.pumpWidget(const HealthShellApp());
    expect(find.text('Good morning'), findsOneWidget);
    expect(find.textContaining('Plan Coach'), findsWidgets);
  });
}
