import { useState, useRef } from 'react';

interface Props {
  content: string;
  children: React.ReactNode;
}

export default function TooltipWrapper({ content, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const show = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setVisible(true);
  };

  return (
    <div
      ref={ref}
      className="tooltip-host"
      onMouseEnter={show}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="tooltip-box"
          style={{ left: pos.x, top: pos.y }}
        >
          {content}
        </div>
      )}
    </div>
  );
}