import { MaskedInput } from 'baseui/input';

export default function DurationInput({
  ref,
  value,
  setValue,
  onBlur,
  onKeyDown,
  overrides,
}) {
  const checkTensDigit = (digit) => {
    if (digit >= 0 && digit <= 5) return true;

    return false;
  };

  const handleInput = ({ target: { value } }) => {
    const hours = value.substring(0, 2);
    const minutes = value.substring(3, 5);
    const seconds = value.substring(6, 8);

    if (!checkTensDigit(minutes[0])) {
      setValue(`${hours}:0${minutes[1]}:${seconds}`);
      return;
    }
    if (!checkTensDigit(seconds[0])) {
      setValue(`${hours}:${minutes}:0${seconds[1]}`);
      return;
    }

    setValue(value);
  };

  return (
    <MaskedInput
      ref={ref}
      overrides={overrides}
      placeholder="00:00:00"
      onChange={handleInput}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      value={value}
      mask="99:99:99"
      size="compact"
      maskChar="0"
    />
  );
}
