enum ChatRole { user, assistant }

enum CoachPhase {
  meet,
  chat,
}

enum ChatTurnState {
  idle,
  generating,
  streaming,
  awaitingUser,
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
