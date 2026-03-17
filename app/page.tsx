"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRandomContentPair } from "./lib/randomContent";
import NixWebring from "./components/NixWebring";

interface HistoryEntry {
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

  const executeCommand = (cmd: string): string => {
    const command = cmd.trim().toLowerCase();

    if (command === "") return "";

    if (command === "help") {
      return `Available commands:
  help     - Show this help message
  about    - Learn more about me
  projects - View my projects
  skills   - List my technical skills
  contact  - Get my contact information
  whoami   - Identify current user
  date     - Show current date and time
  echo     - Echo back your message (usage: echo <message>)
  clear    - Clear terminal history
  neofetch - Display system information
  fortune  - Get a random fortune
  ls       - List available pages`;
    }

    if (command === "about") {
      return "A jack of all trades and master of none, is often better than a master of one.\nI'm a developer passionate about Nix, terminal workflows, and clean code.";
    }

    if (command === "projects") {
      return "Check out my projects page! Type 'ls' to see available pages.";
    }

    if (command === "skills") {
      return `Technical Skills:
  • Languages: Rust, TypeScript, Python, C++, Bash
  • Tools: Neovim, Git, Nix, Hyprland
  • Focus: Systems programming, Web development, DevOps`;
    }

    if (command === "contact") {
      return `Contact Information:
  • GitHub: @vimlinuz
  • Location: ~/dev
  • Status: Always learning`;
    }

    if (command === "whoami") {
      return "vimlinuz";
    }

    if (command === "date") {
      return new Date().toString();
    }

    if (command.startsWith("echo ")) {
      return command.substring(5);
    }

    if (command === "clear") {
      setHistory([]);
      return "";
    }

    if (command === "ls") {
      return `projects/  about/  README.md`;
    }

    if (command === "neofetch") {
      return `
       ___      vimlinuz@nixos
      /   \\     OS: NixOS (Yarara) x86_64
     | o o |    Shell: nu
     |  >  |    Terminal: Interactive Web Terminal
      \\___/     Uptime: ${Math.floor(Math.random() * 100)} days
                Editor: Neovim
                Theme: Custom`;
    }

    if (command === "fortune") {
      const fortunes = [
        "The best way to predict the future is to invent it.",
        "Code is like humor. When you have to explain it, it's bad.",
        "First, solve the problem. Then, write the code.",
        "Experience is the name everyone gives to their mistakes.",
        "Simplicity is the soul of efficiency.",
        "Make it work, make it right, make it fast.",
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    }

    return `bash: command not found: ${cmd}\nType 'help' for available commands.`;
  };

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

      const output = executeCommand(currentInput);
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
                <span className="user">[vimlinuz</span>
                <span className="at">@</span>
                <span className="host">nixos</span>
                <span className="path">~]</span>
                <span className="dollar">$</span>
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
                <span className="user">[vimlinuz</span>
                <span className="at">@</span>
                <span className="host">nixos</span>
                <span className="path">~]</span>
                <span className="dollar">$</span>
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
            <div className="prompt-line">
              <span className="user">[vimlinuz</span>
              <span className="at">@</span>
              <span className="host">nixos</span>
              <span className="path">~]</span>
              <span className="dollar">$</span>
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
