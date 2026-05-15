import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Clipboard,
  CreditCard,
  ConciergeBell,
  Cpu,
  Landmark,
  Coins,
  Search,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { referrals } from './data/referrals';

const categoryIcons = {
  All: Sparkles,
  Brokerages: WalletCards,
  Crypto: Coins,
  'Credit Cards': CreditCard,
  Banks: Landmark,
  Auto: ShieldCheck,
  Shopping: ShoppingBag,
  Food: ConciergeBell,
  Travel: ArrowUpRight,
  Tech: Cpu,
};

const accentStyles = {
  emerald: {
    logo: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
  },
  red: {
    logo: 'bg-red-50 text-red-800 ring-red-100',
  },
  lime: {
    logo: 'bg-lime-50 text-lime-800 ring-lime-100',
  },
  sky: {
    logo: 'bg-sky-50 text-sky-800 ring-sky-100',
  },
  amber: {
    logo: 'bg-amber-50 text-amber-800 ring-amber-100',
  },
};

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  const categories = useMemo(() => {
    const dataCategories = [...new Set(referrals.map((referral) => referral.category))];
    const priorityCategories = ['Brokerages', 'Credit Cards'];
    const remainingCategories = dataCategories.filter((category) => !priorityCategories.includes(category));

    return ['All', ...priorityCategories, ...remainingCategories];
  }, []);

  const filteredReferrals = useMemo(() => {
    if (activeCategory === 'All') {
      return referrals;
    }

    return referrals.filter((referral) => referral.category === activeCategory);
  }, [activeCategory]);

  const handleCopy = async (referral) => {
    try {
      await navigator.clipboard.writeText(referral.referralUrl);
      setCopiedId(referral.id);
      setToastVisible(true);

      window.setTimeout(() => {
        setCopiedId(null);
        setToastVisible(false);
      }, 1800);
    } catch {
      setToastVisible(true);
      window.setTimeout(() => setToastVisible(false), 1800);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ef] text-stone-950">
      <section className="relative px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,#ede5d7_0%,#f7f4ef_78%)]" />
        <div className="relative mx-auto max-w-7xl">
          <header className="flex flex-col gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
                Referral directory for popular products and services
              </p>
              <h1 className="text-4xl font-extrabold tracking-normal text-stone-950 sm:text-5xl">
                Weian's Referral Hub
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
                A simple place to get referral benefits, open product pages, or copy links directly.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-3 text-sm font-semibold text-stone-600 ring-1 ring-stone-200 backdrop-blur">
              <Search className="h-4 w-4 text-stone-400" />
              <span>{referrals.length} offers available</span>
            </div>
          </header>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = categoryIcons[category] ?? Sparkles;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'bg-white/80 text-stone-600 ring-1 ring-stone-200 hover:text-stone-950 hover:ring-stone-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category}
                </button>
              );
            })}
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredReferrals.map((referral) => (
              <ReferralCard
                key={referral.id}
                referral={referral}
                copied={copiedId === referral.id}
                onCopy={() => handleCopy(referral)}
              />
            ))}
          </section>
        </div>
      </section>

      <div
        className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-950 px-4 py-3 text-sm font-bold text-white shadow-2xl transition duration-300 ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        role="status"
        aria-live="polite"
      >
        Link copied to clipboard!
      </div>
    </main>
  );
}

function ReferralCard({ referral, copied, onCopy }) {
  const accent = accentStyles[referral.accent] ?? accentStyles.emerald;

  return (
    <article className="group flex min-h-[270px] flex-col rounded-lg bg-white/90 p-5 ring-1 ring-stone-200 transition hover:bg-white hover:shadow-lg hover:shadow-stone-200/70">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-black ring-1 ${accent.logo}`}>
            {referral.logoUrl}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold text-stone-950">{referral.companyName}</h2>
            <span className="text-sm font-semibold text-stone-500">{referral.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 border-t border-stone-100 pt-5">
        <p className="text-lg font-bold leading-snug text-stone-900">{referral.benefitText}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <a
          href={referral.referralUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-extrabold text-white transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
        >
          Open Link
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${referral.companyName} referral link`}
          title={`Copy ${referral.companyName} referral link`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-extrabold text-stone-700 ring-1 ring-stone-200 transition hover:bg-stone-50 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-stone-300"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>
    </article>
  );
}

export default App;
