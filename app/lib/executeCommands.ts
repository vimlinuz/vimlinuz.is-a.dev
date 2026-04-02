import { SetStateAction, Dispatch } from "react";
import { HistoryEntry } from "../page";

export const executeCommand = (
  cmd: string,
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>,
): string => {
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
