enum ChatRole { user, assistant }

enum CoachPhase {
  meet,
  chat,
  planGenerating,
  planReady,
}

enum ChatTurnState {
  idle,
  generating,
  streaming,
  awaitingUser,
  planThinking,
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.role,
    required this.text,
    this.isStreaming = false,
  });

  final String id;
  final ChatRole role;
  final String text;
  final bool isStreaming;

  ChatMessage copyWith({String? text, bool? isStreaming}) {
    return ChatMessage(
      id: id,
      role: role,
      text: text ?? this.text,
      isStreaming: isStreaming ?? this.isStreaming,
    );
  }
}

class ScriptBeat {
  const ScriptBeat({
    required this.assistantFull,
    this.followUps = const [],
    this.nextKey,
  });

  final String assistantFull;
  final List<String> followUps;

  /// Optional key to pick the next beat after a follow-up chip.
  final String? nextKey;
}

class DayPlan {
  const DayPlan({
    required this.label,
    required this.focus,
    required this.duration,
    required this.moves,
    this.note,
  });

  final String label;
  final String focus;
  final String duration;
  final List<String> moves;
  final String? note;
}

class WeekPlan {
  const WeekPlan({
    required this.id,
    required this.title,
    required this.dayRange,
    required this.summary,
    required this.sessions,
    required this.days,
  });

  final String id;
  final String title;
  final String dayRange;
  final String summary;
  final int sessions;
  final List<DayPlan> days;
}
