interface MapHeaderProps {
  title?: string;
  description?: string;
  city?: string;
}

export default function MapHeader({
  title = "Mapa de Acessibilidade",
  description = "Encontre estabelecimentos e locais acessíveis na cidade de",
  city = "Sorocaba/SP",
}: MapHeaderProps) {
  return (
    <div className="items-center flex flex-col pb-4 sm:pb-5">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white text-center px-2">
        {title}
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200 leading-[1.5] text-center px-2">
        {description}{" "}
        <span className="font-bold">{city}</span>
      </p>
    </div>
  );
}

