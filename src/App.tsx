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
        { q: 'Jaki jest dokładny termin złożenia zgłoszenia?', a: 'Od 1 lutego do 28 lutego 2026 włącznie. To są daty nieprzekraczalne ustalone przez Real Decreto 1312/2024.' },
        { q: 'Co jeśli złożę 1 marca (dzień po terminie)?', a: 'Rejestr rozpocznie procedurę cofnięcia NRUA. Nie ma przedłużenia ani "okresu karencji". System jest automatyczny.' },
        { q: 'Czy mogę złożyć wcześniej, np. w styczniu?', a: 'Nie. Aplikacja N2 i Rejestr przyjmują zgłoszenia tylko w lutym.' },
        { q: 'Czy to jest obowiązek jednorazowy czy powtarzający się?', a: 'Powtarzający się co roku. Każdego lutego musisz zgłosić wynajmy z poprzedniego roku.' },
        { q: 'Czy są jakieś wyjątki od tego obowiązku?', a: 'Nie. Każdy z NRUA musi zgłosić, nawet jeśli nie wynajmował (wtedy "sin actividad" - brak aktywności).' },
        { q: 'Czy gmina może przedłużyć termin?', a: 'Nie. To obowiązek państwowy (Real Decreto), gminy nie mają wpływu na terminy.' },
        { q: 'Otrzymam powiadomienie email że muszę zgłosić?', a: 'Prawdopodobnie NIE. Rejestr nie wysyła przypomnień. To Twój obowiązek śledzić termin.' },
        { q: 'Co jeśli jestem chory w lutym?', a: 'Możesz upoważnić pełnomocnika (gestoría, rodzina) do złożenia za Ciebie. Wymaga to pisemnego pełnomocnictwa.' },
        { q: 'Czy muszę zgłosić jeśli mieszkanie było puste cały 2025?', a: 'TAK. Musisz zgłosić zaznaczając "sin actividad" (brak wynajmu). To potwierdza że NRUA jest aktywny.' },
        { q: 'Czy mogę poprosić o odroczenie terminu?', a: 'Nie. Termin jest sztywny dla wszystkich. Jedynym wyjściem jest złożenie w wymaganym okresie lub udzielenie pełnomocnictwa.' },
      ],
    },
    {
      title: 'Dokumenty i Dane',
      icon: <FileText className="w-5 h-5" />,
      items: [
        { q: 'Nie pamiętam swojego numeru NRUA. Gdzie go znaleźć?', a: 'Sprawdź: dokument od Urzędu Gminy, ogłoszenie na Airbnb/Booking (musi być tam widoczny), lub zapytaj w Urzędzie Gminy gdzie rejestrowałeś.' },
        { q: 'Co to jest CRU i gdzie go znaleźć?', a: 'CRU (Código Registral Único) to kod nieruchomości w Rejestrze Własności. Znajdziesz w: dokumencie NRUA, escritura (akt notarialny) lub nota simple (wypis z Rejestru).' },
        { q: 'Nie mam certyfikatu cyfrowego. Czy mogę złożyć?', a: 'TAK. Możesz złożyć osobiście w Rejestrze Własności lub zlecić profesjonaliście który posiada certyfikat.' },
        { q: 'Czy potrzebuję kopii umów najmu?', a: 'Nie. Wystarczają: daty, liczba gości, cel najmu. Umowy zachowaj dla siebie (na wypadek kontroli).' },
        { q: 'Wynajmowałem 20 razy w 2025. Muszę każdy wypisać?', a: 'TAK, ale aplikacja N2 pozwala zgrupować. Wpisz datę pierwszego i ostatniego wynajmu w roku oraz łączną liczbę gości.' },
        { q: 'Nie pamiętam dokładnych dat wynajmów. Co robić?', a: 'Sprawdź: wyciągi bankowe (wpłaty od Airbnb/Booking), kalendarz Airbnb (zakładka "Rezerwacje"), panel Booking (Historia), emaile potwierdzające rezerwacje.' },
        { q: 'Czy muszę podać dane gości (imiona, nazwiska)?', a: 'NIE. Zgłoszenie jest anonimowe. Podajesz tylko: liczbę osób, daty, cel.' },
        { q: 'Mam nieruchomość w spółce (SL). Jakie dane podać?', a: 'NIF spółki, nazwa spółki, administrator lub osoba upoważniona, email kontaktowy spółki.' },
        { q: 'Czy mogę zgłosić kilka nieruchomości jednym formularzem?', a: 'Nie. Każdy CRU (nieruchomość) wymaga osobnego zgłoszenia.' },
        { q: 'Straciłem dokument z NRUA. Mogę uzyskać duplikat?', a: 'TAK. Zwróć się do Urzędu Gminy który wydał NRUA. Poproś o "certificado duplicado NRUA".' },
      ],
    },
    {
      title: 'Proces i Aplikacja N2',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { q: 'Czy aplikacja N2 jest w języku polskim?', a: 'Nie. Jest po hiszpańsku i angielsku. Dlatego przygotowaliśmy manual w języku polskim.' },
        { q: 'Aplikacja N2 nie chce się zainstalować. Co robić?', a: 'Sprawdź: czy masz Javę zainstalowaną (java.com), pobierz ponownie z oficjalnej strony, lub spróbuj na innym komputerze. Napisz do nas - pomożemy.' },
        { q: 'Czy mogę wypełnić formularz na telefonie?', a: 'Nie. Aplikacja N2 działa tylko na komputerze (Windows/Mac). Nie ma wersji mobilnej.' },
        { q: 'Ile czasu zajmuje wypełnienie formularza?', a: 'Z przygotowanymi danymi: 20-30 minut. Bez przygotowania: 1-2 godziny (szukanie dat, liczenie gości).' },
        { q: 'Czy mogę zapisać formularz i wrócić później?', a: 'TAK. Aplikacja N2 pozwala zapisać rozpracowywany formularz i dokończyć później.' },
        { q: 'Popełniłem błąd w zgłoszeniu. Czy mogę poprawić?', a: 'TAK, ale tylko jeśli jeszcze nie wysłałeś. Po wysłaniu musisz złożyć "rectificación" (poprawkę).' },
        { q: 'Jak wygląda potwierdzenie odbioru?', a: 'PDF z: numerem rejestrowym zgłoszenia, data i godzina złożenia, pieczęć elektroniczna Rejestru, Twoje dane i NRUA.' },
        { q: 'Ile czeka się na potwierdzenie?', a: 'Elektroniczne: 24-48 godzin. Osobiste: natychmiast (pieczęć na dokumencie).' },
        { q: 'Rejestr odrzucił moje zgłoszenie. Co robić?', a: 'Sprawdź powód odrzucenia (powinien być w emailu). Najczęstsze: błędny CRU, NRUA niezgodny z bazą, brakujące dane. Popraw i złóż ponownie.' },
        { q: 'Czy mogę złożyć zgłoszenie za kogoś (rodzina, znajomy)?', a: 'TAK, jeśli masz pisemne pełnomocnictwo od właściciela.' },
      ],
    },
    {
      title: 'Konsekwencje i Kary',
      icon: <AlertTriangle className="w-5 h-5" />,
      items: [
        { q: 'Co DOKŁADNIE się stanie jeśli nie złożę?', a: 'Rejestr Własności cofnie NRUA (automatycznie), informacja trafi do Ventanilla Única Digital, Airbnb/Booking zablokują Twoje ogłoszenie, nie będziesz mógł legalnie wynajmować, możliwe kary gminne (300-3000€).' },
        { q: 'Czy będę mógł odzyskać NRUA po cofnięciu?', a: 'TAK, ale musisz przejść cały proces od nowa (jak przy pierwszej rejestracji). To kosztuje czas i pieniądze.' },
        { q: 'Airbnb już mi zablokował ogłoszenie. Co robić?', a: 'Złóż zgłoszenie NATYCHMIAST, uzyskaj potwierdzenie, wyślij do Airbnb jako dowód. Czekaj na odblokowanie (może zająć 7-14 dni).' },
        { q: 'Czy Urząd Skarbowy też zostanie poinformowany?', a: 'Nie bezpośrednio. To są dwa niezależne systemy. Ale Hacienda może uzyskać dostęp do danych.' },
        { q: 'Czy mogę dostać karę pieniężną oprócz cofnięcia NRUA?', a: 'TAK. Gminy mogą nałożyć kary za: brak zgłoszenia (300-1500€), wynajmowanie bez NRUA (1000-3000€), powtarzające się naruszenie (do 6000€).' },
        { q: 'Czy kara jest taka sama w całej Hiszpanii?', a: 'Nie. Każda Wspólnota Autonomiczna ma swoje stawki. Najsurowsze: Katalonia, Baleary.' },
        { q: 'Jak długo trwa cofnięcie NRUA?', a: 'Po terminie 28 lutego Rejestr ma 30 dni na wysłanie ostrzeżenia. Potem kolejne 15 dni na cofnięcie. Razem ok. 45-60 dni.' },
        { q: 'Otrzymam ostrzeżenie przed cofnięciem?', a: 'Prawdopodobnie TAK, ale nie zawsze. Rejestr powinien wysłać "requerimiento" (wezwanie), ale terminy są krótkie.' },
        { q: 'Czy mogę odwołać się od cofnięcia NRUA?', a: 'TAK, ale tylko jeśli masz uzasadniony powód (np. błąd Rejestru, siła wyższa). Termin: 15 dni od powiadomienia.' },
        { q: 'Czy ktoś już stracił NRUA za brak zgłoszenia?', a: 'To pierwszy rok tego obowiązku (2026), więc przypadków jeszcze nie ma. Ale prawo jest jasne - będzie egzekwowane.' },
      ],
    },
    {
      title: 'Przypadki Szczególne',
      icon: <Users className="w-5 h-5" />,
      items: [
        { q: 'Sprzedałem mieszkanie w lipcu 2025. Kto zgłasza?', a: 'TY: wynajmy styczeń-lipiec 2025. NOWY WŁAŚCICIEL: wynajmy sierpień-grudzień 2025. Każdy za swój okres.' },
        { q: 'Kupiłem mieszkanie z NRUA. Przechodzi na mnie?', a: 'TAK. NRUA jest związany z nieruchomością. Ale musisz zaktualizować dane właściciela w Urzędzie Gminy.' },
        { q: 'Wynajmuję mieszkanie mojej matki. Kto zgłasza?', a: 'Właściciel (matka) lub osoba z pełnomocnictwem. Potrzebne: dokument pełnomocnictwa notarialny.' },
        { q: 'Mam współwłaścicieli (50/50). Kto zgłasza?', a: 'Jeden ze współwłaścicieli w imieniu wszystkich. Lub każdy osobno (ale wtedy duplikacja - lepiej jeden).' },
        { q: 'NRUA jest na spółkę, ale ja wynajmuję prywatnie. Co robić?', a: 'NRUA musi być zgodny z właścicielem w Rejestrze. Jeśli spółka jest właścicielem - zgłasza spółka.' },
        { q: 'Mam kilka NRUA dla jednego mieszkania (różne pokoje). Ile zgłoszeń?', a: 'Jeśli wszystkie NRUA mają ten sam CRU - jedno zgłoszenie (lista wszystkich NRUA w jednym formularzu).' },
        { q: 'Czy gestoría może to zrobić za mnie?', a: 'TAK. Większość gestorías oferuje tę usługę. Możesz też skontaktować się z nami.' },
        { q: 'Wynajmuję przez Airbnb. Oni nie zgłaszają za mnie?', a: 'NIE. Airbnb/Booking tylko udostępniają platformę. Obowiązek prawny leży po stronie właściciela.' },
        { q: 'Jestem rezydentem podatkowym w Polsce. Czy to dotyczy mnie?', a: 'TAK. Obowiązek dotyczy wszystkich właścicieli z NRUA, niezależnie od rezydencji podatkowej.' },
        { q: 'Gdzie mogę uzyskać pomoc jeśli mam problem?', a: 'Nasz email: kontakt@nruahiszpania.pl (odpowiadamy w 24h). Możesz też zwrócić się do Rejestru Własności lub Urzędu Gminy który wydał NRUA.' },
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight animate-fade-in mb-6">
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
              Od 2026 roku każdy właściciel nieruchomości z numerem NRUA musi co roku składać roczne zgłoszenie wynajmu do Registro de la Propiedad. Brak zgłoszenia oznacza automatyczne cofnięcie numeru rejestracyjnego.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <a href="#jak-zlozyc" className="inline-flex items-center mt-10 px-6 py-3 bg-brand-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
              Sprawdź jak złożyć
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
                  NRUA (Número de Registro Único de Arrendamiento) to unikalny numer rejestracyjny przypisany do nieruchomości przeznaczonej na wynajem krótkoterminowy w Hiszpanii.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Obowiązek rocznego zgłoszenia wynika z Real Decreto 1312/2024, który wszedł w życie 23 grudnia 2024.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Model Informacyjny</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Co roku w lutym musisz złożyć formularz z danymi o wszystkich wynajmach z poprzedniego roku: daty, liczba gości, cel najmu.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nawet jeśli NIE wynajmowałeś - musisz zgłosić &quot;brak aktywności&quot; (sin actividad). To potwierdza że NRUA jest aktywny.
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
                    Coś skomplikowanego - formularz zajmuje 20-30 minut
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="bg-slate-50 rounded-lg p-8 sm:p-10 h-full relative group hover:bg-slate-100 transition-colors">
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-accent" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-3">Kto musi zgłosić?</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    Masz nieruchomość w Hiszpanii
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    Posiadasz numer NRUA (uzyskany w 2025)
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                    Wynajem krótkoterminowy (turystyczny, wakacyjny, tymczasowy)
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 tracking-tight">Ważne ostrzeżenia</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Airbnb i Booking BĘDĄ blokować ogłoszenia bez aktualnego zgłoszenia NRUA.',
              'Nie ma znaczenia, czy wynajmowałeś przez platformę, czy prywatnie - obowiązek dotyczy WSZYSTKICH.',
              'Nawet jeśli Twoje mieszkanie stało puste cały rok, MUSISZ zgłosić "brak aktywności".',
              'Złożenie po terminie NIE gwarantuje uniknięcia konsekwencji.',
              'Każda nieruchomość (CRU) wymaga OSOBNEGO zgłoszenia.',
              'Gestoría lub pełnomocnik mogą złożyć zgłoszenie za Ciebie - nie musisz jechać do Hiszpanii.',
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand mb-4 tracking-tight">Najczęściej zadawane pytania</h2>
            <p className="text-lg text-slate-500 mb-12 max-w-2xl">50 pytań i odpowiedzi dotyczących obowiązku NRUA, pogrupowanych tematycznie.</p>
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
            <p className="text-xs text-white/30">Informacje na stronie nie stanowią porady prawnej. Skonsultuj się z profesjonalistą.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
