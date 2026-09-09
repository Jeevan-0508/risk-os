# Product philosophy

## The central object is the programme, not the risk register

Most tools in this space start from a register — a table of risks — and everything else is a
secondary tab. RISK//OS starts from the programme and treats the risk register as one of thirteen
connected views onto it. The reasoning: a program manager's actual job is not "maintain a risk
list," it is "deliver outcomes despite the things trying to stop them," and a tool that can't show
the chain from a risk to the milestone it threatens to the benefit that milestone unlocks is not
modelling the job, it's modelling a spreadsheet.

## Five questions every screen has to answer

1. What is going wrong?
2. Why is it going wrong? (cause, not symptom)
3. What does it threaten?
4. What are we doing about it?
5. Did the intervention actually work?

If a screen can't be read as an answer to at least one of these, it doesn't belong in the product.
This ruled out several "nice to have" ideas during design — a generic activity feed, a free-text
notes wall, a decorative "programme mood" widget — because none of them answer a question a PM would
actually ask under pressure.

## No unexplained numbers

Every KPI card, every RAG badge, every health score in the app is clickable and shows its own
calculation: the specific records, the formula, and the plain-English sentence a human would say
out loud. This is enforced structurally, not by convention — `healthEngine.ts`'s `HealthDriver[]`
and `riskEngine.ts`'s `drivers: string[]` are populated at the point of calculation, so the
explanation cannot drift out of sync with the number the way a hand-written commentary field would.

## Intelligence has to be explainable

The brief for this product explicitly rules out a decorative AI assistant, a fake predictive claim,
or a generic natural-language summary that isn't grounded in the underlying model. Every "smart"
sentence in the UI — "Risk accelerated 38% because the Vendor API dependency moved Amber → Red,"
"this dependency slipping 14 days threatens €2.1M in benefits" — is produced by a deterministic
function over typed data, and the function is unit tested. There is no LLM call anywhere in this
application, by design: a program manager needs a number they can defend in a steering committee,
not a plausible-sounding paragraph.

## Coverage, not certainty

Anywhere the app estimates something uncertain — a Monte Carlo percentile, a delay probability, a
control's effectiveness — the UI is deliberately worded as a statement about the model's inputs, not
a promise about the future. "In 80% of the sampled outcomes the programme finished within 240 days"
is a true statement about a calculation. "The programme will finish in 240 days" is not, and the app
never says the second thing.

## Why this looks like Mission Control, not Jira

Colour, density and restraint are functional choices, not aesthetic ones:

- **Dark-first, high information density** — a program manager glancing at this screen during a
  steering committee needs the whole picture in one view, not five tabs.
- **Strict colour semantics** (red = threat, amber = attention, green = controlled, blue =
  information, purple = strategic/decision) mean colour alone tells you the category of a number
  before you've read a word of it — and every one of those states also carries a text label, because
  colour alone is not accessible.
- **Restrained animation** is used only for state changes that matter — a risk moving band, a graph
  chain highlighting — never as decoration. Motion is a signal, so it has to stay rare enough to
  still mean something when it happens.
