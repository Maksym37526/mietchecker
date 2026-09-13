export default function Impressum() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8">Impressum</h1>

        <section className="space-y-6 text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Angaben gemäß § 5 TMG
            </h2>
            <p>[Full name]</p>
            <p>[Street and number]</p>
            <p>[Postal code] [City]</p>
            <p>Deutschland</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Kontakt</h2>
            <p>E-Mail: [contact e-mail]</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Haftungsausschluss
            </h2>
            <p className="text-sm leading-relaxed">
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Dieses Tool ersetzt
              keine Rechtsberatung. Bei konkreten rechtlichen Fragen wenden Sie
              sich bitte an einen zugelassenen Rechtsanwalt oder Mieterverein.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Hinweis zur KI-Analyse
            </h2>
            <p className="text-sm leading-relaxed">
              Die auf dieser Website angebotene KI-gestützte Analyse von
              Mietverträgen dient ausschließlich zu Informationszwecken und
              stellt keine Rechtsberatung im Sinne des
              Rechtsdienstleistungsgesetzes (RDG) dar. Die Ergebnisse sind
              nicht rechtsverbindlich.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Zurück zur Startseite
          </a>
        </div>
      </div>
    </main>
  );
}