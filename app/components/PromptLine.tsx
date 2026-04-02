import { RefObject } from "react";

interface PromptLineProps {
  currentInput: string;
  setCurrentInput: (input: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}
export function ShellPrompt() {
  return (
    <>
      <span className="user">[vimlinuz</span>
      <span className="at">@</span>
      <span className="host">nixos</span>
      <span className="path">~]</span>
      <span className="dollar">$</span>
    </>
  );
}

export default function PromptLine({
  currentInput,
  inputRef,
  handleKeyDown,
  setCurrentInput,
}: PromptLineProps) {
  return (
    <>
      <div className="prompt-line">
        <ShellPrompt />
        <span> </span>
        <span className="command">{currentInput}</span>
        <span className="cursor"></span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input-hidden"
          autoFocus
          spellCheck={false}
        />
      </div>
    </>
  );
}
