import { useState, useEffect, useRef } from 'react'
import './App.css'
import {
  ChevronDown,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  BookOpen,
  Scale,
  Menu,
  X,
  Check,
} from 'lucide-react'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, isInView }
}

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isInView } = useInView()
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function Countdown() {
  const targetDate = new Date('2026-02-28T23:59:00').getTime()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const diff = targetDate - now
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const blocks = [
    { value: timeLeft.days, label: 'DNI' },
    { value: timeLeft.hours, label: 'GODZIN' },
    { value: timeLeft.minutes, label: 'MINUT' },
    { value: timeLeft.seconds, label: 'SEKUND' },
  ]

  return (
    <div className="flex gap-4 sm:gap-6">
      {blocks.map((b, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl sm:text-5xl font-bold text-white tabular-nums">
            {String(b.value).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-white/60 mt-1 tracking-wider font-medium">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  )
}

interface FAQItem {
  q: string
  a: string
}

interface FAQCategory {
  title: string
  icon: React.ReactNode
  items: FAQItem[]
}

function FAQAccordion({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div className="space-y-0">
      {category.items.map((item, idx) => (
        <div
          key={idx}
          className="border-b border-slate-200"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full py-5 flex items-start gap-4 text-left group"
          >
            <span className="flex-1 text-base sm:text-lg font-medium text-brand leading-relaxed group-hover:opacity-70 transition-opacity">
              {item.q}
            </span>
            <ChevronDown
              className={`flex-shrink-0 w-5 h-5 mt-1 transition-transform duration-300 ${
                openIndex === idx ? 'rotate-180 text-brand-light' : 'text-slate-400'
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-400 ease-in-out ${
              openIndex === idx
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-5 text-slate-600 leading-relaxed text-base">
              {item.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaqCat, setActiveFaqCat] = useState(0)

  const navItems = [
    { label: 'Co to NRUA?', href: '#co-to' },
    { label: 'Jak zlozyc?', href: '#jak-zlozyc' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontakt', href: '#kontakt' },
  ]

  const heroCards = [
    {
      title: 'Termin',
      desc: '1 lutego \u2013 28 lutego 2026',
      sub: 'Masz czas do ko\u0144ca lutego na przes\u0142anie danych za rok 2025. Uwaga: system zamyka si\u0119 o p\u00F3\u0142nocy ostatniego dnia miesi\u0105ca.',
      img: '/images/hero-termin.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Termin',
    },
    {
      title: 'Dokumenty',
      desc: 'NIE, NRUA, CRU i dane najemc\u00F3w',
      sub: 'Przygotuj sw\u00F3j numer identyfikacyjny, numer rejestracyjny nieruchomo\u015Bci (NRUA), kod rejestrowy (CRU) oraz anonimowan\u0105 list\u0119 wszystkich pobyt\u00F3w.',
      img: '/images/hero-dokumenty.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Dokumenty',
    },
    {
      title: 'Proces',
      desc: 'Format XBRL i Sede Electr\u00F3nica',
      sub: 'Deklaracja musi zosta\u0107 wys\u0142ana w oficjalnym formacie cyfrowym XBRL do hiszpa\u0144skiego Rejestru Nieruchomo\u015Bci (Registro de la Propiedad).',
      img: '/images/hero-proces.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Proces',
    },
    {
      title: 'Konsekwencje',
      desc: 'Zawieszenie numeru i blokada ofert',
      sub: 'Brak zg\u0142oszenia lub b\u0142\u0119dy w danych skutkuj\u0105 natychmiastowym wycofaniem numeru NRUA i usuni\u0119ciem og\u0142osze\u0144 z Airbnb oraz Booking.com w ci\u0105gu 48h.',
      img: '/images/hero-konsekwencje.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Konsekwencje',
    },
  ]

  const faqCategories: FAQCategory[] = [
    {
      title: 'Obowiazek i Terminy',
      icon: <Calendar className="w-5 h-5" />,
      items: [
        { q: 'Jaki jest dokladny termin zlozenia zgloszenia?', a: 'Od 1 lutego do 2 marca 2026 wlacznie. To sa daty nieprzekraczalne ustalone przez Real Decreto 1312/2024.' },
        { q: 'Co jesli zloze 3 marca (dzien po terminie)?', a: 'Rejestr rozpocznie procedure cofniecia NRUA. Nie ma przedluzenia ani "okresu karencji". System jest automatyczny.' },
        { q: 'Czy moge zlozyc wczesniej, np. w styczniu?', a: 'Nie. Aplikacja N2 i Rejestr przyjmuja zgloszenia tylko w lutym (do 2 marca).' },
        { q: 'Czy to jest obowiazek jednorazowy czy powtarzajacy sie?', a: 'Powtarzajacy sie co roku. Kazdego lutego musisz zglosic wynajmy z poprzedniego roku.' },
        { q: 'Czy sa jakies wyjatki od tego obowiazku?', a: 'Nie. Kazdy z NRUA musi zglosic, nawet jesli nie wynajmowal (wtedy "sin actividad" - brak aktywnosci).' },
        { q: 'Czy gmina moze przedluzyc termin?', a: 'Nie. To obowiazek panstwowy (Real Decreto), gminy nie maja wplywu na terminy.' },
        { q: 'Otrzymam powiadomienie email ze musze zglosic?', a: 'Prawdopodobnie NIE. Rejestr nie wysyla przypomnien. To Twoj obowiazek sledzic termin.' },
        { q: 'Co jesli jestem chory w lutym?', a: 'Mozesz upowaznie pelnomocnika (gestoria, rodzina) do zlozenia za Ciebie. Wymaga to pisemnego pelnomocnictwa.' },
        { q: 'Czy musze zglosic jesli mieszkanie bylo puste caly 2025?', a: 'TAK. Musisz zglosic zaznaczajac "sin actividad" (brak wynajmu). To potwierdza ze NRUA jest aktywny.' },
        { q: 'Czy moge poprosic o odroczenie terminu?', a: 'Nie. Termin jest sztywny dla wszystkich. Jedynym wyjsciem jest zlozenie w wymaganym okresie lub udzielenie pelnomocnictwa.' },
      ],
    },
    {
      title: 'Dokumenty i Dane',
      icon: <FileText className="w-5 h-5" />,
      items: [
        { q: 'Nie pamietam swojego numeru NRUA. Gdzie go znalezc?', a: 'Sprawdz: dokument od Urzedu Gminy, ogloszenie na Airbnb/Booking (musi byc tam widoczny), lub zapytaj w Urzedzie Gminy gdzie rejestrowales.' },
        { q: 'Co to jest CRU i gdzie go znalezc?', a: 'CRU (Codigo Registral Unico) to kod nieruchomosci w Rejestrze Wlasnosci. Znajdziesz w: dokumencie NRUA, escritura (akt notarialny) lub nota simple (wypis z Rejestru).' },
        { q: 'Nie mam certyfikatu cyfrowego. Czy moge zlozyc?', a: 'TAK. Mozesz zlozyc osobiscie w Rejestrze Wlasnosci lub zlecic profesjonaliscie ktory posiada certyfikat.' },
        { q: 'Czy potrzebuje kopii umow najmu?', a: 'Nie. Wystarczaja: daty, liczba gosci, cel najmu. Umowy zachowaj dla siebie (na wypadek kontroli).' },
        { q: 'Wynajowalem 20 razy w 2025. Musze kazdy wypisac?', a: 'TAK, ale aplikacja N2 pozwala zgrupowac. Wpisz date pierwszego i ostatniego wynajmu w roku oraz laczna liczbe gosci.' },
        { q: 'Nie pamietam dokladnych dat wynajmow. Co robic?', a: 'Sprawdz: wyciagi bankowe (wplaty od Airbnb/Booking), kalendarz Airbnb (zakladka "Rezerwacje"), panel Booking (Historia), emaile potwierdzajace rezerwacje.' },
        { q: 'Czy musze podac dane gosci (imiona, nazwiska)?', a: 'NIE. Zgloszenie jest anonimowe. Podajesz tylko: liczbe osob, daty, cel.' },
        { q: 'Mam nieruchomosc w spolce (SL). Jakie dane podac?', a: 'NIF spolki, nazwa spolki, administrator lub osoba upowazniona, email kontaktowy spolki.' },
        { q: 'Czy moge zglosic kilka nieruchomosci jednym formularzem?', a: 'Nie. Kazdy CRU (nieruchomosc) wymaga osobnego zgloszenia.' },
        { q: 'Stracilem dokument z NRUA. Moge uzyskac duplikat?', a: 'TAK. Zwroc sie do Urzedu Gminy ktory wydal NRUA. Popros o "certificado duplicado NRUA".' },
      ],
    },
    {
      title: 'Proces i Aplikacja N2',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { q: 'Czy aplikacja N2 jest w jezyku polskim?', a: 'Nie. Jest po hiszpansku i angielsku. Dlatego przygotowalismy manual w jezyku polskim.' },
        { q: 'Aplikacja N2 nie chce sie zainstalowac. Co robic?', a: 'Sprawdz: czy masz Jave zainstalowana (java.com), pobierz ponownie z oficjalnej strony, lub sprubuj na innym komputerze. Napisz do nas - pomozemy.' },
        { q: 'Czy moge wypelnic formularz na telefonie?', a: 'Nie. Aplikacja N2 dziala tylko na komputerze (Windows/Mac). Nie ma wersji mobilnej.' },
        { q: 'Ile czasu zajmuje wypelnienie formularza?', a: 'Z przygotowanymi danymi: 20-30 minut. Bez przygotowania: 1-2 godziny (szukanie dat, liczenie gosci).' },
        { q: 'Czy moge zapisac formularz i wrocic pozniej?', a: 'TAK. Aplikacja N2 pozwala zapisac rozpracowywany formularz i dokonczyc pozniej.' },
        { q: 'Popelnilem blad w zgloszeniu. Czy moge poprawic?', a: 'TAK, ale tylko jesli jeszcze nie wyslales. Po wyslaniu musisz zlozyc "rectificacion" (poprawke).' },
        { q: 'Jak wyglada potwierdzenie odbioru?', a: 'PDF z: numerem rejestrowym zgloszenia, data i godzina zlozenia, pieczecia elektroniczna Rejestru, Twoje dane i NRUA.' },
        { q: 'Ile czeka sie na potwierdzenie?', a: 'Elektroniczne: 24-48 godzin. Osobiste: natychmiast (pieczec na dokumencie).' },
        { q: 'Rejestr odrzucil moje zgloszenie. Co robic?', a: 'Sprawdz powod odrzucenia (powinien byc w emailu). Najczestsze: bledny CRU, NRUA niezgodny z baza, brakujace dane. Popraw i zloz ponownie.' },
        { q: 'Czy moge zlozyc zgloszenie za kogos (rodzina, znajomy)?', a: 'TAK, jesli masz pisemne pelnomocnictwo od wlasciciela.' },
      ],
    },
    {
      title: 'Konsekwencje i Kary',
      icon: <AlertTriangle className="w-5 h-5" />,
      items: [
        { q: 'Co DOKLADNIE sie stanie jesli nie zloze?', a: 'Rejestr Wlasnosci cofnie NRUA (automatycznie), informacja trafi do Ventanilla Unica Digital, Airbnb/Booking zablokuja Twoje ogloszenie, nie bedziesz mogl legalnie wynajmowac, mozliwe kary gminne (300-3000\u20AC).' },
        { q: 'Czy bede mogl odzyskac NRUA po cofnieciu?', a: 'TAK, ale musisz przejsc caly proces od nowa (jak przy pierwszej rejestracji). To kosztuje czas i pieniadze.' },
        { q: 'Airbnb juz mi zablokowal ogloszenie. Co robic?', a: 'Zloz zgloszenie NATYCHMIAST, uzyskaj potwierdzenie, wyslij do Airbnb jako dowod. Czekaj na odblokowanie (moze zajac 7-14 dni).' },
        { q: 'Czy Urzad Skarbowy tez zostanie poinformowany?', a: 'Nie bezposrednio. To sa dwa niezalezne systemy. Ale Hacienda moze uzyskac dostep do danych.' },
        { q: 'Czy moge dostac kare pieniezna oprocz cofniecia NRUA?', a: 'TAK. Gminy moga nalozyc kary za: brak zgloszenia (300-1500\u20AC), wynajmowanie bez NRUA (1000-3000\u20AC), powtarzajace sie naruszenie (do 6000\u20AC).' },
        { q: 'Czy kara jest taka sama w calej Hiszpanii?', a: 'Nie. Kazda Wspolnota Autonomiczna ma swoje stawki. Najsurowsze: Katalonia, Baleary.' },
        { q: 'Jak dlugo trwa cofniecie NRUA?', a: 'Po terminie 2 marca Rejestr ma 30 dni na wyslanie ostrzezenia. Potem kolejne 15 dni na cofniecie. Razem ok. 45-60 dni.' },
        { q: 'Otrzymam ostrzezenie przed cofnieciem?', a: 'Prawdopodobnie TAK, ale nie zawsze. Rejestr powinien wyslac "requerimiento" (wezwanie), ale terminy sa krotkie.' },
        { q: 'Czy moge odwolac sie od cofniecia NRUA?', a: 'TAK, ale tylko jesli masz uzasadniony powod (np. blad Rejestru, sila wyzsza). Termin: 15 dni od powiadomienia.' },
        { q: 'Czy ktos juz stracil NRUA za brak zgloszenia?', a: 'To pierwszy rok tego obowiazku (2026), wiec przypadkow jeszcze nie ma. Ale prawo jest jasne - bedzie egzekwowane.' },
      ],
    },
    {
      title: 'Przypadki Szczegolne',
      icon: <Users className="w-5 h-5" />,
      items: [
        { q: 'Sprzedalem mieszkanie w lipcu 2025. Kto zglasza?', a: 'TY: wynajmy styczen-lipiec 2025. NOWY WLASCICIEL: wynajmy sierpien-grudzien 2025. Kazdy za swoj okres.' },
        { q: 'Kupilem mieszkanie z NRUA. Przechodzi na mnie?', a: 'TAK. NRUA jest zwiazany z nieruchomoscia. Ale musisz zaktualizowac dane wlasciciela w Urzedzie Gminy.' },
        { q: 'Wynajmuje mieszkanie mojej matki. Kto zglasza?', a: 'Wlasciciel (matka) lub osoba z pelnomocnictwem. Potrzebne: dokument pelnomocnictwa notarialny.' },
        { q: 'Mam wspolwlascicieli (50/50). Kto zglasza?', a: 'Jeden ze wspolwlascicieli w imieniu wszystkich. Lub kazdy osobno (ale wtedy duplikacja - lepiej jeden).' },
        { q: 'NRUA jest na spolke, ale ja wynajmuje prywatnie. Co robic?', a: 'NRUA musi byc zgodny z wlascicielem w Rejestrze. Jesli spolka jest wlascicielem - zglasza spolka.' },
        { q: 'Mam kilka NRUA dla jednego mieszkania (rozne pokoje). Ile zgloszen?', a: 'Jesli wszystkie NRUA maja ten sam CRU - jedno zgloszenie (lista wszystkich NRUA w jednym formularzu).' },
        { q: 'Czy gestoria moze to zrobic za mnie?', a: 'TAK. Wiekszosc gestorias oferuje te usluge. Mozesz tez skontaktowac sie z nami.' },
        { q: 'Wynajmuje przez Airbnb. Oni nie zglaszaja za mnie?', a: 'NIE. Airbnb/Booking tylko udostepniaja platforme. Obowiazek prawny lezy po stronie wlasciciela.' },
        { q: 'Jestem rezydentem podatkowym w Polsce. Czy to dotyczy mnie?', a: 'TAK. Obowiazek dotyczy wszystkich wlascicieli z NRUA, niezaleznie od rezydencji podatkowej.' },
        { q: 'Gdzie moge uzyskac pomoc jesli mam problem?', a: 'Nasz email: kontakt@nruahiszpania.pl (odpowiadamy w 24h). Mozesz tez zwrocic sie do Rejestru Wlasnosci lub Urzedu Gminy ktory wydal NRUA.' },
      ],
    },
  ]

  const steps = [
    { num: '01', title: 'Zbierz Dokumenty i Dane', desc: 'Przygotuj: NIE/NIF, numer NRUA, kod CRU, dane wszystkich wynajmow z 2025 roku (daty, liczba gosci, cel najmu).', icon: <FileText className="w-7 h-7" /> },
    { num: '02', title: 'Pobierz Aplikacje N2', desc: 'Oficjalny program Colegio de Registradores. Pobierz ze strony sede.registradores.org. Wymaga: Windows 10+ lub macOS, Java 8+.', icon: <BookOpen className="w-7 h-7" /> },
    { num: '03', title: 'Wypelnij Formularz', desc: 'Uruchom aplikacje N2, wybierz "Nuevo deposito", rok 2025, wpisz dane wlasciciela, dane nieruchomosci (CRU, NRUA), informacje o wynajmach.', icon: <CheckCircle2 className="w-7 h-7" /> },
    { num: '04', title: 'Zloz Elektronicznie lub Osobiscie', desc: 'Elektronicznie: z certyfikatem cyfrowym na sede.registradores.org. Osobiscie: wydrukuj formularz i zanes do Registro de la Propiedad.', icon: <Shield className="w-7 h-7" /> },
  ]

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#hero" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="var(--brand)" strokeWidth="2" />
                <circle cx="14" cy="14" r="6" fill="var(--brand)" />
              </svg>
              <span className="text-lg font-semibold tracking-tight text-brand">
                NRUA Hiszpania
              </span>
            </a>
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="#kontakt" className="hidden sm:inline-flex items-center px-5 py-2.5 bg-brand-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
                Skontaktuj sie
              </a>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-700">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white border-t border-slate-100 px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-slate-700 hover:text-brand font-medium transition-colors">
                {item.label}
              </a>
            ))}
            <a href="#kontakt" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center mt-3 px-5 py-2.5 bg-brand-accent text-white text-sm font-medium rounded-md">
              Skontaktuj sie
            </a>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative bg-brand pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight animate-fade-in">
            Obowi\u0105zkowe roczne<br />zg\u0142oszenie najmu<br />w Hiszpanii<span className="animate-blink">_</span>
          </h1>
        </div>
        <div className="absolute top-24 right-8 w-24 h-24 dot-grid hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 pt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {heroCards.map((card) => (
              <a key={card.title} href="#co-to" className="relative group rounded-lg overflow-hidden aspect-square sm:aspect-auto sm:h-64">
                <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = card.fallback }} />
                <div className="hero-card-overlay absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-1">{card.title}</h3>
                  <p className="text-white/80 text-sm font-medium mb-1">{card.desc}</p>
                  {card.sub && <p className="text-white/60 text-xs leading-snug hidden sm:block">{card.sub}</p>}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-brand leading-snug tracking-tight">
              Od 2026 roku kazdy wlasciciel nieruchomosci z numerem NRUA musi co roku skladac roczne zgloszenie wynajmu do Registro de la Propiedad. Brak zgloszenia oznacza automatyczne cofniecie numeru rejestracyjnego.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <a href="#jak-zlozyc" className="inline-flex items-center mt-10 px-6 py-3 bg-brand-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
              Sprawdz jak zlozyc
            </a>
          </FadeIn>
        </div>
      </section>

      <section id="co-to" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute top-0 left-0 w-20 h-20 dot-grid hidden lg:block" />
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-16 tracking-tight">
              Kluczowe informacje
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            <FadeIn delay={100}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Czym jest NRUA?</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  NRUA (Numero de Registro Unico de Arrendamiento) to unikalny numer rejestracyjny przypisany do nieruchomosci przeznaczonej na wynajem krotkoterminowy w Hiszpanii.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Obowiazek rocznego zgloszenia wynika z Real Decreto 1312/2024, ktory wszedl w zycie 23 grudnia 2024.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Model Informacyjny</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Co roku w lutym musisz zlozyc formularz z danymi o wszystkich wynajmach z poprzedniego roku: daty, liczba gosci, cel najmu.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nawet jesli NIE wynajmowales - musisz zglosic &quot;brak aktywnosci&quot; (sin actividad). To potwierdza ze NRUA jest aktywny.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">To NIE jest</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    Kaucja dla najemcy (fianza)
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    Deklaracja podatkowa IRNR ani Modelo 210
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    Cos skomplikowanego - formularz zajmuje 20-30 minut
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Kto musi zglosic?</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    Masz nieruchomosc w Hiszpanii
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    Posiadasz numer NRUA (uzyskany w 2025)
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    Wynajem krotkoterminowy (turystyczny, wakacyjny, tymczasowy)
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-8 tracking-tight">O obowiazku NRUA</h2>
                <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
                  <p>Od 2026 roku kazdy wlasciciel z numerem NRUA musi co roku w lutym skladac Model Informacyjny z lista wszystkich wynajmow z poprzedniego roku.</p>
                  <p>
                    Jest to obowiazek administracyjny wynikajacy z Real Decreto 1312/2024. Dotyczy to wszystkich wlascicieli nieruchomosci wynajmowanych krotkoterminowo, niezaleznie od{' '}
                    <a href="#faq" className="underline text-brand hover:text-brand-light">rezydencji podatkowej</a>,{' '}
                    <a href="#faq" className="underline text-brand hover:text-brand-light">wspolnoty autonomicznej</a> czy{' '}
                    <a href="#faq" className="underline text-brand hover:text-brand-light">platformy wynajmu</a>. Nawet jesli nie wynajmowales - musisz to zglosic.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <img src="/images/about-spain.jpg" alt="Nieruchomosci w Hiszpanii" className="rounded-lg w-full h-auto object-cover mt-8 lg:mt-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x500/1e3a4a/ffffff/png?text=Hiszpania' }} />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-brand relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-28">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">Termin: 1 lutego – 28 lutego 2026</h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  To sa daty nieprzekraczalne. Nie ma przedluzenia ani okresu karencji. Aplikacja N2 i Rejestr przyjmuja zgloszenia tylko w tym okresie. Przygotuj dokumenty juz teraz.
                </p>
                <a href="#jak-zlozyc" className="inline-flex items-center px-6 py-3 bg-white text-brand text-sm font-medium rounded-md hover:bg-slate-100 transition-colors">
                  Jak zlozyc zgloszenie
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="mt-12 lg:mt-0">
                <p className="text-white/50 text-sm font-medium tracking-wider uppercase mb-4">Do konca terminu pozostalo</p>
                <Countdown />
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute top-8 right-8 w-28 h-28 dot-grid hidden lg:block" />
      </section>

      <section id="jak-zlozyc" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute top-0 right-0 w-20 h-20 dot-grid hidden lg:block" />
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-16 tracking-tight">Jak zlozyc zgloszenie</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 100}>
                <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                  <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                  <span className="text-5xl font-bold text-slate-200">{step.num}</span>
                  <h3 className="text-xl font-bold text-brand mb-3 mt-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={500}>
            <div className="text-center mt-12">
              <a href="#faq" className="inline-flex items-center px-6 py-3 bg-brand-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
                Masz pytania? Sprawdz FAQ
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute bottom-0 left-0 w-20 h-20 dot-grid hidden lg:block" />
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-12 tracking-tight">Dlaczego to wazne</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <AlertTriangle className="w-6 h-6" />, title: 'Automatyczne cofniecie NRUA' },
              { icon: <XCircle className="w-6 h-6" />, title: 'Blokada na Airbnb i Booking' },
              { icon: <Scale className="w-6 h-6" />, title: 'Kary gminne 300-6000\u20AC' },
              { icon: <Clock className="w-6 h-6" />, title: 'Termin nieprzekraczalny' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-brand text-base">{item.title}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-28">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 tracking-tight">Wazne ostrzezenia</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Airbnb i Booking BEDA blokowac ogloszenia bez aktualnego zgloszenia NRUA.',
              'Nie ma znaczenia, czy wynajmowales przez platforme, czy prywatnie - obowiazek dotyczy WSZYSTKICH.',
              'Nawet jesli Twoje mieszkanie stalo puste caly rok, MUSISZ zglosic "brak aktywnosci".',
              'Zlozenie po terminie NIE gwarantuje unikniecia konsekwencji.',
              'Kazda nieruchomosc (CRU) wymaga OSOBNEGO zgloszenia.',
              'Gestoria lub pelnomocnik moga zlozyc zgloszenie za Ciebie - nie musisz jechac do Hiszpanii.',
            ].map((warning, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                  <p className="text-white/80 text-base leading-relaxed">{warning}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <div className="absolute top-8 right-8 w-28 h-28 dot-grid hidden lg:block" />
      </section>

      <section id="faq" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-4 tracking-tight">Najczesciej zadawane pytania</h2>
            <p className="text-lg text-slate-500 mb-12 max-w-2xl">50 pytan i odpowiedzi dotyczacych obowiazku NRUA, pogrupowanych tematycznie.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex flex-wrap gap-2 mb-12">
              {faqCategories.map((cat, i) => (
                <button key={i} onClick={() => setActiveFaqCat(i)} className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${activeFaqCat === i ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {cat.icon}
                  {cat.title}
                </button>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="max-w-3xl">
              <FAQAccordion category={faqCategories[activeFaqCat]} />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute top-0 left-0 w-20 h-20 dot-grid hidden lg:block" />
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-12 tracking-tight">Przypadki szczegolne</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Sprzedaz mieszkania w trakcie roku', desc: 'Sprzedawca zglasza wynajmy do momentu sprzedazy, nowy wlasciciel - od momentu zakupu.', icon: <Building2 className="w-6 h-6" /> },
              { title: 'Nieruchomosc nalezaca do spolki (SL)', desc: 'Zglasza spolka z certyfikatem cyfrowym. Dane: NIF spolki, nazwa, administrator.', icon: <Users className="w-6 h-6" /> },
              { title: 'Wspolwlasnosc (kilku wlascicieli)', desc: 'Jeden ze wspolwlascicieli sklada w imieniu wszystkich. Lepiej nie duplikowac zgloszen.', icon: <Users className="w-6 h-6" /> },
              { title: 'Pelnomocnictwo (gestoria)', desc: 'Gestoria lub rodzina moga zlozyc za Ciebie z pisemnym pelnomocnictwem.', icon: <FileText className="w-6 h-6" /> },
              { title: 'Kilka NRUA (rozne pokoje)', desc: 'Jesli wszystkie NRUA maja ten sam CRU - jedno zgloszenie z lista wszystkich numerow.', icon: <Building2 className="w-6 h-6" /> },
              { title: 'Rezydent podatkowy w Polsce', desc: 'Obowiazek dotyczy WSZYSTKICH wlascicieli z NRUA, niezaleznie od rezydencji.', icon: <Scale className="w-6 h-6" /> },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-slate-50 rounded-lg p-6 sm:p-8 h-full hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-brand mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-10 tracking-tight">Przydatne linki</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Sede Registradores', desc: 'Skladanie elektroniczne', url: 'https://sede.registradores.org' },
              { title: 'Real Decreto 1312/2024', desc: 'Pelny tekst ustawy (BOE)', url: 'https://www.boe.es' },
              { title: 'Aplikacja N2', desc: 'Pobierz oficjalny program', url: 'https://sede.registradores.org' },
              { title: 'Java (wymagana)', desc: 'Pobierz Jave do aplikacji N2', url: 'https://java.com' },
            ].map((link, i) => (
              <FadeIn key={i} delay={i * 80}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-colors group">
                  <h3 className="font-bold text-brand group-hover:text-brand-light transition-colors mb-1">{link.title}</h3>
                  <p className="text-slate-500 text-sm">{link.desc}</p>
                  <ArrowRight className="w-4 h-4 text-brand-accent mt-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="kontakt" className="py-24 sm:py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 gap-16">
            <FadeIn>
              <div>
                <p className="text-brand-accent text-sm font-medium tracking-wider uppercase mb-3">Kontakt</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-6 tracking-tight">Potrzebujesz pomocy? Napisz do nas.</h2>
                <p className="text-lg text-slate-500 leading-relaxed mb-10">Pomagamy polskim wlascicielom nieruchomosci w Hiszpanii z obowiazkami NRUA. Odpowiadamy w ciagu 24 godzin.</p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white flex-shrink-0"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-brand">Email</p>
                    <p className="text-slate-600">kontakt@nruahiszpania.pl</p>
                    <p className="text-slate-400 text-sm">Odpowiadamy w 24h</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white flex-shrink-0"><Phone className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-brand">Telefon</p>
                    <p className="text-slate-600">+34 600 000 000</p>
                    <p className="text-slate-400 text-sm">Pon-Pt 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-brand">Lokalizacja</p>
                    <p className="text-slate-600">Hiszpania</p>
                    <p className="text-slate-400 text-sm">Obslugujemy cala Hiszpanie</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <footer className="bg-brand text-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Informacje o NRUA<br />dla polskich wlascicieli
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Nawigacja</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-sm hover:text-white transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Kontakt</h4>
              <ul className="space-y-3 text-sm">
                <li>kontakt@nruahiszpania.pl</li>
                <li>+34 600 000 000</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Linki zewnetrzne</h4>
              <ul className="space-y-3">
                <li><a href="https://sede.registradores.org" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">Sede Registradores</a></li>
                <li><a href="https://www.boe.es" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">BOE (Real Decreto)</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
                <circle cx="14" cy="14" r="6" fill="currentColor" />
              </svg>
              <span className="text-sm text-white/40">NRUA Hiszpania &copy; {new Date().getFullYear()}. Portal informacyjny.</span>
            </div>
            <p className="text-xs text-white/30">Informacje na stronie nie stanowia porady prawnej. Skonsultuj sie z profesjonalista.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
