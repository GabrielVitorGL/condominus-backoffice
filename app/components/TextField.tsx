import { useEffect, useState } from "react";
import Image from "next/image";

interface TextFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  name?: string;
  label: string;
  defaultValue?: string;
  icon?: any;
  type?: HTMLFormElement["type"];
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullBorder?: boolean;
  iconStyle?: React.CSSProperties;
}

export default function TextField(props: TextFieldProps) {
  const {
    name,
    label,
    defaultValue,
    icon,
    className,
    type,
    required,
    disabled,
    fullBorder,
    error,
    iconStyle,
    ...rest
  } = props;
  const color = props.color || "gray-200";

  const [value, setValue] = useState<string>(defaultValue || "");
  const [isActive, setActive] = useState<boolean>(value.length > 0);

  useEffect(() => {
    if (!isActive && value.length > 0) {
      setActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`${containerStyles(!!error, color, !!fullBorder, !!disabled)} ${className}`} {...rest}>
      {icon && <Image src={icon} alt="" width={16} style={iconStyle} />}
      <span className={labelStyles(isActive, !!error, color, !!fullBorder)}>{label}</span>
      <input
        key={(!!error).toString()} // Force re-render when error changes (see https://mdbootstrap.com/support/standard/input-field-label-doesnt-update-styles-when-value-set-programmatically/)
        name={name}
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(ev) => setValue(ev.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(value.length > 0)}
        className={inputStyles(!!error, color, !!fullBorder)}
      />
    </div>
  );
}

const containerStyles = function (hasError: boolean, color: string, fullBorder: boolean, disabled: boolean) {
  return [
    "relative",
    "flex",
    "items-center",
    "w-full",
    fullBorder ? "border" : "border-b",
    fullBorder ? "rounded" : "",
    fullBorder && disabled ? "border-dotted" : "",
    hasError ? "border-error" : `border-${color}`,
    "pb-1",
  ].join(" ");
};

const labelStyles = function (
  isActive: boolean,
  hasError: boolean,
  color: string,
  fullBorder: boolean
) {
  return [
    "absolute",
    hasError ? "text-error" : `text-${color}`,
    "pointer-events-none",
    "ease-out",
    "duration-200",
    isActive ? "translate-x-0" : "translate-x-6",
    isActive ? "-translate-y-5" : "translate-y-0",
    isActive ? "text-2xs" : "",
    fullBorder ? "font-normal" : "",
    fullBorder ? "translate-x-4" : "",
    isActive && fullBorder ? "px-1" : "",
    isActive && fullBorder ? "!-translate-y-4" : "",
    isActive && fullBorder ? "text-xs" : "",
    isActive && fullBorder
      ? "bg-[linear-gradient(_rgba(255,0,0,0)_30%,_#fff_30%,_#fff_70%,_rgba(255,0,0,0)_70%)]"
      : "",
  ].join(" ");
};

const inputStyles = function (hasError: boolean, color: string, fullBorder: boolean) {
  return [
    "appearance-none",
    "bg-transparent",
    fullBorder ? "px-3" : "px-2",
    "py-1",
    hasError ? "text-error" : `text-${color}`,
    `caret-${color}`,
    "focus:outline-none",
    "flex-1",
  ].join(" ");
};
