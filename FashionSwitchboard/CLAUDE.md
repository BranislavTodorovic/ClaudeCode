# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

FashionSwitchboard is a single static HTML file (`index.html`) — a "switchboard" page with six buttons (Vogue, Elle, Harper's Bazaar, Max Mara, H&M, Zara), each linking out to that brand's official site in a new tab (`target="_blank" rel="noopener noreferrer"`).

There is no build system, package manager, server, or test suite. All markup, CSS, and behavior live inline in `index.html`.

## Running

Open the file directly in a browser — no server or build step is required:

```
start index.html
```

## Notes

- This directory is not itself a git repository; the git root is the parent `claudecode` folder, which holds multiple unrelated project subfolders.
- Keep changes self-contained within `index.html` unless the user asks for additional files (e.g. splitting out CSS/JS).
