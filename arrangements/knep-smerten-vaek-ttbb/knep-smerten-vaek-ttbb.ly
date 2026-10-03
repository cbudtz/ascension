\version "2.24.3"

title = "Knep Smerten Væk"
composer = "Thomas Holm"
arranger = "TTBB-arrangement (4 stemmer)"
tagline = ##f

global = {
  \key g \minor
  \time 4/4
  \tempo 4 = 99
}

introTOne = \relative c' { r1 | d1 | f1 | a1 | g1 }
introTTwo = \relative c' { r1 | bes1 | d1 | f1 | e1 }
introBOne = \relative c { r1 | g1 | bes1 | c1 | c1 }
introBTwo = \relative c, { r1 | g,1 | bes,1 | f,1 | c1 }

verseOneTOne = \relative c' {
  d4 d8 d d4 d8 d |
  d4 d8 d d4 d |
  d4 d8 d d4 d8 d |
  d4 d8 d d2 |
  d4 d8 d d4 d8 d |
  d4 d8 d d4 d |
  d4 d8 d d4 d8 d |
  d4 d8 d d2 |
}

verseOneTTwo = \relative c' {
  bes4 bes8 bes bes4 bes8 bes |
  bes4 bes8 bes bes4 bes |
  bes4 bes8 bes bes4 bes8 bes |
  bes4 bes8 bes bes2 |
  bes4 bes8 bes bes4 bes8 bes |
  bes4 bes8 bes bes4 bes |
  bes4 bes8 bes bes4 bes8 bes |
  bes4 bes8 bes bes2 |
}

verseOneBOne = \relative c {
  g4 g8 g g4 g8 g |
  g4 g8 g g4 g |
  g4 g8 g g4 g8 g |
  g4 g8 g g2 |
  g4 g8 g g4 g8 g |
  g4 g8 g g4 g |
  g4 g8 g g4 g8 g |
  g4 g8 g g2 |
}

verseOneBTwo = \relative c, {
  g2 g |
  bes,2 bes |
  f2 f |
  c2 c |
  g2 g |
  bes,2 bes |
  f2 f |
  c2 c |
}

bridgeTOne = \relative c' {
  c4 d es f |
  f4 es d c |
  c4 d es f |
  a4 g f es |
}

bridgeTTwo = \relative c' {
  g4 g g g |
  d4 d d d |
  g4 g g g |
  f4 f f f |
}

bridgeBOne = \relative c {
  es4 f g aes |
  bes4 aes g f |
  es4 f g aes |
  c4 bes aes g |
}

bridgeBTwo = \relative c, {
  c2 d |
  d2 c |
  c2 d |
  f2 c |
}

chorusTOne = \relative c' {
  d2 f2 |
  d2 c2 |
  g2 a2 |
  f2 es4 d4 |
  d2 f2 |
  d2 c2 |
  g2 a2 |
  f2 es4 d4 |
}

chorusTTwo = \relative c' {
  bes2 d2 |
  bes2 a2 |
  es2 g2 |
  d2 c4 bes4 |
  bes2 d2 |
  bes2 a2 |
  es2 g2 |
  d2 c4 bes4 |
}

chorusBOne = \relative c {
  bes2 d2 |
  bes2 a2 |
  es2 g2 |
  d2 c4 bes4 |
  bes2 d2 |
  bes2 a2 |
  es2 g2 |
  d2 c4 bes4 |
}

chorusBTwo = \relative c, {
  g2 bes,2 |
  f2 c2 |
  g2 bes,2 |
  f2 c2 |
  g2 bes,2 |
  f2 c2 |
  g2 bes,2 |
  f2 c2 |
}

chorusEndTOne = \relative c' {
  d2 f2 |
  d2 c2 |
  g2 a2 |
  f8 f f f f4 r |
  c2. r4 |
}

chorusEndTTwo = \relative c' {
  bes2 d2 |
  bes2 a2 |
  es2 g2 |
  d8 d d d d4 r |
  c2. r4 |
}

chorusEndBOne = \relative c {
  bes2 d2 |
  bes2 a2 |
  es2 g2 |
  d8 d d d d4 r |
  c2. r4 |
}

chorusEndBTwo = \relative c, {
  g2 bes,2 |
  f2 c2 |
  g2 bes,2 |
  f2 c2 |
  g2. r4 |
  c2. r4 |
}

middleCallTOne = \relative c' {
  d2 d4 d |
  f2 f4 f |
  d2 d4 d |
  c2 c4 c |
}

middleCallTTwo = \relative c' {
  bes2 bes4 bes |
  d2 d4 d |
  bes2 bes4 bes |
  g2 g4 g |
}

middleCallBOne = \relative c {
  g2 g4 g |
  bes2 bes4 bes |
  g2 g4 g |
  e2 e4 e |
}

middleCallBTwo = \relative c, {
  g1 |
  bes,1 |
  f1 |
  c1 |
}

middleRespTOne = \relative c' { d1 | d1 | d1 | g1 }
middleRespTTwo = \relative c' { f1 | f1 | f1 | e1 }
middleRespBOne = \relative c { bes1 | bes1 | bes1 | c1 }
middleRespBTwo = \relative c, { g,1 | g,1 | g,1 | c1 }

tOneMusic = {
  \global
  \introTOne
  \verseOneTOne
  \bridgeTOne
  \chorusTOne
  \verseOneTOne
  \bridgeTOne
  \chorusTOne
  \middleCallTOne
  \middleRespTOne
  \chorusTOne
  \chorusEndTOne
}

tTwoMusic = {
  \global
  \introTTwo
  \verseOneTTwo
  \bridgeTTwo
  \chorusTTwo
  \verseOneTTwo
  \bridgeTTwo
  \chorusTTwo
  \middleCallTTwo
  \middleRespTTwo
  \chorusTTwo
  \chorusEndTTwo
}

bOneMusic = {
  \global
  \introBOne
  \verseOneBOne
  \bridgeBOne
  \chorusBOne
  \verseOneBOne
  \bridgeBOne
  \chorusBOne
  \middleCallBOne
  \middleRespBOne
  \chorusBOne
  \chorusEndBOne
}

bTwoMusic = {
  \global
  \introBTwo
  \verseOneBTwo
  \bridgeBTwo
  \chorusBTwo
  \verseOneBTwo
  \bridgeBTwo
  \chorusBTwo
  \middleCallBTwo
  \middleRespBTwo
  \chorusBTwo
  \chorusEndBTwo
}

\score {
  \new ChoirStaff <<
    \new Staff = "t1" \with {
      instrumentName = "Tenor 1"
      shortInstrumentName = "T1"
    } {
      \clef "treble_8"
      \new Voice { \tOneMusic }
    }
    \new Staff = "t2" \with {
      instrumentName = "Tenor 2"
      shortInstrumentName = "T2"
    } {
      \clef "treble_8"
      \new Voice { \tTwoMusic }
    }
    \new Staff = "b1" \with {
      instrumentName = "Bas 1"
      shortInstrumentName = "B1"
    } {
      \clef bass
      \new Voice { \bOneMusic }
    }
    \new Staff = "b2" \with {
      instrumentName = "Bas 2"
      shortInstrumentName = "B2"
    } {
      \clef bass
      \new Voice { \bTwoMusic }
    }
  >>
  \layout {
    \context {
      \Score
      \override SpacingSpanner.common-shortest-duration = #(ly:make-moment 1/8)
    }
  }
  \midi { \tempo 4 = 99 }
  \header {
    title = \title
    composer = \composer
    arranger = \arranger
  }
}
