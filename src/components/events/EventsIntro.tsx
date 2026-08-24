import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";

export default function EventsIntro() {
  return (
    <div>
      <h2 className="text-[2rem] font-extrabold leading-[1.05] text-navy sm:text-[2.2rem]">
        two events.
        <br />
        one really
        <br />
        <span className="text-pink">good reason.</span>
      </h2>
      <HandDrawnUnderline color="blue" className="mt-3 w-28" />
    </div>
  );
}
