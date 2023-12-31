
cp.scripts.define(async () => {
  let constants = [
    ["α", "alpha"],
    ["β", "beta"],
    ["γ", "gamma1"],
    ["Γ", "gamma2"],
    ["δ", "delta1"],
    ["Δ", "delta2"],
    ["ε", "epsilon"],
    ["ϕ", "phi1"],
    ["φ", "phi2"],
    ["ι", "iota"],
    ["κ", "kappa"],
    ["λ", "lambda"],
    ["η", "eta"],
    ["μ", "mu"],
    ["ν", "nu"],
    ["ω", "omega"],
    ["π", "pi"],
    ["ρ", "pho ro"],
    ["ψ", "psi"],
    ["σ", "sigma"],
    ["τ", "tau"],
    ["θ", "theta"],
    ["ξ", "xi"],
    ["ζ", "zeta"],
    ["ə", "schwa"],
    ["ʃ", "sh"],
    ["ʂ", "sh retroflex"],
    ["ɕ", "sh palatal"],
    ["s̺", "s-sh paisa"],
    ["ʤ", "dj as in jump"],
    ["ʒ", "j in french [jj]"],
    ["ʁ", "r in french [gr]"],
    ["ʀ", "rr in french [grr]"],
    ["ɕ", "sh retroflex"],
    ["ɹ", "r in english"],
    ["ʎ", "tagliare"],
    ["ʧ", "ch"],
    ["ʏ", "ü soft"],
    ["ɾ", "r in spanish flap"],
    ["r", "rr in spanish trill"],
    ["ɚ", "er with schwa"],
    ["ɝ", "er open: square"],
    ["β", "b v in spanish: abajo"],
    ["θ", "th"],
    ["ð", "dh"],
    ["ç", "ch german soft: ich"],
    ["ç", "ch german soft: ich"],
    ["ʔ", "glottal stop"],
    ["ʐ", "r chinese, retroflex ʒ"],
    ["𝟎", "bf0"],
    ["𝟏", "bf1"],
    ["𝟐", "bf2"],
    ["𝟑", "bf3"],
    ["𝟒", "bf4"],
    ["𝟓", "bf5"],
    ["𝟔", "bf6"],
    ["𝟕", "bf7"],
    ["𝟖", "bf8"],
    ["𝟗", "bf9"],
    ["𝟘", "bb0"],
    ["𝟙", "bb1"],
    ["𝟚", "bb2"],
    ["𝟛", "bb3"],
    ["𝟜", "bb4"],
    ["𝟝", "bb5"],
    ["𝟞", "bb6"],
    ["𝟟", "bb7"],
    ["𝟠", "bb8"],
    ["𝟡", "bb9"],
    ["𝟢", "sf0"],
    ["𝟣", "sf1"],
    ["𝟤", "sf2"],
    ["𝟥", "sf3"],
    ["𝟦", "sf4"],
    ["𝟧", "sf5"],
    ["𝟨", "sf6"],
    ["𝟩", "sf7"],
    ["𝟪", "sf8"],
    ["𝟫", "sf9"],
    ["𝟬", "sfbf0"],
    ["𝟭", "sfbf1"],
    ["𝟮", "sfbf2"],
    ["𝟯", "sfbf3"],
    ["𝟰", "sfbf4"],
    ["𝟱", "sfbf5"],
    ["𝟲", "sfbf6"],
    ["𝟳", "sfbf7"],
    ["𝟴", "sfbf8"],
    ["𝟵", "sfbf9"],
    ["𝟶", "tt0"],
    ["𝟷", "tt1"],
    ["𝟸", "tt2"],
    ["𝟹", "tt3"],
    ["𝟺", "tt4"],
    ["𝟻", "tt5"],
    ["𝟼", "tt6"],
    ["𝟽", "tt7"],
    ["𝟾", "tt8"],
    ["𝟿", "tt9"],

    ["ℂ", "bbC"],
    ["ℍ", "bbH"],
    ["ℕ", "bbN"],
    ["ℙ", "bbP"],
    ["ℚ", "bbQ"],
    ["ℝ", "bbR"],
    ["ℤ", "bbZ"],
    ["𝔸", "bbA"],
    ["𝔹", "bbB"],
    ["𝔻", "bbD"],
    ["𝔼", "bbE"],
    ["𝔽", "bbF"],
    ["𝔾", "bbG"],
    ["𝕀", "bbI"],
    ["𝕁", "bbJ"],
    ["𝕂", "bbK"],
    ["𝕃", "bbL"],
    ["𝕄", "bbM"],
    ["𝕆", "bbO"],
    ["𝕊", "bbS"],
    ["𝕋", "bbT"],
    ["𝕌", "bbU"],
    ["𝕍", "bbV"],
    ["𝕎", "bbW"],
    ["𝕏", "bbX"],
    ["𝕐", "bbY"],

    ["𝕒", "bba-lower"],
    ["𝕓", "bbb-lower"],
    ["𝕔", "bbc-lower"],
    ["𝕕", "bbd-lower"],
    ["𝕖", "bbe-lower"],
    ["𝕗", "bbf-lower"],
    ["𝕘", "bbg-lower"],
    ["𝕙", "bbh-lower"],
    ["𝕚", "bbi-lower"],
    ["𝕛", "bbj-lower"],
    ["𝕜", "bbk-lower"],
    ["𝕝", "bbl-lower"],
    ["𝕞", "bbm-lower"],
    ["𝕟", "bbn-lower"],
    ["𝕠", "bbo-lower"],
    ["𝕡", "bbp-lower"],
    ["𝕢", "bbq-lower"],
    ["𝕣", "bbr-lower"],
    ["𝕤", "bbs-lower"],
    ["𝕥", "bbt-lower"],
    ["𝕦", "bbu-lower"],
    ["𝕧", "bbv-lower"],
    ["𝕨", "bbw-lower"],
    ["𝕩", "bbx-lower"],
    ["𝕪", "bby-lower"],
    ["𝕫", "bbz-lower"],

    ["𝓐", "calA"],
    ["𝓑", "calB"],
    ["𝓒", "calC"],
    ["𝓓", "calD"],
    ["𝓔", "calE"],
    ["𝓕", "calF"],
    ["𝓖", "calG"],
    ["𝓗", "calH"],
    ["𝓘", "calI"],
    ["𝓙", "calJ"],
    ["𝓚", "calK"],
    ["𝓛", "calL"],
    ["𝓜", "calM"],
    ["𝓝", "calN"],
    ["𝓞", "calO"],
    ["𝓟", "calP"],
    ["𝓠", "calQ"],
    ["𝓡", "calR"],
    ["𝓢", "calS"],
    ["𝓣", "calT"],
    ["𝓤", "calU"],
    ["𝓥", "calV"],
    ["𝓦", "calW"],
    ["𝓧", "calX"],
    ["𝓨", "calY"],
    ["𝓩", "calZ"],

    ["𝓪", "cala-lower"],
    ["𝓫", "calb-lower"],
    ["𝓬", "calc-lower"],
    ["𝓭", "cald-lower"],
    ["𝓮", "cale-lower"],
    ["𝓯", "calf-lower"],
    ["𝓰", "calg-lower"],
    ["𝓱", "calh-lower"],
    ["𝓲", "cali-lower"],
    ["𝓳", "calj-lower"],
    ["𝓴", "calk-lower"],
    ["𝓵", "call-lower"],
    ["𝓶", "calm-lower"],
    ["𝓷", "caln-lower"],
    ["𝓸", "calo-lower"],
    ["𝓹", "calp-lower"],
    ["𝓺", "calq-lower"],
    ["𝓻", "calr-lower"],
    ["𝓼", "cals-lower"],
    ["𝓽", "calt-lower"],
    ["𝓾", "calu-lower"],
    ["𝓿", "calv-lower"],
    ["𝔀", "calw-lower"],
    ["𝔁", "calx-lower"],
    ["𝔂", "caly-lower"],
    ["𝔃", "calz-lower"],

    ["ℋ", "scrH"],
    ["ℐ", "scrI"],
    ["ℒ", "scrL"],
    ["ℛ", "scrR"],
    ["ℬ", "scrB"],
    ["ℰ", "scrE"],
    ["ℱ", "scrF"],
    ["ℳ", "scrM"],
    ["𝒜", "scrA"],
    ["𝒞", "scrC"],
    ["𝒟", "scrD"],
    ["𝒢", "scrG"],
    ["𝒥", "scrJ"],
    ["𝒦", "scrK"],
    ["𝒩", "scrN"],
    ["𝒪", "scrO"],
    ["𝒫", "scrP"],
    ["𝒬", "scrQ"],
    ["𝒮", "scrS"],
    ["𝒯", "scrT"],
    ["𝒰", "scrU"],
    ["𝒱", "scrV"],
    ["𝒲", "scrW"],
    ["𝒳", "scrX"],
    ["𝒴", "scrY"],
    ["𝒵", "scrZ"],
    ["ℯ", "scre-lower"],
    ["ℊ", "scrg-lower"],
    ["ℴ", "scro-lower"],
    ["𝒶", "scra-lower"],
    ["𝒷", "scrb-lower"],
    ["𝒸", "scrc-lower"],
    ["𝒹", "scrd-lower"],
    ["𝒻", "scrf-lower"],
    ["𝒽", "scrh-lower"],
    ["𝒾", "scri-lower"],
    ["𝒿", "scrj-lower"],
    ["𝓀", "scrk-lower"],
    ["𝓁", "scrl-lower"],
    ["𝓂", "scrm-lower"],
    ["𝓃", "scrn-lower"],
    ["𝓅", "scrp-lower"],
    ["𝓆", "scrq-lower"],
    ["𝓇", "scrr-lower"],
    ["𝓈", "scrs-lower"],
    ["𝓉", "scrt-lower"],
    ["𝓊", "scru-lower"],
    ["𝓋", "scrv-lower"],
    ["𝓌", "scrw-lower"],
    ["𝓍", "scrx-lower"],
    ["𝓎", "scry-lower"],
    ["𝓏", "scrz-lower"],
    ["ℓ", "ell"],
    ["ℼ", "bbpi-lower"],
    ["ℿ", "bbPi"],
    ["ℽ", "bbgamma-lower"],
    ["ℾ", "bbGamma"],
    ["⅀", "bbSigma"],
    ["←", "leftarrow"],
    ["↑", "uparrow"],
    ["→", "rightarrow"],
    ["↓", "downarrow"],
    ["↔", "leftrightarrow"],
    ["↕", "updownarrow"],
    ["↖", "nwarrow"],
    ["↗", "nearrow"],
    ["↘", "searrow"],
    ["↙", "swarrow"],
    ["↚", "nleftarrow"],
    ["↛", "nrightarrow"],
    ["↜", "leftwavearrow"],
    ["↝", "rightwavearrow"],
    ["↞", "twoheadleftarrow"],
    ["↟", "twoheaduparrow"],
    ["↠", "twoheadrightarrow"],
    ["↡", "twoheaddownarrow"],
    ["↢", "leftarrowtail"],
    ["↣", "rightarrowtail"],
    ["↤", "mapsfrom"],
    ["↥", "MapsUp"],
    ["↦", "mapsto"],
    ["↧", "MapsDown"],
    ["↨", "updownarrowbar"],
    ["↩", "hookleftarrow"],
    ["↪", "hookrightarrow"],
    ["↫", "looparrowleft"],
    ["↬", "looparrowright"],
    ["↭", "leftrightsquigarrow"],
    ["↮", "nleftrightarrow"],
    ["↯", "lightning"],
    ["↰", "Lsh"],
    ["↱", "Rsh"],
    ["↲", "dlsh"],
    ["↳", "drsh"],
    ["↴", "linefeed"],
    ["↵", "carriagereturn"],
    ["↶", "curvearrowleft"],
    ["↷", "curvearrowright"],
    ["↸", "barovernorthwestarrow"],
    ["↹", "barleftarrowrightarrowba"],
    ["↻", "circlearrowright"],
    ["↼", "leftharpoonup"],
    ["↽", "leftharpoondown"],
    ["↾", "upharpoonright"],
    ["↿", "upharpoonleft"],
    ["⇀", "rightharpoonup"],
    ["⇁", "rightharpoondown"],
    ["⇂", "downharpoonright"],
    ["⇃", "downharpoonleft"],
    ["⇄", "rightleftarrows"],
    ["⇅", "updownarrows"],
    ["⇆", "leftrightarrows"],
    ["⇇", "leftleftarrows"],
    ["⇈", "upuparrows"],
    ["⇉", "rightrightarrows"],
    ["⇊", "downdownarrows"],
    ["⇋", "leftrightharpoons"],
    ["⇌", "rightleftharpoons"],
    ["⇍", "nLeftarrow"],
    ["⇎", "nLeftrightarrow"],
    ["⇏", "nRightarrow"],
    ["⇐", "Leftarrow"],
    ["⇑", "Uparrow"],
    ["⇒", "Rightarrow"],
    ["⇓", "Downarrow"],
    ["⇔", "Leftrightarrow"],
    ["⇕", "Updownarrow"],
    ["⇖", "Nwarrow"],
    ["⇗", "Nearrow"],
    ["⇘", "Searrow"],
    ["⇙", "Swarrow"],
    ["⇚", "Lleftarrow"],
    ["⇛", "Rrightarrow"],
    ["⇜", "leftsquigarrow"],
    ["⇝", "rightsquigarrow"],
    ["⇞", "nHuparrow"],
    ["⇟", "nHdownarrow"],
    ["⇠", "dashleftarrow"],
    ["⇡", "updasharrow"],
    ["⇢", "dashrightarrow"],
    ["⇣", "downdasharrow"],
    ["⇤", "LeftArrowBar"],
    ["⇥", "RightArrowBar"],
    ["⇦", "leftwhitearrow"],
    ["⇧", "upwhitearrow"],
    ["⇨", "rightwhitearrow"],
    ["⇩", "downwhitearrow"],
    ["⇪", "whitearrowupfrombar"],
    ["⇴", "circleonrightarrow"],
    ["⇵", "downuparrows"],
    ["⇶", "rightthreearrows"],
    ["⇷", "nvleftarrow"],
    ["⇸", "pfun"],
    ["⇹", "nvleftrightarrow"],
    ["⇺", "nVleftarrow"],
    ["⇻", "ffun"],
    ["⇼", "nVleftrightarrow"],
    ["⇽", "leftarrowtriangle"],
    ["⇾", "rightarrowtriangle"],
    ["∀", "forall"],
    ["∁", "complement"],
    ["∂", "partial"],
    ["∃", "exists"],
    ["∄", "nexists"],
    ["∅", "varnothing"],
    ["∆", "increment"],
    ["∇", "nabla"],
    ["∈", "in"],
    ["∉", "notin"],
    ["∊", "smallin"],
    ["∋", "ni"],
    ["∌", "nni"],
    ["∍", "smallni"],
    ["∎", "QED"],
    ["∏", "prod"],
    ["∐", "coprod"],
    ["∑", "sum"],
    ["−", "minus"],
    ["∓", "mp"],
    ["∔", "dotplus"],
    ["∕", "slash"],
    ["∖", "smallsetminus"],
    ["∘", "circ"],
    ["∙", "bullet"],
    ["√", "sqrt"],
    ["Α", "upAlpha"],
    ["Β", "upBeta"],
    ["Γ", "Gamma"],
    ["Δ", "Delta"],
    ["Ε", "upEpsilon"],
    ["Ζ", "upZeta"],
    ["Η", "upEta"],
    ["Θ", "Theta"],
    ["Ι", "upIota"],
    ["Κ", "upKappa"],
    ["Λ", "Lambda"],
    ["Μ", "upMu"],
    ["Ν", "upNu"],
    ["Ξ", "Xi"],
    ["Ο", "upOmicron"],
    ["Π", "Pi"],
    ["Ρ", "upRho"],
    ["Σ", "Sigma"],
    ["Τ", "upTau"],
    ["Υ", "Upsilon"],
    ["Φ", "Phi"],
    ["Χ", "upChi"],
    ["Ψ", "Psi"],
    ["Ω", "Omega"],
    ["α", "alpha"],
    ["β", "beta"],
    ["γ", "gamma"],
    ["δ", "delta"],
    ["ε", "varepsilon"],
    ["ζ", "zeta"],
    ["η", "eta"],
    ["θ", "theta"],
    ["ι", "iota"],
    ["κ", "kappa"],
    ["λ", "lambda"],
    ["μ", "mu"],
    ["ν", "nu"],
    ["ξ", "xi"],
    ["ο", "upomicron"],
    ["π", "pi"],
    ["ρ", "rho"],
    ["ς", "varsigma"],
    ["σ", "sigma"],
    ["τ", "tau"],
    ["υ", "upsilon"],
    ["φ", "varphi"],
    ["χ", "chi"],
    ["ψ", "psi"],
    ["ω", "omega"],
    ["ϐ", "varbeta"],
    ["ϑ", "vartheta"],
    ["ϒ", "upUpsilon"],
    ["ϕ", "phi"],
    ["ϖ", "varpi"],
    ["Ϙ", "Qoppa"],
    ["ϙ", "qoppa"],
    ["Ϛ", "Stigma"],
    ["ϛ", "stigma"],
    ["Ϝ", "Digamma"],
    ["ϝ", "digamma"],
    ["Ϟ", "Koppa"],
    ["ϟ", "koppa"],
    ["Ϡ", "Sampi"],
    ["ϡ", "sampi"],
    ["ϰ", "varkappa"],
    ["ϱ", "varrho"],
    ["ϴ", "upvarTheta"],
    ["ϵ", "epsilon"],
    ["϶", "backepsilon"],
    ["†", "dagger"],
    ["‡", "ddagger"],
    ["•", "bullet"],
    ["…", "ldots"],
    ["∝", "propto"],
    ["∞", "infty"],
    ["∟", "rightangle"],
    ["∠", "angle"],
    ["∡", "measuredangle"],
    ["∢", "sphericalangle"],
    ["∣", "mid"],
    ["∤", "nmid"],
    ["∥", "parallel"],
    ["∦", "nparallel"],
    ["∧", "wedge"],
    ["∨", "vee"],
    ["∩", "cap"],
    ["∪", "cup"],
    ["∫", "int"],
    ["∬", "iint"],
    ["∭", "iiint"],
    ["∼", "sim"],
    ["∽", "backsim"],
    ["∾", "invlazys"],
    ["∿", "AC"],
    ["≀", "wr"],
    ["≁", "nsim"],
    ["≂", "eqsim"],
    ["≃", "simeq"],
    ["≄", "nsimeq"],
    ["≅", "cong"],
    ["≆", "simneqq"],
    ["≇", "ncong"],
    ["≈", "approx"],
    ["≉", "napprox"],
    ["≊", "approxeq"],
    ["≋", "approxident"],
    ["≌", "backcong"],
    ["≍", "asymp"],
    ["≎", "Bumpeq"],
    ["≏", "bumpeq"],
    ["≐", "doteq"],
    ["≑", "Doteq"],
    ["≒", "fallingdotseq"],
    ["≓", "risingdotseq"],
    ["≔", "coloneq"],
    ["≕", "eqcolon"],
    ["≖", "eqcirc"],
    ["≗", "circeq"],
    ["≘", "arceq"],
    ["≙", "corresponds"],
    ["≚", "veeeq"],
    ["≛", "stareq"],
    ["≜", "triangleq"],
    ["≝", "eqdef"],
    ["≞", "measeq"],
    ["≟", "questeq"],
    ["≠", "neq"],
    ["≡", "equiv"],
    ["≢", "nequiv"],
    ["≣", "Equiv"],
    ["≤", "leq"],
    ["≥", "geq"],
    ["≦", "leqq"],
    ["≧", "geqq"],
    ["≨", "lneqq"],
    ["≩", "gneqq"],
    ["≪", "ll"],
    ["≫", "gg"],
    ["≬", "between"],
    ["≭", "notasymp"],
    ["≮", "nless"],
    ["≯", "ngtr"],
    ["≰", "nleq"],
    ["≱", "ngeq"],
    ["≲", "lesssim"],
    ["≳", "gtrsim"],
    ["≴", "NotLessTilde"],
    ["≵", "NotGreaterTilde"],
    ["≶", "lessgtr"],
    ["≷", "gtrless"],
    ["≸", "nlessgtr"],
    ["≹", "NotGreaterLess"],
    ["≺", "prec"],
    ["≻", "succ"],
    ["≼", "preccurlyeq"],
    ["≽", "succcurlyeq"],
    ["≾", "precsim"],
    ["≿", "succsim"],
    ["⊀", "nprec"],
    ["⊁", "nsucc"],
    ["⊂", "subset"],
    ["⊃", "supset"],
    ["⊄", "nsubset"],
    ["⊅", "nsupset"],
    ["⊆", "subseteq"],
    ["⊇", "supseteq"],
    ["⊈", "nsubseteq"],
    ["⊉", "nsupseteq"],
    ["⊊", "subsetneq"],
    ["⊋", "supsetneq"],
    ["⊌", "cupleftarrow"],
    ["⊍", "cupdot"],
    ["⊎", "uplus"],
    ["⊏", "sqsubset"],
    ["⊐", "sqsupset"],
    ["⊑", "sqsubseteq"],
    ["⊒", "sqsupseteq"],
    ["⊓", "sqcap"],
    ["⊔", "sqcup"],
    ["⊕", "oplus"],
    ["⊖", "ominus"],
    ["⊗", "otimes"],
    ["⊘", "oslash"],
    ["⊙", "odot"],
    ["⊚", "circledcirc"],
    ["⊛", "circledast"],
    ["⊜", "circledequal"],
    ["⊝", "circleddash"],
    ["⊞", "boxplus"],
    ["⊟", "boxminus"],
    ["⊠", "boxtimes"],
    ["⊡", "boxdot"],
    ["⊢", "vdash"],
    ["⊣", "dashv"],
    ["⊤", "top"],
    ["⊥", "bot"],
    ["⊦", "assert"],
    ["⊧", "models"],
    ["⊨", "vDash"],
    ["⊩", "Vdash"],
    ["⊪", "Vvdash"],
    ["⊫", "VDash"],
    ["⊬", "nvdash"],
    ["⊭", "nvDash"],
    ["⊮", "nVdash"],
    ["⊯", "nVDash"],
    ["⊰", "prurel"],
    ["⊱", "scurel"],
    ["⊲", "vartriangleleft"],
    ["⊳", "vartriangleright"],
    ["⊴", "trianglelefteq"],
    ["⊵", "trianglerighteq"],
    ["⊶", "multimapdotbothA"],
    ["⊷", "multimapdotbothB"],
    ["⊸", "multimap"],
    ["⊹", "hermitmatrix"],
    ["⊺", "intercal"],
    ["⊻", "veebar"],
    ["⊼", "barwedge"],
    ["⊽", "barvee"],
    ["⊾", "measuredrightangle"],
    ["⊿", "varlrtriangle"],
    ["⋀", "bigwedge"],
    ["⋁", "bigvee"],
    ["⋂", "bigcap"],
    ["⋃", "bigcup"],
    ["⋄", "diamond"],
    ["⋅", "cdot"],
    ["⋆", "star"],
    ["⋇", "divideontimes"],
    ["⋈", "bowtie"],
    ["⋉", "ltimes"],
    ["⋊", "rtimes"],
    ["⋋", "leftthreetimes"],
    ["⋌", "rightthreetimes"],
    ["⋍", "backsimeq"],
    ["⋎", "curlyvee"],
    ["⋏", "curlywedge"],
    ["⋐", "Subset"],
    ["⋑", "Supset"],
    ["⋒", "Cap"],
    ["⋓", "Cup"],
    ["⋔", "pitchfork"],
    ["⋕", "hash"],
    ["⋖", "lessdot"],
    ["⋗", "gtrdot"],
    ["⋘", "lll"],
    ["⋙", "ggg"],
    ["⋚", "lesseqgtr"],
    ["⋛", "gtreqless"],
    ["⋜", "eqless"],
    ["⋝", "eqgtr"],
    ["⋞", "curlyeqprec"],
    ["⋟", "curlyeqsucc"],
    ["⋠", "npreceq"],
    ["⋡", "nsucceq"],
    ["⋢", "nsqsubseteq"],
    ["⋣", "nsqsupseteq"],
    ["⋤", "sqsubsetneq"],
    ["⋥", "sqsupsetneq"],
    ["⋦", "lnsim"],
    ["⋧", "gnsim"],
    ["⋨", "precnsim"],
    ["⋩", "succnsim"],
    ["⋪", "ntriangleleft"],
    ["⋫", "ntriangleright"],
    ["⋬", "ntrianglelefteq"],
    ["⋭", "ntrianglerighteq"],
    ["⋮", "vdots"],
    ["⋯", "cdots"],
    ["⋰", "iddots"],
    ["⋱", "ddots"],
    ["⋲", "disin"],
    ["⋳", "varisins"],
    ["⋴", "isins"],
    ["⋵", "isindot"],
    ["⋶", "barin"],
    ["⋷", "isinobar"],
    ["⋸", "isinvb"],
    ["⋹", "isinE"],
    ["⋺", "nisd"],
    ["⋻", "varnis"],
    ["⋼", "nis"],
    ["⋽", "varniobar"],
    ["⋾", "niobar"],
    ["⋿", "bagmember"],
    ["⌀", "diameter"],
    ["⌂", "house"],
    ["⌅", "varbarwedge"],
    ["⌆", "vardoublebarwedge"],
    ["⌈", "lceil"],
    ["⌉", "rceil"],
    ["⌊", "lfloor"],
    ["⌋", "rfloor"],
    ["⌐", "invneg"],

    // From https://en.wikipedia.org/wiki/Check_mark
    ["✓", "CHECK MARK"],
    ["🗸", "LIGHT CHECK MARK"],
    ["🗹", "BALLOT BOX WITH BOLD CHECK"],
    ["𐄂", "AEGEAN CHECK MARK"],
    ["✅︎", "WHITE HEAVY CHECK MARK"],
    ["✔", "HEAVY CHECK MARK"],
    ["🮱", "INVERSE CHECK MARK"],
    ["🖒", "REVERSED THUMBS UP SIGN"],
    ["○", "WHITE CIRCLE"],
    ["◎", "BULLSEYE"],
    ["●", "BLACK CIRCLE"],
    ["◯", "LARGE CIRCLE"],
    ["⭕︎", "HEAVY LARGE CIRCLE"],

    // Parsed from https://nelkinda.com/blog/useful-unicode-characters/
    ["•", "bullet"],
    ["◦", "white bullet"],
    ["…", "horizontal ellipsis"],
    ["⋮", "vertical ellipsis"],
    ["☰", "trigram for heaven"],
    ["‒", "figure dash"],
    ["–", "en dash"],
    ["—", "em dash"],
    ["―", "horizontal bar"],
    ["☐", "ballot box"],
    ["☑", "ballot box with"],
    ["☒", "ballot box with"],
    ["⊕", "circled plus"],
    ["⊚", "circled ring"],
    ["⊖", "circled minus"],
    ["©", "copyright"],
    ["®", "registered trademark"],
    ["™", "unregistered trademark"],
    ["₿", "bitcoin sign"],
    ["$", "dollar sign"],
    ["€", "euro sign"],
    ["₹", "Indian rupee sign"],
    ["£", "pound sign	a3"],
    ["¥", "yen sign"],
    ["⇒", "rightwards double arrow"],
    ["×", "multiplication sign	d7"],
    ["÷", "division sign"],
    ["∞", "infinity symbol (lemniscate)"],
    ["⚠", "warning sign"],
    ["🗀", "folder"],
    ["🗁", "open folder"],
    ["🗎", "document"],
    ["☎", "telephone symbol"],
    ["☏", "telephone symbol"],
    ["✆", "telephone symbol"],
    ["✉", "letter symbol"],
    ["☏", "phone"],
    ["🇪🇺", "Europe"],
    ["🇩🇪", "Germany"],
    ["🇬🇧", "Great Britain"],
    ["🇮🇳", "India"],
    ["🇰🇪", "Kenya"],
    ["🇳🇵", "Nepal"],
    ["🇪🇸", "Spain"],
    ["🇺🇬", "Uganda"],
    ["🇺🇸", "USA"],
    ["🏴", "󠁢󠁳󠁣󠁴󠁿	Scotland"],
    ["🏴", "󠁥󠁢󠁡󠁹󠁿	Bavaria"],
    ["🏴‍☠️", "Pirate Flag"],
    ["🏳‍🌈️", "Rainbow Flag"],
    ["🐧", "Penguin"],
    ["🪔", "Diya"],
    ["🎄", "Christmas Tree"],
    ["🧟", "Zombie"],
    ["🧟‍♂️", "Zombie Male"],
    ["🧟‍♀️", "Zombie Female"],
    ["🧙", "Mage"],
    ["🧙‍♂️", "Sorcerer"],
    ["🧙‍♀️", "Sorceress"],
    ["★", "Black Star"],
    ["☆", "White Star"],
    ["⭐", "White Medium Star"],
    ["⭑", "Black Small Star"],
    ["⭒", "White Small Star"],
    ["⚪", "Medium White Circle"],
    ["⚫", "Medium Black Circle"],
    ["🔴", "Large Red Circle"],
    ["🔵", "Large Blue Circle"],
    ["🟠", "Large Orange Circle"],
    ["🟡", "Large Yellow Circle"],
    ["🟢", "Large Green Circle"],
    ["🟣", "Large Purple Circle"],
    ["🟤", "Large Brown Circle"],
    ["⬜", "White Large Square"],
    ["⬛", "Black Large Square"],
    ["🟥", "Large Red Square"],
    ["🟦", "Large Blue Square"],
    ["🟧", "Large Orange Square"],
    ["🟨", "Large Yellow Square"],
    ["🟩", "Large Green Square"],
    ["🟪", "Large Purple Square"],
    ["🟫", "Large Brown Square"],

  ];
  return constants;
});
