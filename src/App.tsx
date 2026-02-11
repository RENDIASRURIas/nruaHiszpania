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
  Download,
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
    { label: 'Jak złożyć?', href: '#jak-zlozyc' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontakt', href: '#kontakt' },
  ]

  const heroCards = [
    {
      title: 'Termin',
      desc: '1 lutego – 28 lutego 2026',
      sub: 'Masz czas do końca lutego na przesłanie danych za rok 2025. Uwaga: system zamyka się o północy ostatniego dnia miesiąca.',
      img: '/images/hero-termin.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Termin',
    },
    {
      title: 'Dokumenty',
      desc: 'NIE, NRUA, CRU i dane najemców',
      sub: 'Przygotuj swój numer identyfikacyjny, numer rejestracyjny nieruchomości (NRUA), kod rejestrowy (CRU) oraz anonimowaną listę wszystkich pobytów.',
      img: '/images/hero-dokumenty.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Dokumenty',
    },
    {
      title: 'Proces',
      desc: 'Format XBRL i Sede Electrónica',
      sub: 'Deklaracja musi zostać wysłana w oficjalnym formacie cyfrowym XBRL do hiszpańskiego Rejestru Nieruchomości (Registro de la Propiedad).',
      img: '/images/hero-proces.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Proces',
    },
    {
      title: 'Konsekwencje',
      desc: 'Zawieszenie numeru i blokada ofert',
      sub: 'Brak zgłoszenia lub błędy w danych skutkują natychmiastowym wycofaniem numeru NRUA i usunięciem ogłoszeń z Airbnb oraz Booking.com w ciągu 48h.',
      img: '/images/hero-konsekwencje.jpg',
      fallback: 'https://placehold.co/600x400/1e3a4a/ffffff/png?text=Konsekwencje',
    },
  ]

  const faqCategories: FAQCategory[] = [
    {
      title: 'Obowiązek i Terminy',
      icon: <Calendar className="w-5 h-5" />,
      items: [
        { q: 'Kiedy dokładnie muszę wysłać raport roczny?', a: 'Zgodnie z rozporządzeniem VAU/1560/2025, raport należy złożyć wyłącznie w lutym każdego roku. Przykładowo, dane za rok 2025 przesyłasz w lutym 2026 r.' },
        { q: 'Czy muszę mieć NRUA, jeśli wynajmuję mieszkanie tylko przez miesiąc w roku?', a: 'Tak. Ustawa (Art. 2.c RD 1312/2024) mówi, że obowiązek dotyczy każdego wynajmu krótkoterminowego, niezależnie od tego, czy jest on regularny, czy okazjonalny.' },
        { q: 'Mam licencję turystyczną od lat. Czy to to samo co NRUA?', a: 'Nie. Licencja turystyczna jest regionalna. NRUA to nowy, ogólnokrajowy numer rejestrowy niezbędny do publikowania ogłoszeń w sieci. Licencja jest wymogiem, aby w ogóle móc ubiegać się o NRUA.' },
      ],
    },
    {
      title: 'Dokumenty i Dane',
      icon: <FileText className="w-5 h-5" />,
      items: [
        { q: 'Jakich danych o gościach wymaga system?', a: 'System wymaga listy pobytów, w której podajesz: datę przyjazdu, datę wyjazdu, liczbę gości oraz cel pobytu (np. turystyka, praca). Dane są przesyłane w formacie anonimowym.' },
        { q: 'Co to jest numer CRU i gdzie go znajdę?', a: 'CRU (Código Registral Único) to „PESEL" Twojej nieruchomości w rejestrze gruntów. Znajdziesz go w swojej karcie własności (Nota Simple). Jest niezbędny do poprawnej identyfikacji nieruchomości w systemie NRUA.' },
        { q: 'Nie wynajmowałem mieszkania w tym roku. Czy mogę pominąć zgłoszenie?', a: 'Absolutnie nie. Musisz złożyć raport z zaznaczoną opcją „Sin actividad" (brak aktywności). Jeśli tego nie zrobisz, Twój numer NRUA może zostać wyrejestrowany.' },
      ],
    },
    {
      title: 'Proces i Aplikacja',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { q: 'Czy mogę wysłać raport w formie PDF lub e-mailem?', a: 'Nie. Oficjalnym formatem jest XBRL (specyfikacja 2.1). Jest to format cyfrowy czytelny dla maszyn, przesyłany przez platformę elektroniczną Kolegium Rejestratorów.' },
        { q: 'Ile kosztuje złożenie raportu rocznego?', a: 'Aktualna opłata rejestrowa wynosi 27,05 € za każde zgłoszenie (za każdy numer NRUA).' },
        { q: 'Czy muszę osobiście jechać do Hiszpanii, aby to załatwić?', a: 'Nie. Cały proces odbywa się online. Możesz upoważnić pełnomocnika lub gestorię, która wyśle raport w Twoim imieniu.' },
      ],
    },
    {
      title: 'Konsekwencje i Kary',
      icon: <AlertTriangle className="w-5 h-5" />,
      items: [
        { q: 'Co się stanie, jeśli zapomnę o raporcie w lutym?', a: 'Rejestrator (Registrador de la Propiedad) może zawiesić ważność Twojego numeru NRUA. W efekcie Airbnb, Booking i inne platformy otrzymają nakaz usunięcia Twojego ogłoszenia w ciągu 48 godzin (Art. 10.2 RD 1312/2024).' },
        { q: 'Jakie kary finansowe grożą za brak NRUA?', a: 'Sam dekret NRUA odsyła do istniejących przepisów regionalnych. W zależności od regionu (np. Walencja, Andaluzja), kary za nielegalny wynajem lub brak wymaganych rejestracji mogą sięgać nawet 600.000 € w przypadku bardzo poważnych naruszeń.' },
        { q: 'Czy Airbnb samo prześle moje dane do rejestru?', a: 'Platformy przesyłają dane o aktywności (liczba nocy/gości), ale to Ty jako właściciel masz prawny obowiązek posiadania aktywnego numeru NRUA i składania corocznego modelu informacyjnego w rejestrze.' },
      ],
    },
  ]

  const steps = [
    { num: '01', title: 'Zbierz Dokumenty i Dane', desc: 'Przygotuj: NIE/NIF, numer NRUA, kod CRU, dane wszystkich wynajmów z 2025 roku (daty, liczba gości, cel najmu).', icon: <FileText className="w-7 h-7" /> },
    { num: '02', title: 'Pobierz Aplikacje N2', desc: 'Oficjalny program Colegio de Registradores. Pobierz ze strony sede.registradores.org. Wymaga: Windows 10+ lub macOS, Java 8+.', icon: <BookOpen className="w-7 h-7" /> },
    { num: '03', title: 'Wypełnij Formularz', desc: 'Uruchom aplikację N2, wybierz "Nuevo depósito", rok 2025, wpisz dane właściciela, dane nieruchomości (CRU, NRUA), informacje o wynajmach.', icon: <CheckCircle2 className="w-7 h-7" /> },
    { num: '04', title: 'Złóż Elektronicznie lub Osobiście', desc: 'Elektronicznie: z certyfikatem cyfrowym na sede.registradores.org. Osobiście: wydrukuj formularz i zanieś do Registro de la Propiedad.', icon: <Shield className="w-7 h-7" /> },
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
                Skontaktuj się
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
              Skontaktuj się
            </a>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative bg-brand pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 sm:pt-24 pb-12 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in mb-6" style={{color: '#5de0c0'}}>
            Kto musi mieć numer NRUA?
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Zgodnie z hiszpańskim dekretem (RD 1312/2024), numer ten jest obowiązkowy dla każdego (osoby prywatnej lub firmy), kto chce reklamować wynajem krótkoterminowy <strong className="text-white font-bold">w internecie</strong>.
          </p>
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
              Od 2026 roku każdy właściciel nieruchomości z numerem NRUA ma obowiązek składać coroczną deklarację wynajmu w hiszpańskim Registro de la Propiedad. Pamiętaj, że musisz to zrobić w lutym. Brak zgłoszenia oznacza automatyczne unieważnienie Twojego numeru i usunięcie ogłoszeń z platform takich jak Airbnb czy Booking.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <a href="#jak-zlozyc" className="inline-flex items-center mt-10 px-6 py-3 bg-brand-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
              Sprawdź jak złożyć
            </a>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-4 tracking-tight">Dokumenty do pobrania</h2>
            <p className="text-slate-500 mb-10 max-w-2xl">Oficjalne instrukcje przetłumaczone na język polski. Pobierz i zachowaj na swoim urządzeniu.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            <FadeIn>
              <a href="/docs/instrukcja-n2.pdf" download className="flex items-center gap-5 bg-white rounded-lg p-6 hover:shadow-lg transition-all group border border-slate-200">
                <div className="w-14 h-14 rounded-lg bg-brand flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand group-hover:text-brand-light transition-colors mb-1">Instrukcja instalacji i tworzenia depozytów czynszowych w aplikacji N2</h3>
                  <p className="text-slate-400 text-sm">PDF — Instrukcja krok po kroku</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            </FadeIn>
            <FadeIn delay={100}>
              <a href="/docs/podrecznik-depozyt.pdf" download className="flex items-center gap-5 bg-white rounded-lg p-6 hover:shadow-lg transition-all group border border-slate-200">
                <div className="w-14 h-14 rounded-lg bg-brand flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand group-hover:text-brand-light transition-colors mb-1">Podręcznik wprowadzający — Depozyt z tytułu najmu</h3>
                  <p className="text-slate-400 text-sm">PDF — Przewodnik po depozycie</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            </FadeIn>
          </div>
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
                <p className="text-slate-600 leading-relaxed">
                  NRUA (Número de Registro Único de Arrendamientos) to unikalny numer przypisany do Twojej nieruchomości w hiszpańskim rejestrze. Jest on niezbędny, abyś mógł legalnie reklamować swój wynajem w internecie. Obowiązek posiadania numeru oraz składania raportów wynika z dekretu Real Decreto 1312/2024, który obowiązuje od 2 stycznia 2025 roku.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Model Informacyjny (Zgłoszenie roczne)</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Każdy właściciel z numerem NRUA musi raz w roku, wyłącznie w lutym, złożyć sprawozdanie za rok poprzedni. W formularzu podaje się:
                </p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li className="flex items-start gap-2"><span className="text-brand-accent mt-1">•</span>Daty zameldowania i wymeldowania gości.</li>
                  <li className="flex items-start gap-2"><span className="text-brand-accent mt-1">•</span>Liczbę osób przebywających w nieruchomości.</li>
                  <li className="flex items-start gap-2"><span className="text-brand-accent mt-1">•</span>Cel najmu (np. turystyczny, praca, studia).</li>
                </ul>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Ważne: Brak wynajmu też trzeba zgłosić! Nawet jeśli w danym roku Twoja nieruchomość stała pusta, masz obowiązek wysłać zgłoszenie z zaznaczoną opcją &quot;Sin actividad&quot; (brak aktywności). Tylko w ten sposób zachowasz ważność swojego numeru NRUA i unikniesz jego wyrejestrowania.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Czym NIE JEST roczne zgłoszenie NRUA?</h3>
                <p className="text-slate-600 leading-relaxed mb-4">Aby uniknąć pomyłek, pamiętaj, że to zgłoszenie:</p>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>To NIE jest kaucja (fianza):</strong> Nie ma nic wspólnego z depozytem wpłacanym do lokalnych urzędów (jak AVRA czy IBAVI).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>To NIE jest deklaracja podatkowa (IRNR / Modelo 210):</strong> To obowiązek informacyjny dla Rejestru Nieruchomości, a nie podatkowy dla Urzędu Skarbowego.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>To NIE jest skomplikowane:</strong> Jeśli masz przygotowane daty wynajmu, wypełnienie formularza zajmuje średnio 20-30 minut.</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Kto musi złożyć sprawozdanie?</h3>
                <p className="text-slate-600 leading-relaxed mb-4">Obowiązek ten dotyczy Cię, jeśli spełniasz te trzy warunki:</p>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    <span>Masz nieruchomość w Hiszpanii (mieszkanie, dom, a nawet łódź mieszkalną).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    <span>Posiadasz numer NRUA (uzyskany w 2025 roku lub później).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    <span>Wynajmujesz krótkoterminowo: Twoja oferta pojawia się w internecie w celach turystycznych, wakacyjnych, zawodowych lub studenckich.</span>
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
                <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-8 tracking-tight">O obowiązku NRUA</h2>
                <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
                  <p>Od 2026 roku każdy właściciel z numerem NRUA musi co roku w lutym składać Model Informacyjny z listą wszystkich wynajmów z poprzedniego roku.</p>
                  <p>
                    Jest to obowiązek administracyjny wynikający z Real Decreto 1312/2024. Dotyczy to wszystkich właścicieli nieruchomości wynajmowanych krótkoterminowo, niezależnie od{' '}
                    <a href="#faq" className="underline text-brand hover:text-brand-light">rezydencji podatkowej</a>,{' '}
                    <a href="#faq" className="underline text-brand hover:text-brand-light">wspólnoty autonomicznej</a> czy{' '}
                    <a href="#faq" className="underline text-brand hover:text-brand-light">platformy wynajmu</a>. Nawet jeśli nie wynajmowałeś - musisz to zgłosić.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <img src="/images/about-spain.jpg" alt="Nieruchomości w Hiszpanii" className="rounded-lg w-full h-auto object-cover mt-8 lg:mt-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x500/1e3a4a/ffffff/png?text=Hiszpania' }} />
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
                  To są daty nieprzekraczalne. Nie ma przedłużenia ani okresu karencji. Aplikacja N2 i Rejestr przyjmują zgłoszenia tylko w tym okresie. Przygotuj dokumenty już teraz.
                </p>
                <a href="#jak-zlozyc" className="inline-flex items-center px-6 py-3 bg-white text-brand text-sm font-medium rounded-md hover:bg-slate-100 transition-colors">
                  Jak złożyć zgłoszenie
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="mt-12 lg:mt-0">
                <p className="text-white/50 text-sm font-medium tracking-wider uppercase mb-4">Do końca terminu pozostało</p>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-16 tracking-tight">Jak złożyć zgłoszenie</h2>
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
            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <a href="/docs/instrukcja-n2.pdf" download className="flex items-center gap-5 bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-all group border border-slate-200">
                <div className="w-14 h-14 rounded-lg bg-brand flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand group-hover:text-brand-light transition-colors mb-1">Instrukcja instalacji i tworzenia depozytów czynszowych w aplikacji N2</h3>
                  <p className="text-slate-400 text-sm">PDF — Instrukcja krok po kroku</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/docs/podrecznik-depozyt.pdf" download className="flex items-center gap-5 bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-all group border border-slate-200">
                <div className="w-14 h-14 rounded-lg bg-brand flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand group-hover:text-brand-light transition-colors mb-1">Podręcznik wprowadzający — Depozyt z tytułu najmu</h3>
                  <p className="text-slate-400 text-sm">PDF — Przewodnik po depozycie</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={600}>
            <div className="text-center mt-12">
              <a href="#faq" className="inline-flex items-center px-6 py-3 bg-brand-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
                Masz pytania? Sprawdź FAQ
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute bottom-0 left-0 w-20 h-20 dot-grid hidden lg:block" />
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-12 tracking-tight">Dlaczego to ważne</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <AlertTriangle className="w-6 h-6" />, title: 'Automatyczne cofnięcie NRUA' },
              { icon: <XCircle className="w-6 h-6" />, title: 'Blokada na Airbnb i Booking' },
              { icon: <Scale className="w-6 h-6" />, title: 'Kary gminne 300-6000€' },
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Ważne ostrzeżenia</h2>
            <p className="text-white/60 mb-10 text-lg">Przeczytaj koniecznie!</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Airbnb i Booking będą blokować ogłoszenia', desc: 'Platformy mają obowiązek usunąć Twoją ofertę w ciągu 48h, jeśli Twój numer NRUA zostanie zawieszony z powodu braku rocznego zgłoszenia.' },
              { title: 'Reklamujesz się w sieci? Musisz mieć NRUA', desc: 'Jeśli Twoja oferta widnieje na jakiejkolwiek platformie internetowej, masz obowiązek posiadać aktywny numer i składać raporty.' },
              { title: 'Mieszkanie puste? Też musisz wysłać raport', desc: 'Jeśli nieruchomość nie była wynajmowana, musisz zaznaczyć opcję „Sin actividad", aby zachować ważność numeru w rejestrze.' },
              { title: 'Luty to termin ostateczny', desc: 'Złożenie raportu po 28 lutego może nie uchronić Cię przed zablokowaniem ogłoszeń przez systemy automatyczne.' },
              { title: 'Jedno zgłoszenie na jeden CRU', desc: 'Jeśli masz dwa mieszkania (dwa numery CRU), musisz wysłać dwa osobne formularze.' },
              { title: 'Nie musisz być w Hiszpanii', desc: 'Cały proces odbywa się cyfrowo. Twój pełnomocnik lub gestoría może złożyć raport w Twoim imieniu przez system XBRL.' },
            ].map((warning, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-white font-bold mb-2">{warning.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{warning.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <div className="absolute top-8 right-8 w-28 h-28 dot-grid hidden lg:block" />
      </section>

      <section id="faq" className="py-24 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-brand-accent text-sm font-medium tracking-wider uppercase mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-4 tracking-tight">Najczęściej zadawane pytania</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Odpowiedzi na najważniejsze pytania dotyczące obowiązku NRUA, pogrupowane tematycznie.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              {faqCategories.map((cat, i) => (
                <button key={i} onClick={() => setActiveFaqCat(i)} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all border ${activeFaqCat === i ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'}`}>
                  {cat.icon}
                  {cat.title}
                </button>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white">
                  {faqCategories[activeFaqCat].icon}
                </div>
                <h3 className="text-xl font-bold text-brand">{faqCategories[activeFaqCat].title}</h3>
              </div>
              <FAQAccordion category={faqCategories[activeFaqCat]} />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute top-0 left-0 w-20 h-20 dot-grid hidden lg:block" />
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand mb-12 tracking-tight">Przypadki szczególne</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Sprzedaż mieszkania w trakcie roku', desc: 'Sprzedawca zgłasza wynajmy do momentu sprzedaży, nowy właściciel - od momentu zakupu.', icon: <Building2 className="w-6 h-6" /> },
              { title: 'Nieruchomość należąca do spółki (SL)', desc: 'Zgłasza spółka z certyfikatem cyfrowym. Dane: NIF spółki, nazwa, administrator.', icon: <Users className="w-6 h-6" /> },
              { title: 'Współwłasność (kilku właścicieli)', desc: 'Jeden ze współwłaścicieli składa w imieniu wszystkich. Lepiej nie duplikować zgłoszeń.', icon: <Users className="w-6 h-6" /> },
              { title: 'Pełnomocnictwo (gestoría)', desc: 'Gestoría lub rodzina mogą złożyć za Ciebie z pisemnym pełnomocnictwem.', icon: <FileText className="w-6 h-6" /> },
              { title: 'Kilka NRUA (różne pokoje)', desc: 'Jeśli wszystkie NRUA mają ten sam CRU - jedno zgłoszenie z listą wszystkich numerów.', icon: <Building2 className="w-6 h-6" /> },
              { title: 'Rezydent podatkowy w Polsce', desc: 'Obowiązek dotyczy WSZYSTKICH właścicieli z NRUA, niezależnie od rezydencji.', icon: <Scale className="w-6 h-6" /> },
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
              { title: 'Sede Registradores', desc: 'Składanie elektroniczne', url: 'https://sede.registradores.org' },
              { title: 'Real Decreto 1312/2024', desc: 'Pełny tekst ustawy (BOE)', url: 'https://www.boe.es' },
              { title: 'Aplikacja N2', desc: 'Pobierz oficjalny program', url: 'https://sede.registradores.org' },
              { title: 'Java (wymagana)', desc: 'Pobierz Javę do aplikacji N2', url: 'https://java.com' },
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
                <p className="text-lg text-slate-500 leading-relaxed mb-10">Pomagamy polskim właścicielom nieruchomości w Hiszpanii z obowiązkami NRUA. Odpowiadamy w ciągu 24 godzin.</p>
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
                    <p className="text-slate-400 text-sm">Obsługujemy całą Hiszpanię</p>
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
              Informacje o NRUA<br />dla polskich właścicieli
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
              <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Linki zewnętrzne</h4>
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
            <p className="text-xs text-white/30">Informacje zawarte na tej stronie mają charakter wyłącznie informacyjny i nie stanowią porady prawnej. Procedury oparte są na Real Decreto 1312/2024 i Orden VAU/1560/2025. W przypadku skomplikowanych spraw zalecamy konsultację z profesjonalną gestorią lub prawnikiem w Hiszpanii.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
