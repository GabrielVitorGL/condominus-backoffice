interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }
  
  export default function Spinner(props: SpinnerProps) {
    const { className, ...rest } = props;
  
    const aggregatedClassNames = !!className
      ? [...baseClassNames.split(" "), ...className.split(" ")].join(" ")
      : baseClassNames;
  
    return <div className={aggregatedClassNames} {...rest} />;
  }
  
  const baseClassNames =
    "aspect-square animate-spin rounded-full border-2 border-solid border-t-transparent";
  