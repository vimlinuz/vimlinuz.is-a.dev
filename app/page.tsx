"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";

import PromptLine, { ShellPrompt } from "./components/PromptLine";
import Image from "next/image";
import Link from "next/link";
import { getRandomContentPair } from "./lib/randomContent";
import NixWebring from "./components/NixWebring";
import { executeCommand } from "./lib/executeCommands";

export interface HistoryEntry {
  command: string;
  output: string;
}

export default function Home() {
  const [commandText, setCommandText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [randomContent, setRandomContent] = useState({ title: "", bio: "" });
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showInitialContent, setShowInitialContent] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get random content on component mount
    setRandomContent(getRandomContentPair());
  }, []);

  useEffect(() => {
    const command = randomContent.title;
    let currentIndex = 0;

    // Start typing after 2 seconds
    const initialDelay = setTimeout(() => {
      const typingInterval = setInterval(
        () => {
          if (currentIndex < command.length) {
            setCommandText(command.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
            // Hide cursor after typing
            setTimeout(() => {
              setShowCursor(false);
              // Show output after cursor hides
              setTimeout(() => {
                setShowOutput(true);
                // Show final prompt after output
                setTimeout(() => {
                  setIsInteractive(true);
                }, 500);
              }, 200);
            }, 500);
          }
        },
        100 + Math.random() * 100,
      );

      return () => clearInterval(typingInterval);
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, [randomContent]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = currentInput.trim().toLowerCase();

      // Handle clear command specially - clear all terminal content
      if (command === "clear") {
        setHistory([]);
        setShowInitialContent(false);
        setCurrentInput("");
        return;
      }

      const output = executeCommand(currentInput, setHistory);
      setHistory([...history, { command: currentInput, output }]);
      setCurrentInput("");

      // Scroll to bottom after rendering
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  const handleTerminalClick = () => {
    if (isInteractive && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="profile-photo">
          <Image src="/vimlinuz.png" alt="vimlinuz" width={120} height={120} />
        </div>
        <h1 className="name">VIMLINUZ</h1>
      </div>

      <div className="term-container" onClick={handleTerminalClick}>
        <div className="terminal-content" ref={terminalRef}>
          {showInitialContent && (
            <>
              <div className="prompt-line">
                <ShellPrompt />
                <span> </span>
                <span className="command" id="command-text">
                  {commandText}
                </span>
                {showCursor && <span className="cursor" id="cursor"></span>}
              </div>

              <div className={`output-hidden ${showOutput ? "" : "hidden"}`}>
                <div className={`info-line ${showOutput ? "" : "hidden"}`}>
                  <span className="bio">{randomContent.bio}</span>
                </div>
              </div>
            </>
          )}

          {history.map((entry, index) => (
            <div key={index}>
              <div className="prompt-line">
                <ShellPrompt />
                <span> {entry.command}</span>
              </div>
              {entry.output && (
                <div className="output-line">
                  <pre>{entry.output}</pre>
                </div>
              )}
            </div>
          ))}

          {isInteractive && (
            <PromptLine
              currentInput={currentInput}
              inputRef={inputRef}
              handleKeyDown={handleKeyDown}
              setCurrentInput={setCurrentInput}
            />
          )}
        </div>
      </div>

      <nav className="nav">
        <Link href="/projects">Projects</Link>
        <Link href="/about">About me</Link>
      </nav>

      <NixWebring />
    </div>
  );
}
