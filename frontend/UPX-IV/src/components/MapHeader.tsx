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
    <div className="items-center flex flex-col pb-2 sm:pb-3 md:pb-4 lg:pb-5">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800 dark:text-white text-center px-2 leading-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 dark:text-gray-200 leading-relaxed text-center px-2">
        {description}{" "}
        <span className="font-bold">{city}</span>
      </p>
    </div>
  );
}

