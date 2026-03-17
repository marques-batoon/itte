import "./Furigana.css";

/**
 * Renders an array of segments as furigana (ruby) text.
 * segments: Array of { k: string, f?: string }
 *   k = kanji/text to display
 *   f = optional furigana reading above
 */
export default function Furigana({ segments, className = "" }) {
  return (
    <span className={`furigana-root ${className}`}>
      {segments.map((seg, i) =>
        seg.f ? (
          <ruby key={i} className="furigana-ruby">
            {seg.k}
            <rp>(</rp>
            <rt className="furigana-rt">{seg.f}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={i} className="furigana-plain">{seg.k}</span>
        )
      )}
    </span>
  );
}
