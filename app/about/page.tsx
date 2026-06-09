"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import PromptLine, { ShellPrompt } from "../components/PromptLine";
import { executeCommand } from "../lib/executeCommands";

interface HistoryEntry {
  command: string;
  output: string;
}

interface InfoData {
  label: string;
  value: string;
  highlight?: boolean;
  url?: string;
}

export default function About() {
  const [commandText, setCommandText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showInitialContent, setShowInitialContent] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const infoData: InfoData[] = [
    { label: "", value: "" },
    {
      label: "",
      value:
        "I want to be a systems programmer driven by curiosity for how things work under the hood." +
        "I enjoy building CLI tools, scripting, contributing in open-source porgrams and shaping efficient workflows through a fully customized Linux environment." +
        "Currently pursuing BSc in CSIT, I spend much of my time learning through hands-on experimentation-configuring Linux with Hyprland, maintaining a minimal yet powerful setup with Neovim, nu, and tmux." +
        "When I'm not programming, you'll find me obsessively ricing my setup, tweaking configurations, and tinkering with my system to squeeze out every millisecond of performance.",
    },
    { label: "", value: "" },
    {
      label: "GitHub:",
      value: "https://github.com/vimlinuz",
      highlight: true,
      url: "https://github.com/vimlinuz",
    },
    { label: "Website:", value: "well", highlight: true },
    { label: "Email:", value: "username [at] gmail.com", highlight: true },
    { label: "Discord:", value: "vimlinuz", highlight: true },
    {
      label: "Matrix:",
      value: "@vimlinuz:matrix.org",
      highlight: true,
      url: "https://matrix.to/#/@vimlinuz:matrix.org",
    },
  ];

  useEffect(() => {
    const command = "mefetch";
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
                // Show lines one by one
                let lineIndex = 0;
                const lineInterval = setInterval(() => {
                  if (lineIndex < infoData.length) {
                    setVisibleLines((prev) => [...prev, lineIndex]);
                    lineIndex++;
                  } else {
                    clearInterval(lineInterval);
                    // Enable interactive mode
                    setTimeout(() => {
                      setIsInteractive(true);
                    }, 500);
                  }
                }, 100);
              }, 200);
            }, 500);
          }
        },
        100 + Math.random() * 100,
      );

      return () => clearInterval(typingInterval);
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, [infoData.length]);

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
    <div className="container about-page">
      <div className="terminal-buttons">
        <Link href="/" className="btn close" style={{ textDecoration: "none" }}>
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>
      <h1 className="name">About</h1>
      <div className="header"></div>

      <div
        className="terminal-content"
        ref={terminalRef}
        onClick={handleTerminalClick}
      >
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
              {infoData.map((info, index) => (
                <div
                  key={index}
                  className={`info-line ${visibleLines.includes(index) ? "" : "hidden"}`}
                  style={
                    info.label === "" && info.value !== ""
                      ? {
                          textAlign: "left",
                          display: "block",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          textIndent: "2rem",
                        }
                      : {}
                  }
                >
                  {info.label === "" && info.value !== "" ? (
                    <span className="value">{info.value}</span>
                  ) : (
                    <>
                      <span className="label">{info.label}</span>{" "}
                      {info.url ? (
                        <a
                          href={info.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`value ${info.highlight ? "highlight" : ""}`}
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <span
                          className={`value ${info.highlight ? "highlight" : ""}`}
                        >
                          {info.value}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
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
  );
}
