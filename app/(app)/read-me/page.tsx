const ReadMePage = () => {
  return (
    <div className="relative w-full max-w-screen-lg lg:mx-auto px-6 lg:px-0 my-10">
      <div className="mb-4 ">
        <h1 className="text-2xl">
          Välkommen till <span className="font-bold text-hero">Fast & Fit</span>
        </h1>
        <h5 className="text-base text-muted-foreground py-2">
          Transformera din träningsresa — varje dag är en möjlighet att nå din
          sanna potential
        </h5>
      </div>
      <p className="text-lg py-4 mb-4">
        Vi erbjuder en AI-driven träningsassistent som hjälper dig att nå dina
        träningsmål. Välj mellan tre utmaningsnivå (enkel, medel och hård) på
        inställningar sidan för att få dagliga anteckningar och motivation
        anpassad efter din valda svårighetsgrad. Oavsett om du söker bekräftelse
        på dina framsteg, tips för att pressa dig själv eller motivation för att
        övervinna hinder, är vår assistent här för att ge dig kraftfulla och
        raka svar.
      </p>
    </div>
  );
};

export default ReadMePage;
