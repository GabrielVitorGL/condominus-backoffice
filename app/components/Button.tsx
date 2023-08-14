import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  customContent?: JSX.Element;
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "simple" | "outline";
}

export default function Button(props: ButtonProps) {
  const { label, customContent, loading, variant, className, disabled, ...rest } = props;

  let containerStyles;
  let spinnerStyles;
  switch (variant) {
    case "simple":
      containerStyles = simpleContainerStyles;
      spinnerStyles = defaultSpinnerStyles;
      break;
    case "outline":
      containerStyles = outlineContainerStyles(!!disabled);
      spinnerStyles = outlineSpinnerStyles(!!disabled);
      break;
    default:
      containerStyles = defaultContainerStyles(!!disabled);
      spinnerStyles = defaultSpinnerStyles;
      break;
  }

  const content = loading ? (
    <Spinner className={spinnerStyles} />
  ) : customContent ? (
    customContent
  ) : (
    <span className={labelStyles}>{label}</span>
  );

  return (
    <button className={`${containerStyles} ${className}`} {...rest}>
      {content}
    </button>
  );
}

const defaultContainerStyles = (disabled: boolean) =>
  [
    disabled ? "bg-slate-200" : "bg-mvlightgreen",
    "text-white",
    "font-bold",
    "rounded",
    "py-3",
    "flex",
    "justify-center",
    "items-center",
    disabled ? "" : "hover:bg-mvlightgreen-accent",
    disabled ? "cursor-default" : "cursor-pointer",
  ].join(" ");

const outlineContainerStyles = (disabled: boolean) =>
  [
    "bg-transparent",
    disabled ? "text-zinc-400" : "text-mvlightgreen",
    "font-bold",
    "rounded",
    "py-2",
    "flex",
    "justify-center",
    "items-center",
    disabled ? "" : "hover:bg-mvlightgreen-accent/20",
    disabled ? "cursor-default" : "cursor-pointer",
    "border",
    disabled ? "border-zinc-200" : "border-mvlightgreen",
  ].join(" ");

const simpleContainerStyles = [
  "bg-transparent",
  "cursor-pointer",
  "flex",
  "flex-row",
  "justify-center",
  "text-white",
  "font-light",
].join(" ");

const labelStyles = ["tracking-wider"].join(" ");

const defaultSpinnerStyles = ["w-6"].join(" ");

const outlineSpinnerStyles = (disabled: boolean) =>
  ["w-5", "border-current", disabled ? "text-zinc-300" : "text-mvlightgreen"].join(" ");
