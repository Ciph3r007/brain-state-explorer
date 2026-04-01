/**
 * Brain states: activity levels (0-100) per region, neurotransmitter levels,
 * active pathways, insights, and key changes.
 *
 * regionActivity keys match REGIONS keys (use 'temporal' for both L/R).
 * nt keys match NEUROTRANSMITTERS ids.
 */

// Compact builder: [pfc, parietal, temporal, occipital, thalamus, hypothalamus, hippocampus, amygdala, cerebellum, brainstem, insula, cingulate, basalganglia]
const R = (pfc,par,tmp,occ,thl,hyp,hip,amy,cer,bst,ins,cin,bg) => ({pfc,parietal:par,temporal:tmp,occipital:occ,thalamus:thl,hypothalamus:hyp,hippocampus:hip,amygdala:amy,cerebellum:cer,brainstem:bst,insula:ins,cingulate:cin,basalganglia:bg});
// [dopamine, serotonin, norepinephrine, gaba, glutamate, acetylcholine, endorphins, cortisol]
const N = (da,se,ne,ga,gl,ac,en,co) => ({dopamine:da,serotonin:se,norepinephrine:ne,gaba:ga,glutamate:gl,acetylcholine:ac,endorphins:en,cortisol:co});

export const STATES = {
  infant: {
    title:'Infant Brain (0–2 yrs)', tagline:'Explosive growth — synaptic overproduction, brainstem-dominant', accent:'#60a5fa',
    regionActivity: R(15,40,35,50,60,70,30,55,35,90,40,25,30),
    nt: N(70,55,50,35,75,60,55,45),
    insights:['PFC barely functional — no impulse control, planning, or sense of self','Brainstem dominates — breathing, feeding, crying are reflexive','Massive synaptic overproduction then pruning begins','Amygdala already active — infants feel fear before understanding it','Hippocampus immature → infantile amnesia','Glutamate very high — brain in "construction mode"','GABA low — no inhibitory control, infants startle easily'],
    keyChanges:['PFC nearly offline','Brainstem dominant','Hippocampus immature','Synaptic overproduction'],
    activePathways:['sensory'],
  },
  child: {
    title:'Child Brain (6–10 yrs)', tagline:'Critical periods for language — pruning begins — everything is novel', accent:'#34d399',
    regionActivity: R(35,60,55,65,65,60,55,50,55,75,45,40,50),
    nt: N(75,60,55,45,65,65,55,35),
    insights:['PFC growing but still immature — impulsive yet learning rules','Critical period for language — second languages dramatically easier','Synaptic pruning: unused connections eliminated','Hippocampus now functional — autobiographical memories begin (~age 3–4)','Dopamine high — intense curiosity, learning through play','Time feels SLOW — everything novel, more memories per unit of time'],
    keyChanges:['PFC developing','Critical language period','Pruning active','Memory forming','High plasticity'],
    activePathways:['sensory','memory'],
  },
  adolescent: {
    title:'Adolescent Brain (13–17 yrs)', tagline:'Limbic system screams while PFC whispers — the mismatch', accent:'#f472b6',
    regionActivity: R(45,65,65,65,70,75,60,80,65,70,60,55,70),
    nt: N(85,50,65,40,70,60,55,55),
    insights:['THE MISMATCH: Amygdala and reward system fully active, PFC immature until ~25','Dopamine at lifetime peak — reward-seeking, social validation','Risk-taking is biology — PFC "brakes" not installed','Amygdala hyperactive — emotions more intense than ever','Massive myelination — faster communication','Sensitive period for learning AND vulnerability to addiction/mental illness'],
    keyChanges:['PFC still immature','Amygdala hyperactive','Peak dopamine','Limbic-PFC mismatch'],
    activePathways:['reward','sensory'],
  },
  adult: {
    title:'Normal Adult — Resting', tagline:'Balanced baseline — fully mature PFC — DMN gently hums', accent:'#60a5fa',
    regionActivity: R(55,50,50,45,55,50,50,40,50,60,45,50,45),
    nt: N(55,60,50,55,55,55,45,40),
    insights:['All systems balanced — PFC fully mature, effective emotional regulation','Default Mode Network hums during rest — self-reflection, future planning','Serotonin and GABA provide calm, stable baseline','Brain uses ~20% of body energy even at rest','Neuroplasticity continues but requires more effort'],
    keyChanges:['Balanced activity','PFC fully mature','DMN active at rest','Stable chemistry'],
    activePathways:['dmn'],
  },
  aging: {
    title:'Aging Brain (70+ yrs)', tagline:'Slower processing but preserved wisdom — remarkable compensation', accent:'#94a3b8',
    regionActivity: R(40,40,40,40,45,50,35,35,40,55,40,45,35),
    nt: N(35,45,35,50,40,30,40,50),
    insights:['Processing speed and working memory decline — but wisdom improves','Hippocampus shrinks ~1–2%/year — harder to form new memories','Dopamine and acetylcholine decline','Brain compensates by recruiting BOTH hemispheres (HAROLD model)','Amygdala reactivity decreases — positivity effect','Risk: amyloid-beta accumulation → Alzheimer\'s'],
    keyChanges:['Reduced volume','Hippocampal shrinkage','Lower dopamine','Bilateral compensation'],
    activePathways:['dmn','memory'],
  },
  fear: {
    title:'Fear / Threat Response', tagline:'Amygdala hijacks the brain — fight-or-flight before conscious awareness', accent:'#ef4444',
    regionActivity: R(25,55,50,60,85,90,40,95,55,85,75,70,55),
    nt: N(40,25,95,20,85,70,30,90),
    insights:['Amygdala fires at maximum — threat detected','LeDoux\'s "low road": Thalamus → Amygdala in ~12ms, before cortex','PFC suppressed — survival over rational thinking','Hypothalamus triggers HPA axis: cortisol and adrenaline flood','Norepinephrine surges — heart pounds, pupils dilate','Time perception distorts — seconds feel like minutes','GABA drops — all inhibition removed for maximum speed'],
    keyChanges:['Amygdala maximal','PFC suppressed','Cortisol surge','Time dilation'],
    activePathways:['fear'],
  },
  flow: {
    title:'Flow State / Deep Focus', tagline:'DMN goes silent — you lose time, self, everything but the task', accent:'#3b82f6',
    regionActivity: R(80,75,60,65,70,40,55,15,70,55,30,35,65),
    nt: N(85,60,75,55,70,80,70,20),
    insights:['Task-Positive Network takes over — PFC and parietal engaged','Default Mode Network goes QUIET — you "lose yourself"','Amygdala suppressed — no anxiety, no self-criticism','Dopamine drives intrinsic reward','Time perception collapses — insula downregulated','Cortisol LOW — the opposite of stress, optimal performance'],
    keyChanges:['DMN silenced','PFC engaged','High dopamine','Lost sense of time','Zero anxiety'],
    activePathways:['reward'],
  },
  love: {
    title:'Romantic Love / Attachment', tagline:'Reward system fires like addiction — love is a drug', accent:'#f472b6',
    regionActivity: R(35,45,55,50,60,75,55,30,40,60,70,60,85),
    nt: N(90,30,70,40,60,55,75,55),
    insights:['Reward system fires intensely — same circuits as cocaine','Dopamine surges → obsessive focus, craving, euphoria','Serotonin DROPS — obsessive thinking (similar to OCD)','PFC suppressed — reduced critical judgment ("love is blind")','Amygdala calmed — you feel safe','Oxytocin from hypothalamus drives bonding','Withdrawal triggers addiction-like symptoms'],
    keyChanges:['Reward maxed','Serotonin drops','PFC reduced','Oxytocin surge'],
    activePathways:['reward'],
  },
  dreaming: {
    title:'REM Sleep — Dreaming', tagline:'Brain active as waking — paralyzed, hallucinating, processing', accent:'#8b5cf6',
    regionActivity: R(15,40,70,75,50,55,70,75,30,80,55,60,40),
    nt: N(65,10,5,65,60,90,50,30),
    insights:['PFC nearly OFFLINE — no logic, no self-awareness in dreams','Visual cortex hyperactive — vivid imagery without real input','Amygdala very active — dreams often involve fear/anxiety','Hippocampus replays and recombines the day\'s memories','Acetylcholine at HIGHEST — drives hallucinatory quality','Norepinephrine nearly ABSENT — no "reality check," dreams feel real','Brainstem triggers muscle paralysis — can\'t act out dreams'],
    keyChanges:['PFC offline','Visual cortex active','No norepinephrine','Acetylcholine peak'],
    activePathways:['memory'],
  },
  'deep-sleep': {
    title:'Deep Sleep (NREM Stage 3)', tagline:'Slow delta waves — maintenance, cleanup, memory consolidation', accent:'#1e40af',
    regionActivity: R(20,20,20,15,30,55,60,15,20,65,15,15,20),
    nt: N(25,30,15,80,25,15,40,20),
    insights:['Cortex in slow-wave synchronization — delta waves sweep across brain','Hippocampus replays memories to neocortex for long-term storage','GABA dominates — most inhibited, quietest state','Glymphatic system 10× more active — flushing waste, amyloid-beta','Brain cells physically shrink for wider cleaning channels','Growth hormone released — tissue repair, immune function peak'],
    keyChanges:['Delta waves','Glymphatic cleanup','GABA maximum','Memory transfer'],
    activePathways:['memory'],
  },
  psychedelic: {
    title:'Psychedelic State (Psilocybin)', tagline:'DMN dissolves — ego death, novel connections, entropic brain', accent:'#d946ef',
    regionActivity: R(40,70,75,85,45,50,65,55,40,55,80,35,40),
    nt: N(65,90,55,30,80,60,65,45),
    insights:['Psilocybin activates serotonin 5-HT2A receptors','Default Mode Network DISSOLVES — ego dissolution','Brain areas that normally never communicate start connecting','Visual cortex hyperactive — patterns, synesthesia','Insula in overdrive — cosmic awareness','Thalamic filter opens — sensory flood','Brain becomes child-like — flexible, less habit-constrained','Therapeutic promise: "resets" stuck patterns in depression'],
    keyChanges:['DMN dissolved','Serotonin flood','Novel connections','Ego dissolution','Entropic brain'],
    activePathways:['dmn','sensory','reward'],
  },
  meditation: {
    title:'Deep Meditation', tagline:'PFC strengthened, amygdala tamed, DMN quieted', accent:'#14b8a6',
    regionActivity: R(70,55,40,35,55,45,50,20,35,55,75,60,35),
    nt: N(65,75,35,70,45,60,70,20),
    insights:['PFC active uniquely — monitoring attention without forcing','Amygdala dramatically suppressed — fear and anxiety reduced','DMN quiets — less mind-wandering, less self-chatter','Insula very active — heightened body awareness','GABA increases — calmer at system level','Gamma oscillations (40Hz) increase — heightened awareness','Long-term: thicker PFC, smaller amygdala (visible after 8 weeks)'],
    keyChanges:['Amygdala suppressed','DMN quieted','Insula heightened','GABA up','Cortisol drops'],
    activePathways:['dmn'],
  },
  depression: {
    title:'Major Depression', tagline:'PFC brake fails, amygdala rages, hippocampus shrinks', accent:'#64748b',
    regionActivity: R(25,35,40,35,45,65,30,80,35,55,65,75,25),
    nt: N(25,20,25,30,60,35,15,85),
    insights:['PFC hypoactive — impaired concentration, motivation','Amygdala hyperactive — amplifying sadness, hopelessness','Cingulate overactive — trapped in rumination, DMN "stuck"','Hippocampus volume reduced by chronic cortisol','All monoamines depleted — but not just a chemical imbalance','Cortisol chronically elevated — HPA axis can\'t shut off','Basal ganglia underactive → anhedonia','Neuroinflammation found in many depressed brains'],
    keyChanges:['PFC hypoactive','Amygdala hyperactive','DMN stuck','Hippocampus shrinks','Cortisol chronic'],
    activePathways:['dmn','fear'],
  },
  'bipolar-mania': {
    title:'Bipolar — Mania', tagline:'Dopamine skyrockets, PFC brakes fail, world becomes electric', accent:'#f59e0b',
    regionActivity: R(20,65,70,60,75,80,50,85,55,70,65,55,85),
    nt: N(95,40,90,20,85,55,70,65),
    insights:['Dopamine and norepinephrine extreme — euphoria, grandiosity','PFC severely suppressed — impulse control vanishes','Amygdala hyperactive but coded as positive/expansive','GABA very low — all brakes off','Reward system maxed — everything feels rewarding','Sleep abolished — hypothalamus circuits disrupted','Thalamus flooding cortex with unfiltered information','Kindling: each episode makes the next more likely'],
    keyChanges:['Dopamine extreme','PFC offline','No inhibition','Sleep abolished','Reward maxed'],
    activePathways:['reward'],
  },
  'bipolar-depression': {
    title:'Bipolar — Depression', tagline:'The crash — deeper than unipolar, different neurobiology', accent:'#334155',
    regionActivity: R(20,30,35,30,40,60,25,75,30,50,60,70,15),
    nt: N(15,20,15,35,55,30,10,80),
    insights:['Dopamine crashes from manic highs → profound anhedonia','Contrast from mania makes depression more devastating','PFC dysfunctional — cognitive fog, indecisiveness','Amygdala codes everything as negative and hopeless','Basal ganglia severely underactive — barely able to move','Mitochondrial dysfunction: neurons lack energy','Cingulate overactive with rumination'],
    keyChanges:['Dopamine crashed','Profound anhedonia','Mitochondrial failure','Energy depleted'],
    activePathways:['dmn'],
  },
  anxiety: {
    title:'Generalized Anxiety', tagline:'Threat detection stuck ON — scanning for nonexistent danger', accent:'#fbbf24',
    regionActivity: R(65,55,50,50,70,75,45,85,45,70,80,80,50),
    nt: N(45,30,80,25,75,60,25,80),
    insights:['Unlike fear (amygdala hijack), anxiety = PFC OVERWORKING','Amygdala chronically hyperactive — ambiguous = threatening','Cingulate in overdrive — constant "what if" scenarios','Insula amplifies bodily sensations — racing heart feels terrifying','GABA low — calming system impaired (benzodiazepines help)','Norepinephrine high — hypervigilance','Hippocampus can\'t contextualize — safe situations feel dangerous'],
    keyChanges:['Amygdala chronic','PFC overworking','Insula amplified','GABA depleted'],
    activePathways:['fear','sensory'],
  },
  ptsd: {
    title:'PTSD Flashback', tagline:'Past becomes present — brain relives trauma as if happening NOW', accent:'#dc2626',
    regionActivity: R(15,55,60,70,80,85,20,95,45,90,85,30,50),
    nt: N(35,15,95,15,90,65,20,95),
    insights:['Amygdala at maximum — identical to original trauma','PFC and hippocampus SUPPRESSED — can\'t separate past from present','Hippocampus normally timestamps memories — in PTSD no time context','Brain doesn\'t know the trauma is OVER','Brainstem triggers full fight-or-flight','Visual cortex reactivates trauma imagery','GABA depleted — no brakes','Treatment works by reactivating memory WITH hippocampus online'],
    keyChanges:['Amygdala max','Hippocampus offline','No time context','PFC suppressed'],
    activePathways:['fear'],
  },
  did: {
    title:'Dissociative Identity Disorder', tagline:'Multiple self-networks in one brain — trauma fragmented personality', accent:'#a78bfa',
    regionActivity: R(45,50,55,45,55,55,35,60,45,55,65,55,45),
    nt: N(45,40,55,40,55,45,35,60),
    insights:['Different alters show DIFFERENT fMRI activation patterns','DMN reconfigures during switches — each alter has a different "self"','Hippocampus structurally different — disrupted memory integration','Dissociation = survival: child\'s brain couldn\'t integrate trauma','Structural dissociation: trauma before personality integrates (~6–9)','Actors simulating DID show different brain patterns — it\'s real','Treatment: long-term trauma therapy, gradual integration'],
    keyChanges:['DMN reconfigures','Multiple self-states','Hippocampus altered','Different per alter'],
    activePathways:['dmn','memory'],
  },
  schizophrenia: {
    title:'Schizophrenia — Psychosis', tagline:'Internal speech misattributed as external — reality untethered', accent:'#7c3aed',
    regionActivity: R(25,50,80,55,75,55,40,65,40,60,60,55,70),
    nt: N(85,35,60,30,75,40,30,60),
    insights:['Excess mesolimbic dopamine → hallucinations, delusions','Temporal lobe hyperactive — "voices" are misattributed inner speech','PFC hypoactive — impaired reality-testing','Thalamus overwhelmed — filtering fails','Prediction error system broken: patterns in noise (delusions)','Excessive synaptic pruning in adolescence → disconnection','Antipsychotics block dopamine D2 receptors'],
    keyChanges:['Dopamine excess','Temporal hyperactive','PFC impaired','Filter breakdown'],
    activePathways:['reward','sensory'],
  },
  adhd: {
    title:'ADHD', tagline:'Not a deficit of attention — a deficit of attention REGULATION', accent:'#f97316',
    regionActivity: R(30,55,55,55,55,50,45,55,50,55,45,40,55),
    nt: N(30,45,65,35,60,45,40,35),
    insights:['PFC underactive — executive function impaired, can\'t prioritize','Dopamine chronically LOW — brain seeks stimulation constantly','Paradox: stimulant medication INCREASES dopamine, calming the brain','Basal ganglia: difficulty inhibiting irrelevant actions and thoughts','Default Mode Network intrudes during tasks — mind-wandering','Cerebellum: timing and sequencing difficulties','Norepinephrine high — hypervigilance to novel stimuli','Hyperfocus is real: when reward is high enough, all systems engage'],
    keyChanges:['PFC underactive','Low dopamine','DMN intrudes','Reward-seeking'],
    activePathways:['reward','dmn'],
  },
  addiction: {
    title:'Addiction (Active Craving)', tagline:'Hijacked reward system — wanting without liking', accent:'#dc2626',
    regionActivity: R(20,45,50,45,65,70,55,80,40,65,75,65,95),
    nt: N(30,25,75,20,75,40,15,75),
    insights:['Basal ganglia (reward center) has been hijacked — massive sensitization','Dopamine is LOW at baseline but SURGES with cues → intense craving','Wanting ≠ liking: the brain craves what it no longer enjoys (Robinson & Berridge)','PFC severely compromised — impaired decision-making, loss of control','Amygdala links environmental cues to craving (conditioned response)','Stress circuits overactive — negative emotion drives relapse','Insula drives conscious urge: "I NEED this"','Hippocampus stores powerful drug-associated memories'],
    keyChanges:['Reward hijacked','PFC impaired','Cue-triggered craving','Stress drives relapse'],
    activePathways:['reward','fear'],
  },
  ocd: {
    title:'Obsessive-Compulsive Disorder', tagline:'The brain\'s error detector is stuck on — a loop that won\'t stop', accent:'#ec4899',
    regionActivity: R(60,50,45,45,65,55,45,65,40,55,65,90,75),
    nt: N(55,25,60,25,70,50,30,65),
    insights:['Cingulate cortex (error detector) is HYPERACTIVE — constant "something is wrong"','Cortico-striato-thalamo-cortical loop is stuck in a cycle','OFC (part of PFC) overactive — can\'t stop checking, doubting','Basal ganglia fails to "gate" — can\'t suppress the urge to repeat','Serotonin low — SSRIs help by dampening the loop','Unlike anxiety, the person KNOWS the fear is irrational but can\'t stop','Glutamate excess in the loop circuits','ERP therapy works by "unsticking" the circuit through habituation'],
    keyChanges:['Cingulate stuck','Error loop active','Serotonin low','Can\'t gate impulse'],
    activePathways:['reward','dmn'],
  },
  synesthesia: {
    title:'Synesthesia', tagline:'Crossed wires — letters have colors, sounds have shapes', accent:'#06d6a0',
    regionActivity: R(55,70,65,80,60,50,55,40,50,55,60,50,45),
    nt: N(60,70,50,45,65,55,55,30),
    insights:['Extra cross-connections between sensory regions that normally prune away','Visual cortex activated by auditory input (or other cross-modal links)','Parietal lobe: binding center where senses merge — hyperconnected','Not a disorder — a stable trait, often present from birth','Serotonin may modulate: psychedelics can induce temporary synesthesia','More common in artists and musicians (~4% of population)','fMRI confirms: color area V4 genuinely activates when synesthetes hear sounds'],
    keyChanges:['Cross-modal binding','Extra connections','Visual-auditory overlap','Stable trait'],
    activePathways:['sensory'],
  },
  anesthesia: {
    title:'General Anesthesia', tagline:'Consciousness switched off — the thalamic gate slams shut', accent:'#475569',
    regionActivity: R(10,15,15,10,15,40,10,10,15,45,10,10,15),
    nt: N(15,20,10,95,10,10,15,25),
    insights:['Thalamus is the key target — the sensory gate is forced shut','Cortical activity drops to near-zero — no conscious experience','GABA receptors massively activated — total neural inhibition','Brainstem partially preserved — maintains breathing, heart rate','Loss of connectivity between brain regions — "information integration" lost','Different from sleep: no dreaming, no memory consolidation','Recovery sequence: brainstem → thalamus → cortex (consciousness returns last)','Awareness under anesthesia (~0.1–0.2% of cases) is a real phenomenon'],
    keyChanges:['Thalamus shut','GABA maximum','Cortex silenced','Connectivity lost'],
    activePathways:[],
  },
};

export const CATEGORIES = [
  { label: 'Development',    states: ['infant','child','adolescent','adult','aging'] },
  { label: 'Emotions',       states: ['fear','flow','love'] },
  { label: 'Altered States',  states: ['dreaming','deep-sleep','psychedelic','meditation','anesthesia'] },
  { label: 'Disorders',      states: ['depression','bipolar-mania','bipolar-depression','anxiety','ptsd','did','schizophrenia','adhd','addiction','ocd'] },
  { label: 'Unique',         states: ['synesthesia'] },
];

export const ICONS = {
  infant:'👶',child:'🧒',adolescent:'🧑‍🎓',adult:'🧠',aging:'👴',
  fear:'😨',flow:'🎯',love:'❤️',
  dreaming:'💭','deep-sleep':'🌙',psychedelic:'🍄',meditation:'🧘',anesthesia:'💉',
  depression:'🌧️','bipolar-mania':'⚡','bipolar-depression':'🕳️',anxiety:'😰',ptsd:'💥',did:'🪞',schizophrenia:'🌀',
  adhd:'⚡',addiction:'🔗',ocd:'🔄',synesthesia:'🎨',
};
