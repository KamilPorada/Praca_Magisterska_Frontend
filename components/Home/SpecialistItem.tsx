import Image, { StaticImageData } from "next/image";

interface SpecialistItemProps {
  image: StaticImageData;  // 👈 Zmiana z 'string' na 'StaticImageData'
  title: string;
  group: string;
  description: string;
}

const SpecialistItem: React.FC<SpecialistItemProps> = ({ image, title, group, description }) => {
  return (
    <div className={`border-gray-900 border rounded-lg overflow-hidden bg-secondaryColor text-white shadow-md h-[500px]`}>
      <div className="relative w-full h-2/3">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
        <p className="absolute bottom-0 bg-mainColor py-1 px-2 ml-[0.5px] uppercase text-sm font-semibold text-white">{group}</p>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="font-thin mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SpecialistItem;
