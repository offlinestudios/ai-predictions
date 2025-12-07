export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4 bg-card/50 border border-border/50 rounded-2xl max-w-[200px]">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
}
