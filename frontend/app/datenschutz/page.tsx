export default function Datenschutz() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <section className="space-y-6 text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Datenschutz auf einen Blick
            </h2>
            <p className="text-sm leading-relaxed">
              Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und
              Zweck der Verarbeitung von personenbezogenen Daten auf dieser
              Website auf.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Verantwortlicher
            </h2>
            <p className="text-sm leading-relaxed">
              [Full name]<br />
              [Street and number]<br />
              [Postal code] [City]<br />
              E-Mail: [contact e-mail]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Erhobene Daten
            </h2>
            <p className="text-sm leading-relaxed">
              Wenn Sie einen Mietvertrag hochladen, wird der Inhalt des
              Dokuments zur Analyse an die KI-API (Anthropic Claude) übertragen.
              Die hochgeladenen Dokumente werden nicht dauerhaft gespeichert und
              nach der Analyse gelöscht. Wir speichern keine personenbezogenen
              Daten aus den Dokumenten.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Google Analytics
            </h2>
            <p className="text-sm leading-relaxed">
              Diese Website verwendet Google Analytics, einen Webanalysedienst
              der Google LLC. Google Analytics verwendet Cookies und erfasst
              anonymisierte Nutzungsdaten (z.B. Seitenaufrufe, Verweildauer).
              Die Daten werden auf Servern von Google in den USA gespeichert.
              Sie können der Datenerfassung widersprechen, indem Sie ein
              Browser-Plugin installieren: tools.google.com/dlpage/gaoptout
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Ihre Rechte
            </h2>
            <p className="text-sm leading-relaxed">
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
              Einschränkung der Verarbeitung Ihrer personenbezogenen Daten.
              Bei Fragen wenden Sie sich an: [contact e-mail]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Hosting
            </h2>
            <p className="text-sm leading-relaxed">
              Diese Website wird gehostet bei Railway (railway.app). Beim
              Besuch der Website werden automatisch Server-Logfiles erfasst
              (IP-Adresse, Browser, Betriebssystem). Diese Daten sind nicht
              einer bestimmten Person zuordenbar.
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