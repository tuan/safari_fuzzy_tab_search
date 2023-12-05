type Props = {
  str: string;
  indices: Set<number>;
};

const HighlightChars = ({ str, indices }: Props) => {
  const chars = str.split('');

  const nodes = chars.map((char, i) => {
    if (indices.has(i)) {
      return <b key={i}>{char}</b>;
    } else {
      return char;
    }
  });

  return <>{nodes}</>;
};

export default HighlightChars;
