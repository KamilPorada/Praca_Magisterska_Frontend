import Button from "@/components/UI/Button";
import SectionTitle from "@/components/UI/SectionTitle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center gap-10 h-full">
      <SectionTitle title="Title"/>
      <Button>Button</Button>
    </div>
  );
}
