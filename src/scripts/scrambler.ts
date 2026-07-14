const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function initScrambler(
  root: HTMLElement,
  text: string,
  duration = 2
) {
  const spans = text.split("").map((char) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.color = "white";
    span.textContent = char === " " ? "\u00A0" : char;
    root.appendChild(span);
    return span;
  });

  let scrambled = spans.map((s) => s.textContent ?? "");
  let isScrambling = true;
  let revealIndex = -1;
  const pool = CHARS + text;

  const scrambleInterval = window.setInterval(() => {
    if (!isScrambling) return;

    const indices = new Set<number>();
    const numToScramble = Math.floor(Math.random() * 2) + 1;
    while (indices.size < numToScramble && indices.size < text.length) {
      const i = Math.floor(Math.random() * text.length);
      if (text[i] !== " ") indices.add(i);
    }

    scrambled = text.split("").map((char, index) => {
      if (char === " ") return "\u00A0";
      if (indices.has(index)) {
        return pool[Math.floor(Math.random() * pool.length)]!;
      }
      return scrambled[index] || char;
    });

    spans.forEach((span, i) => {
      span.textContent = scrambled[i] ?? "";
    });
  }, 50);

  const stopTimeout = window.setTimeout(() => {
    isScrambling = false;
    window.clearInterval(scrambleInterval);

    const revealInterval = window.setInterval(() => {
      revealIndex += 1;
      if (revealIndex >= text.length) {
        window.clearInterval(revealInterval);
        return;
      }
      spans.forEach((span, i) => {
        if (i <= revealIndex) {
          span.textContent = text[i] === " " ? "\u00A0" : text[i]!;
        } else {
          span.textContent = scrambled[i] ?? "";
        }
      });
    }, 100);
  }, duration * 1000);

  return () => {
    window.clearInterval(scrambleInterval);
    window.clearTimeout(stopTimeout);
  };
}
