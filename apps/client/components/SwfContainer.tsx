type SwfProps = {
  src: string;
  width: number;
  height: number;
  flashVars: Record<string, string | boolean | number>;
  className: string;
};

export function SwfContainer(props: SwfProps) {
  return (
    <div className={props.className}>
      <embed
        // @ts-expect-error
        flashvars={new URLSearchParams(props.flashVars).toString()}
        height={props.height}
        quality="high"
        src={props.src}
        type="application/x-shockwave-flash"
        width={props.width}
      />
    </div>
  );
}
