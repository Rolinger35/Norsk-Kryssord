import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator, Modal, Animated } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// --- CONFIG ---
const LEVELS = [
  { id: 'mini', label: 'MINI', size: 8, words: 6 },
  { id: 'std', label: 'NORMAL', size: 12, words: 12 },
  { id: 'mid', label: 'VANSKELIG', size: 15, words: 18 },
];

const WORD_BANK = [
  // --- ORIGINALS & CLASSICS ---
  { w: "ALFABET", c: "Samling av bokstaver", h: "A til Å" },
  { w: "BOKSTAV", c: "Tegn i skriftspråk", h: "En del av et ord" },
  { w: "TELEFON", c: "Ringemaskin", h: "Mobil" },
  { w: "STJERNE", c: "Himmellegeme", h: "Solen er en" },
  { w: "STASJON", c: "Togstopp", h: "Oslo S er en" },
  { w: "ORDBOK", c: "Her finner du forklaringer", h: "Lexikon" },
  { w: "FROKOST", c: "Dagens første måltid", h: "Morgenmat" },
  { w: "MIDDAG", c: "Varmt måltid", h: "Spises ofte kl 17" },
  { w: "KJØKKEN", c: "Her lager man mat", h: "Rom med komfyr" },
  { w: "MUSEUM", c: "Her ser man på kunst", h: "Kulturhus" },
  { w: "SYKEHUS", c: "Her jobber leger", h: "Sted for pasienter" },
  { w: "APOTEK", c: "Her selges medisiner", h: "Vitus eller Apotek1" },
  { w: "KONTOR", c: "Her sitter man og jobber", h: "Rom med skrivebord" },
  { w: "LOMMEBOK", c: "Her har man penger", h: "Wallet" },
  { w: "BRILLE", c: "Hjelper deg å se", h: "To glass i en ramme" },
  { w: "BESTIKK", c: "Kniv og gaffel", h: "Spiseredskap" },
  { w: "PARAPLY", c: "Beskytter mot regn", h: "Slås ut når det drypper" },
  { w: "NØKKEL", c: "Låser opp døra", h: "Liten metallbit" },
  { w: "TANNKOST", c: "Vasker tennene", h: "Bruk denne to ganger daglig" },
  { w: "INTERNETT", c: "Verdensveven", h: "Nettet" },
  { w: "LAPTOP", c: "Bærbar maskin", h: "PC" },
  { w: "SKJERM", c: "Viser bilder", h: "Monitor" },
  { w: "TRAPP", c: "Mellom to etasjer", h: "Går man opp og ned" },
  { w: "HEIS", c: "Løfter deg opp", h: "Elektrisk trapp" },
  { w: "NORGE", c: "Vårt land", h: "Har 5,5 mill innbyggere" },
  { w: "FJORD", c: "Vann mellom fjell", h: "Norsk natur" },
  { w: "SKOG", c: "Mange trær", h: "Marka" },
  { w: "SVALBARD", c: "Øygruppe i nord", h: "Isbjørnens rike" },

  // --- MAT & DRIKKE (FOOD & DRINK) ---
  { w: "SJOKOLADE", c: "Søt sak laget av kakao", h: "Freia lager mye av dette" },
  { w: "KAFFEKOPP", c: "Beholder for varm drikke", h: "Morgenritualet" },
  { w: "APPELSIN", c: "Rund oransje frukt", h: "Påskefrukt" },
  { w: "PANNEKAKE", c: "Flat og stekt røre", h: "Serveres ofte med blåbær" },
  { w: "VAFFEL", c: "Hjerteformet bakverk", h: "Sjømannskirkens stolthet" },
  { w: "BRØDSKIVE", c: "En del av et brød", h: "Matpakkens kjerne" },
  { w: "GRØNNSAK", c: "Sunt fra jorda", h: "Gulerot er en" },
  { w: "PIZZA", c: "Italiensk klassiker", h: "Grandiosa er Norges mest solgte" },
  { w: "KANELBOLLE", c: "Søtt bakverk med krydder", h: "Skillingsbolle" },
  { w: "KJØTTBOLLER", c: "Tradisjonell mat", h: "Serveres ofte med tyttebær" },
  { w: "TACO", c: "Spises ofte på fredager", h: "Meksikansk-inspirert" },
  { w: "JORDBÆR", c: "Rødt og søtt bær", h: "Sommerfavoritt" },
  { w: "MELKEGLASS", c: "Beholder for hvit drikke", h: "Fra kua" },
  { w: "OST", c: "Gult påleg", h: "Hullete mat" },
  { w: "SAFT", c: "Blandes med vann", h: "Drikke fra bær" },
  { w: "BRØD", c: "Bakt i ovn", h: "Har skorpe" },
  { w: "EGG", c: "Fra høna", h: "Gult inni" },

  // --- DYR (ANIMALS) ---
  { w: "ELGHUND", c: "Norsk hunderase", h: "Nasjonalhund" },
  { w: "PINGVIN", c: "Fugl som ikke kan fly", h: "Bor på Sydpolen" },
  { w: "KROKODILLE", c: "Stort krypdyr med tenner", h: "Bor i vann og på land" },
  { w: "SOMMERFUGL", c: "Insekt med fine vinger", h: "Starter som larve" },
  { w: "SPIDD", c: "Liten edderkopp", h: "Har åtte bein" },
  { w: "BJØRN", c: "Stort rovdyr", h: "Går i hi om vinteren" },
  { w: "REINSDYR", c: "Drar nissen sin slede", h: "Rudolf er en" },
  { w: "EKORN", c: "Liten klatrer med hale", h: "Liker nøtter" },
  { w: "KRABBE", c: "Sjødyr med klør", h: "Går sidelengs" },
  { w: "HVALROSS", c: "Stort sjøpattedyr med støttenner", h: "Liker kaldt vann" },
  { w: "REV", c: "Lurt dyr i skogen", h: "Rød og hvit hale" },
  { w: "ULV", c: "Hyler mot månen", h: "Ligner på en hund" },
  { w: "LAKS", c: "Fisk som svømmer motstrøms", h: "Populær på sushi" },

  // --- HJEM & FRITID (HOME & LEISURE) ---
  { w: "SOFA", c: "Møbel i stua", h: "Her ser man på TV" },
  { w: "BOKHYLLE", c: "Her står bøkene", h: "IKEA-klassikeren Billy" },
  { w: "GARDIN", c: "Henger foran vinduet", h: "Skjermer for sola" },
  { w: "SYKKEL", c: "Fremkomstmiddel med to hjul", h: "Miljøvennlig transport" },
  { w: "FOTBALL", c: "Lek med ball og bein", h: "Norges største sport" },
  { w: "SKISEKK", c: "Bæres på ryggen i marka", h: "Inneholder ofte kvikk-lunsj" },
  { w: "TANNKREM", c: "I tuben ved vasken", h: "Gjør tennene hvite" },
  { w: "HODETELEFON", c: "Hører på musikk med disse", h: "Sitter på ørene" },
  { w: "GITAR", c: "Instrument med strenger", h: "Kan spilles ved bålet" },
  { w: "PIANO", c: "Stort tangentinstrument", h: "Finnes i sort eller hvitt" },
  { w: "STØVSUGER", c: "Sugemaskin for støv", h: "Bråker på lørdager" },
  { w: "BAD", c: "Her vasker man seg", h: "Våtrom" },
  { w: "OVN", c: "Lager varme", h: "Bakes i denne" },

  // --- STEDER & LANDEMERKER ---
  { w: "OSLO", c: "Norges hovedstad", h: "Ligger innerst i en fjord" },
  { w: "BERGEN", c: "Byen mellom de syv fjell", h: "Kjent for Bryggen og regn" },
  { w: "TRONDHEIM", c: "Bartebyen", h: "Hjemmet til Nidarosdomen" },
  { w: "TROMSØ", c: "Nordens Paris", h: "Mørketid og nordlys" },
  { w: "STAVANGER", c: "Oljehovedstaden", h: "By i Rogaland" },
  { w: "LILLEHAMMER", c: "Vinter-OL by 1994", h: "Ved Mjøsa" },
  { w: "KRISTIANSAND", c: "Sørlandets perle", h: "Her er Dyreparken" },
  { w: "STORTINGET", c: "Her vedtas lovene", h: "Ligger på Karl Johan" },
  { w: "OPERAEN", c: "Marmorbygg i Bjørvika", h: "Her kan man gå på taket" },
  { w: "AVALDSNES", c: "Norges eldste kongesete", h: "Vikinghistorie på Karmøy" },
  { w: "ELV", c: "Rennende vann", h: "Lågen eller Glomma" },
  { w: "ØY", c: "Land midt i vannet", h: "Hit må man ta båt" },

  // --- NATUR & VÆR ---
  { w: "SNØMANN", c: "Figur laget av hvit nedbør", h: "Har ofte gulrot-nese" },
  { w: "REGNBUER", c: "Farger på himmelen", h: "Vann + sol" },
  { w: "SOLNEDGANG", c: "Når dagen blir kveld", h: "Vakkert lys i vest" },
  { w: "TORDENVÆR", c: "Lyn og brak", h: "Kraftig uvær" },
  { w: "FURU", c: "Vanlig bartre", h: "Har nåler" },
  { w: "BLOMSTER", c: "Pynter opp i hagen", h: "Rose er en" },
  { w: "NORDLYS", c: "Grønt lys på himmelen", h: "Aurora Borealis" },
  { w: "ISBRE", c: "Stor ismasse på fjellet", h: "Hardangerjøkulen er en" },
  { w: "IS", c: "Frossent vann", h: "Glatte veier" },
  { w: "SOL", c: "Varmer oss", h: "Sentrum i solsystemet" },

  // --- YRKER & SKOLE ---
  { w: "POLITI", c: "Lovens lange arm", h: "Kjører biler med blålys" },
  { w: "BRANNMANN", c: "Slukker branner", h: "Redder katter i trær" },
  { w: "ELEKTRIKER", c: "Jobber med strøm", h: "Fikser sikringsskapet" },
  { w: "SNEKKER", c: "Bygger hus av tre", h: "Har hammer og sag" },
  { w: "BONDE", c: "Produserer mat på gård", h: "Kjører traktor" },
  { w: "LÆRER", c: "Jobber på skolen", h: "Underviser elever" },
  { w: "PILOT", c: "Styrer flyet", h: "Jobber i cockpiten" },
  { w: "STUDENT", c: "Leser på universitetet", h: "Lærer etter videregående" },
  { w: "VISKELÆR", c: "Fjerner blyantstreker", h: "Nyttig på skolen" },
  { w: "PENAL", c: "Her har man blyanter", h: "Ligger i sekken" },
  { w: "SKOLESEKK", c: "Bæres på ryggen til timen", h: "Fylt med bøker" },
  { w: "BOK", c: "Noe å lese i", h: "Har mange sider" },

  // --- HANDLINGER & DIVERSE ---
  { w: "STRIKKING", c: "Lage klær av ull", h: "Hobby med pinner" },
  { w: "SVØMMING", c: "Bevege seg i vann", h: "Trening i basseng" },
  { w: "LESING", c: "Se på ord i en bok", h: "Hobby for bokormer" },
  { w: "GIRAFF", c: "Dyr med lang hals", h: "Bor på savannen" },
  { w: "HAMMER", c: "Verktøy til spiker", h: "Tors favoritt" },
  { w: "GRIS", c: "Rosa dyr på gården", h: "Sier nøff" },
  { w: "HEST", c: "Kan man ri på", h: "Bor i stall" },
  { w: "ELEFANT", c: "Stort dyr med snabel", h: "Dumbo er en" },
  { w: "SKRAPER", c: "Fjerner is fra ruta", h: "Viktig om vinteren" },
  { w: "FLASKE", c: "Beholder for væske", h: "Laget av glass eller plast" },
  { w: "AVIS", c: "Nyheter på papir", h: "VG eller Aftenposten" },
  { w: "SOLBRILLER", c: "Beskytter øynene", h: "Brukes når det er lyst ute" },
  { w: "KRYSSORD", c: "Oppgave med ruter og ord", h: "Det du spiller nå!" },
  { w: "MYNT", c: "Rund pengedel", h: "Ikke seddel" },
  { w: "SKILPADDE", c: "Dyr med hus på ryggen", h: "Veldig treg" },
  { w: "BÅL", c: "Varme i skogen", h: "Her kan man grille pølser" },
  { w: "FLY", c: "Fugl av metall", h: "Går i lufta" },
  { w: "BIL", c: "Kjøretøy med hjul", h: "Tesla eller Ford" },
  { w: "BUS", c: "Lang bil", h: "Kollektivtransport" },
  { w: "TOG", c: "Går på skinner", h: "Vy eller SJ" },
  // --- SYNONYMER (Synonyms - Same meaning) ---
  { w: "GAVE", c: "Synonym for 'presang'" },
  { w: "BIL", c: "Synonym for 'kjøretøy'" },
  { w: "ANSRE", c: "Synonym for 'frykt'" },
  { w: "HURTIG", c: "Synonym for 'rask'" },
  { w: "VAKKER", c: "Synonym for 'pen'" },
  { w: "GALE", c: "Synonym for 'sprø'" },
  { w: "ETASJE", c: "Synonym for 'plan' i et hus" },

  // --- ANTONYMER (Antonyms - Opposites) ---
  { w: "MØRKE", c: "Motsatt av 'lys'" },
  { w: "SØT", c: "Motsatt av 'sur'" },
  { w: "TØRR", c: "Motsatt av 'våt'" },
  { w: "BRED", c: "Motsatt av 'smal'" },
  { w: "BILLIG", c: "Motsatt av 'dyr'" },
  { w: "HELT", c: "Motsatt av 'skurk'" },
  { w: "VÅKEN", c: "Motsatt av 'sovende'" },
  { w: "SANN", c: "Motsatt av 'falsk'" },

  // --- SAMMENSATTE ORD (Compound Words) ---
  { w: "SOLBRILLER", c: "Briller man bruker når det er lyst ute" },
  { w: "REGNKLE", c: "Klær man bruker når det pøser ned" },
  { w: "TANNKOST", c: "Børste for munnen" },
  { w: "MATPAKK", c: "Nistepakke man har med på skolen" },
  { w: "SKOLESEKK", c: "Veske man har på ryggen til skolen" },
  { w: "SJOKOLADE", c: "Brunt og søtt man ofte spiser i helga" },
  { w: "FOTBALL", c: "Sport man spiller med beina" },

  // --- GÅTER OG MORO (Riddles & Fun) ---
  { w: "EKKO", c: "Svarer uten å ha egen stemme" },
  { w: "FRAMTID", c: "Noe som alltid kommer, men aldri er her" },
  { w: "SKYGE", c: "Følger deg overalt når sola skinner" },
  { w: "VITS", c: "Noe man forteller for å få folk til å le" },
  { w: "DRØM", c: "En film man ser mens man sover" },
  { w: "NAVN", c: "Noe som tilhører deg, men andre bruker det mer" },
  { w: "HULL", c: "Jo mer du tar bort, jo større blir det" },

  // --- AVANSERT GRAMMATIKK (Advanced Grammar) ---
  { w: "SAMSVAR", c: "Når adjektivet må stemme med substantivet" },
  { w: "V2REGEL", c: "Viktig regel for verbet i en norsk setning" },
  { w: "MODAL", c: "Verb som 'kan', 'vil' eller 'skal'" },
  { w: "EIEFORM", c: "Når man legger til -s (f.eks. 'Maris bok')" },
  { w: "DIFTONG", c: "To vokaler som smelter sammen (f.eks. 'ei', 'øy')" },
  { w: "STUM", c: "En bokstav man skriver, men ikke uttaler (f.eks. 'h' i 'hva')" },
  { w: "PARADOKS", c: "Noe som virker selvmotsigende" },
  // --- FARGER (Colors) ---
  { w: "BLÅ", c: "Fargen på himmelen" },
  { w: "RØD", c: "Fargen på en tomat" },
  { w: "GUL", c: "Fargen på sola" },
  { w: "GRÅ", c: "Fargen på en stein" },
  { w: "HVIT", c: "Fargen på snø" },
  { w: "SORT", c: "Fargen på natta" },
  { w: "ROSA", c: "Fargen på en gris" },
  { w: "BRUN", c: "Fargen på sjokolade" },

  // --- DYR (Animals) ---
  { w: "KU", c: "Sier mø" },
  { w: "SAU", c: "Sier bæ" },
  { w: "MUS", c: "Liker ost" },
  { w: "APE", c: "Liker banan" },
  { w: "ELG", c: "Skogens konge" },
  { w: "GRIS", c: "Har krøll på halen" },
  { w: "HEST", c: "Man kan ri på den" },
  { w: "AND", c: "Svømmer i dammen" },
  { w: "UGLA", c: "Sier hov-hov om natta" },

  // --- KROPP (Body Parts) ---
  { w: "FOT", c: "Nederst på beinet" },
  { w: "ARM", c: "Sitter på skuldra" },
  { w: "HÅND", c: "Her har du fingre" },
  { w: "ØRE", c: "Hører med denne" },
  { w: "ØYE", c: "Ser med denne" },
  { w: "NESE", c: "Lukter med denne" },
  { w: "MUNN", c: "Snakker med denne" },
  { w: "KNE", c: "Midt på beinet" },
  { w: "HÅR", c: "Vokser på hodet" },

  // --- HJEMMET (Home) ---
  { w: "SENG", c: "Her skal du sove" },
  { w: "TV", c: "Ser på film her" },
  { w: "MAT", c: "Noe du spiser" },
  { w: "VANN", c: "Noe du drikker" },
  { w: "DØR", c: "Går inn her" },
  { w: "TAK", c: "Helt øverst i rommet" },
  { w: "PEIS", c: "Her brenner veden" },
  { w: "OVN", c: "Her bakes kaka" },

  // --- NATUR (Nature) ---
  { w: "TRE", c: "Har grønne blader" },
  { w: "BLOMST", c: "Lukter godt i hagen" },
  { w: "REGN", c: "Vann fra skyene" },
  { w: "SNØ", c: "Kaldt og hvitt ute" },
  { w: "LYS", c: "Motsatt av mørke" },
  { w: "IS", c: "Kaldt vann eller dessert" },
  { w: "STØV", c: "Må tørkes bort" },

  // --- HANDLINGER (Simple Actions) ---
  { w: "LEKE", c: "Det barn gjør" },
  { w: "SOVE", c: "Gjøre i senga" },
  { w: "SPISE", c: "Gjøre med mat" },
  { w: "LØPE", c: "Gå veldig fort" },
  { w: "SI", c: "Bruke stemmen" },
  { w: "SE", c: "Bruke øynene" },
  { w: "GÅ", c: "Bruke beina" },
  // --- EN (Hankjønn / Masculine) ---
  { w: "EN", c: "... BIL (Kjøretøy)" },
  { w: "EN", c: "... BUSS (Kollektivt)" },
  { w: "EN", c: "... VEGG (I huset)" },
  { w: "EN", c: "... SKO (På foten)" },
  { w: "EN", c: "... TELEFON (Ringe)" },
  { w: "EN", c: "... KOPP (Drikke fra)" },
  { w: "EN", c: "... TALLERK (Spise fra)" },
  { w: "EN", c: "... KNIV (Skjære)" },
  { w: "EN", c: "... SKJERM (Se på)" },
  { w: "EN", c: "... BLYANT (Skrive)" },
  { w: "EN", c: "... SKOLE (Læring)" },
  { w: "EN", c: "... LÆRER (Jobb)" },
  { w: "EN", c: "... ELEV (I klassen)" },
  { w: "EN", c: "... BAKE (Lage brød)" },
  { w: "EN", c: "... FISK (I havet)" },
  { w: "EN", c: "... FUGLE (I lufta)" },
  { w: "EN", c: "... HUND (Kjæledyr)" },
  { w: "EN", c: "... KATT (Kjæledyr)" },
  { w: "EN", c: "... STEIN (I naturen)" },
  { w: "EN", c: "... SKOG (Mange trær)" },
  { w: "EN", c: "... FLYPLASS (Reise)" },
  { w: "EN", c: "... BANK (Penger)" },
  { w: "EN", c: "... BUTIKK (Handle)" },
  { w: "EN", c: "... FILM (Kino)" },
  { w: "EN", c: "... SANG (Musikk)" },
  { w: "EN", c: "... VENN (Kamerat)" },
  { w: "EN", c: "... BROR (Slekting)" },
  { w: "EN", c: "... ONKEL (Slekting)" },
  { w: "EN", c: "... FETTER (Slekting)" },
  { w: "EN", c: "... MANN (Voksen)" },
  { w: "EN", c: "... GUTT (Barn)" },
  { w: "EN", c: "... SJEF (Leder)" },
  { w: "EN", c: "... DAG (Tid)" },
  { w: "EN", c: "... MÅNED (Tid)" },

  // --- EI (Hunkjønn / Feminine) ---
  { w: "EI", c: "... JENTE (Barn)" },
  { w: "EI", c: "... DAME (Voksen)" },
  { w: "EI", c: "... KVINNE (Voksen)" },
  { w: "EI", c: "... MOR (Mamma)" },
  { w: "EI", c: "... TANTE (Slekting)" },
  { w: "EI", c: "... KUSINE (Slekting)" },
  { w: "EI", c: "... SØSTER (Slekting)" },
  { w: "EI", c: "... BOK (Lese)" },
  { w: "EI", c: "... SOL (Varmer)" },
  { w: "EI", c: "... ØY (I vannet)" },
  { w: "EI", c: "... ELV (Rennende vann)" },
  { w: "EI", c: "... KLOKKE (Tid)" },
  { w: "EI", c: "... DØR (Inngang)" },
  { w: "EI", c: "... SENG (Sove)" },
  { w: "EI", c: "... FLASKE (Væske)" },
  { w: "EI", c: "... JAKKE (Klær)" },
  { w: "EI", c: "... BUKSE (Klær)" },
  { w: "EI", c: "... TRAPP (Gå opp)" },
  { w: "EI", c: "... HYTTE (Feriehus)" },
  { w: "EI", c: "... SKJE (Bestikk)" },
  { w: "EI", c: "... GRYTE (Koke)" },
  { w: "EI", c: "... PANNE (Steke)" },
  { w: "EI", c: "... LUE (Hodeplagg)" },
  { w: "EI", c: "... VESKE (Bære)" },
  { w: "EI", c: "... PARAPLY (Regn)" },
  { w: "EI", c: "... AVIS (Nyheter)" },
  { w: "EI", c: "... BRU (Over vann)" },
  { w: "EI", c: "... KYR (Dyr)" },
  { w: "EI", c: "... GEIT (Dyr)" },
  { w: "EI", c: "... KRÅKE (Fugl)" },
  { w: "EI", c: "... SIKRING (Strøm)" },
  { w: "EI", c: "... DYNE (Varmt)" },
  { w: "EI", c: "... PUTE (Mykt)" },

  // --- ET (Intetkjør / Neuter) ---
  { w: "ET", c: "... HUS (Bolig)" },
  { w: "ET", c: "... BORD (Møbel)" },
  { w: "ET", c: "... BARN (Liten person)" },
  { w: "ET", c: "... EPLE (Frukt)" },
  { w: "ET", c: "... EGG (Frokost)" },
  { w: "ET", c: "... GLASS (Drikke)" },
  { w: "ET", c: "... VINDU (Se ut)" },
  { w: "ET", c: "... TAK (Over oss)" },
  { w: "ET", c: "... GULV (Gå på)" },
  { w: "ET", c: "... TRE (Plante)" },
  { w: "ET", c: "... FJELL (Høyt)" },
  { w: "ET", c: "... HAV (Saltvann)" },
  { w: "ET", c: "... KORT (Betale)" },
  { w: "ET", c: "... PASS (Reise)" },
  { w: "ET", c: "... FLY (Lufta)" },
  { w: "ET", c: "... TOG (Skinner)" },
  { w: "ET", c: "... BREV (Post)" },
  { w: "ET", c: "... BOKSTAV (A, B, C)" },
  { w: "ET", c: "... ORD (Består av bokstaver)" },
  { w: "ET", c: "... BILDE (Se på)" },
  { w: "ET", c: "... KART (Vei)" },
  { w: "ET", c: "... SKAP (Lagring)" },
  { w: "ET", c: "... TEPPE (Gulv)" },
  { w: "ET", c: "... LAKEN (Seng)" },
  { w: "ET", c: "... SYKEHUS (Lege)" },
  { w: "ET", c: "... APOTEK (Medisin)" },
  { w: "ET", c: "... KONTOR (Jobbe)" },
  { w: "ET", c: "... KJØKKEN (Mat)" },
  { w: "ET", c: "... BAD (Vaske seg)" },
  { w: "ET", c: "... MÅLTID (Mat)" },
  { w: "ET", c: "... DYR (Levende)" },
  { w: "ET", c: "... ÅR (Tid)" },
  { w: "ET", c: "... MINUTT (Tid)" },
  { w: "ET", c: "... SEKUND (Tid)" },
  // --- KJØNN (Gender) ---
  { w: "HANKJØNN", c: "Kjønnet til 'en gutt'" },
  { w: "HUNKJØNN", c: "Kjønnet til 'ei jente'" },
  { w: "INTETKJØNN", c: "Kjønnet til 'et hus'" },
  { w: "EN", c: "Artikkel for hankjønn" },
  { w: "EI", c: "Artikkel for hunkjønn" },
  { w: "ET", c: "Artikkel for intetkjønn" },
  { w: "HAN", c: "Pronomen for 'en mann'" },
  { w: "HUN", c: "Pronomen for 'ei dame'" },
  { w: "DET", c: "Pronomen for 'et bord'" },
  { w: "DEN", c: "Pronomen for 'en stol'" },

  // --- SUBSTANTIV (Nouns) ---
  { w: "KATTEN", c: "Bestemt form av 'en katt'" },
  { w: "HUNDEN", c: "Bestemt form av 'en hund'" },
  { w: "HUSET", c: "Bestemt form av 'et hus'" },
  { w: "BARNA", c: "Flertall av 'et barn'" },
  { w: "BØKER", c: "Flertall av 'ei bok'" },
  { w: "SOLA", c: "Bestemt form av 'ei sol'" },
  { w: "MORA", c: "Bestemt form av 'ei mor'" },
  { w: "BORDET", c: "Bestemt form av 'et bord'" },
  { w: "BILENE", c: "Bestemt form flertall av 'en bil'" },
  { w: "EPLET", c: "Bestemt form av 'et eple'" },
  { w: "SKOENE", c: "Bestemt form flertall av 'en sko'" },
  { w: "KLOKKA", c: "Bestemt form av 'ei klokke'" },
  { w: "DØRA", c: "Bestemt form av 'ei dør'" },
  { w: "GUTTEN", c: "Bestemt form av 'en gutt'" },
  { w: "JENTA", c: "Bestemt form av 'ei jente'" },

  // --- VERB (Actions) ---
  { w: "INFINITIV", c: "Grunnformen av et verb" },
  { w: "PRESENS", c: "Tid for det som skjer nå" },
  { w: "PRETERITUM", c: "Tid for det som skjedde før" },
  { w: "SPISER", c: "Presens av 'å spise'" },
  { w: "LØPER", c: "Presens av 'å løpe'" },
  { w: "SNAKKER", c: "Presens av 'å snakke'" },
  { w: "SKREV", c: "Preteritum av 'å skrive'" },
  { w: "SANG", c: "Preteritum av 'å synge'" },
  { w: "GIKK", c: "Preteritum av 'å gå'" },
  { w: "SOV", c: "Preteritum av 'å sove'" },
  { w: "SA", c: "Preteritum av 'å si'" },
  { w: "DRO", c: "Preteritum av 'å dra'" },
  { w: "KOM", c: "Preteritum av 'å komme'" },
  { w: "LO", c: "Preteritum av 'å le'" },
  { w: "SÅ", c: "Preteritum av 'å se'" },

  // --- ADJEKTIV (Describing words) ---
  { w: "GRØNT", c: "Adjektivet 'grønn' for intetkjønn" },
  { w: "STORT", c: "Adjektivet 'stor' for intetkjønn" },
  { w: "LITE", c: "Adjektivet 'liten' for intetkjønn" },
  { w: "GULT", c: "Adjektivet 'gul' for intetkjønn" },
  { w: "RØDT", c: "Adjektivet 'rød' for intetkjønn" },
  { w: "BLÅTT", c: "Adjektivet 'blå' for intetkjønn" },
  { w: "SNILT", c: "Adjektivet 'snill' for intetkjønn" },
  { w: "SØTT", c: "Adjektivet 'søt' for intetkjønn" },
  { w: "DYRT", c: "Adjektivet 'dyr' for intetkjønn" },
  { w: "NYTT", c: "Adjektivet 'ny' for intetkjønn" },

  // --- PRONOMEN & PREPOSISJONER ---
  { w: "JEG", c: "Første person entall" },
  { w: "DU", c: "Andre person entall" },
  { w: "VI", c: "Første person flertall" },
  { w: "DERE", c: "Andre person flertall" },
  { w: "DE", c: "Tredje person flertall" },
  { w: "OSS", c: "Objektsform av 'vi'" },
  { w: "MEG", c: "Objektsform av 'jeg'" },
  { w: "DEG", c: "Objektsform av 'du'" },
  { w: "PÅ", c: "Preposisjon: Boka ligger ... bordet" },
  { w: "I", c: "Preposisjon: Jeg bor ... Norge" },
  { w: "TIL", c: "Preposisjon: Jeg går ... skolen" },
  { w: "MED", c: "Preposisjon: Jeg leker ... hunden" },
  { w: "AV", c: "Preposisjon: Laget ... tre" },
  { w: "FRA", c: "Preposisjon: Jeg kommer ... Bergen" },
  { w: "UNDER", c: "Motsatt av over" },
  { w: "BAK", c: "Motsatt av foran" },

  // --- GRAMMAR TERMS ---
  { w: "SUBJEKT", c: "Den som gjør noe i setningen" },
  { w: "OBJEKT", c: "Den handlingen går ut over" },
  { w: "ADVERB", c: "Beskriver et verb" },
  { w: "SAMSVAR", c: "Når adjektivet bøyes etter kjønn" },
  { w: "ENTALL", c: "Kun én ting" },
  { w: "FLERTALL", c: "Mer enn én ting" },
  { w: "BESTEMT", c: "Motsatt av ubestemt" },
  { w: "UBESTEMT", c: "Motsatt av bestemt" },
  { w: "KOMPARATIV", c: "Bøyning av adjektiv: 'større'" },
  { w: "SUPERLATIV", c: "Bøyning av adjektiv: 'størst'" },

  // --- VARIOUS GRAMMAR QUESTIONS ---
  { w: "BOKSTAV", c: "Hver del av et ord" },
  { w: "VOKAL", c: "A, E, I, O, U, Y, Æ, Ø, Å" },
  { w: "KONSONANT", c: "B, C, D, F, G..." },
  { w: "PUNKTUM", c: "Tegn etter en setning" },
  { w: "KOMMA", c: "Pause i en setning" },
  { w: "SPØRSMÅL", c: "Setning som slutter med '?'" },
  { w: "UTROP", c: "Setning som slutter med '!'" },
  { w: "DIALEKT", c: "Måten man snakker på et sted" },
  { w: "BOKMÅL", c: "Norges mest brukte skriftspråk" },
  { w: "NYNORSK", c: "Norges andre skriftspråk" },
  { w: "SAMMENSATT", c: "To ord som er satt sammen" },
  { w: "FORSTAVEL", c: "Noe som står foran ordet" },
  { w: "ETTERSTAVEL", c: "Noe som står etter ordet" },
  { w: "STAVELSE", c: "Hver lyd-del i et ord" },
  { w: "TRYKK", c: "Der lyden er sterkest i ordet" },
  { w: "ORDKLASSE", c: "Kategori som substantiv eller verb" },
  { w: "BØYNING", c: "Når ordet endrer form" },
  { w: "SAMLING", c: "En gruppe ord" },
  { w: "SETNING", c: "Ord som gir mening sammen" },
  { w: "ORD", c: "Består av bokstaver" },
  // --- 2 LETTERS (Connectors) ---
  { w: "IS", c: "Frossent vann" }, { w: "ØY", c: "Land i vann" }, { w: "ÅS", c: "Liten høyde" },
  { w: "EL", c: "Elektrisk kraft" }, { w: "AS", c: "Aksjeselskap" }, { w: "HÅ", c: "Gammel hai" },
  { w: "OS", c: "Røyk eller damp" }, { w: "BY", c: "Tettbebygd sted" }, { w: "LO", c: "Fiber på tøy" },
  { w: "UT", c: "Motsatt av inn" }, { w: "HØ", c: "Lyd av nøling" }, { w: "SI", c: "Bruke stemmen" },

  // --- 3 LETTERS (Bridges) ---
  { w: "ELV", c: "Rennende vann" }, { w: "SOL", c: "Varmer oss" }, { w: "MOR", c: "Mamma" },
  { w: "FAR", c: "Pappa" }, { w: "BIL", c: "Kjøretøy" }, { w: "TOG", c: "Skinnemaskin" },
  { w: "MAT", c: "Noe å spise" }, { w: "HUS", c: "Bygning" }, { w: "BOK", c: "Noe å lese" },
  { w: "TRE", c: "Plante" }, { w: "LUE", c: "Hodeplagg" }, { w: "SKO", c: "Fottøy" },
  { w: "REV", c: "Lurt dyr" }, { w: "ULV", c: "Grått rovdyr" }, { w: "OST", c: "Pålegg" },
  { w: "EGG", c: "Frokostmat" }, { w: "SAFT", c: "Søt drikke" }, { w: "ØKS", c: "Hogger ved" },
  { w: "BÅT", c: "Flyter på vann" }, { w: "SKY", c: "Hvit på blå himmel" }, { w: "ØRE", c: "Høreorgan" },

  // --- 4 LETTERS ---
  { w: "SENG", c: "Her sover man" }, { w: "BORD", c: "Møbel" }, { w: "STOL", c: "Sittemøbel" },
  { w: "KNIV", c: "Skjæreredskap" }, { w: "BRØD", c: "Bakes i ovn" }, { w: "MELK", c: "Hvit drikke" },
  { w: "FISK", c: "Svømmer" }, { w: "FUGL", c: "Har vinger" }, { w: "SKOG", c: "Mange trær" },
  { w: "FJEL", c: "Høy topp" }, { w: "GAVE", c: "Presang" }, { w: "DØRA", c: "Inngang" },
  { w: "MÅNE", c: "Lyser om natta" }, { w: "KAKE", c: "Søtt bakverk" }, { w: "SKRE", c: "Vise tekst" },
  { w: "VANN", c: "Livsviktig væske" }, { w: "LAMA", c: "Spyttende dyr" }, { w: "APEK", c: "Liker bananer" },

  // --- 5 LETTERS ---
  { w: "HJERTE", c: "Pumper blod" }, { w: "KAFFE", c: "Morgen-drikke" }, { w: "VINDU", c: "Se ut gjennom" },
  { w: "LAMPE", c: "Gir lys" }, { w: "SYKKEL", c: "To hjul" }, { w: "NORGE", c: "Vårt land" },
  { w: "SKOLE", c: "Sted for barn" }, { w: "EPLER", c: "Rund frukt" }, { w: "RADIO", c: "Hører musikk" },
  { w: "STRAND", c: "Sand ved havet" }, { w: "VINTER", c: "Kald tid" }, { w: "SOMMER", c: "Varm tid" },
  { w: "BILLE", c: "Lite insekt" }, { w: "JAKKE", c: "Ytterplagg" }, { w: "BUKSE", c: "Plagg for beina" },
  { w: "HANSKE", c: "For hendene" }, { w: "SJERNE", c: "Lyser i rommet" }, { w: "TIGER", c: "Stort kattedyr" },

  // --- 6 LETTERS ---
  { w: "FROKOST", c: "Første måltid" }, { w: "MIDDAG", c: "Varm mat" }, { w: "KJØKKEN", c: "Her lages mat" },
  { w: "MUSEUM", c: "Ser på kunst" }, { w: "KONTOR", c: "Arbeidsplass" }, { w: "BRILLE", c: "Hjelper synet" },
  { w: "BESTIKK", c: "Kniv og gaffel" }, { w: "NØKKEL", c: "Låser opp" }, { w: "TRAPPA", c: "Går opp og ned" },
  { w: "BANANER", c: "Gule frukter" }, { w: "REISEM", c: "Dra på tur" }, { w: "HYTTA", c: "Feriehus" },
  { w: "FLASKE", c: "Inneholder drikke" }, { w: "KOKKEN", c: "Lager maten" }, { w: "TANNKO", c: "Vasker tenner" },
  { w: "PARAPL", c: "Mot regn" }, { w: "KOFFER", c: "Pakker i denne" }, { w: "TEATER", c: "Ser skuespill" },

  // --- 7-8 LETTERS ---
  { w: "TELEFON", c: "Ringer med" }, { w: "STASJON", c: "Togstopp" }, { w: "ORDBOK", c: "Forklarer ord" },
  { w: "SYKEHUS", c: "Her er leger" }, { w: "APOTEK", c: "Selger medisin" }, { w: "LAPTOP", c: "Bærbar pc" },
  { w: "INTERNET", c: "Verdensveven" }, { w: "SKJERMEN", c: "Viser bildet" }, { w: "HEISEN", c: "Går mellom etasjer" },
  { w: "LOMMEBOK", c: "Her er penger" }, { w: "FLYPLASS", c: "Her er fly" }, { w: "PARKERING", c: "Sted for bil" },
  { w: "BIBLIOTEK", c: "Hus med bøker" }, { w: "RESTAURA", c: "Spisested" }, { w: "KALENDER", c: "Viser dato" },
  { w: "POSTKASS", c: "Her kommer brev" }, { w: "MALEKOST", c: "Brukes til maling" }, { w: "SYKKELVE", c: "Her sykler man" },

  // --- 9-12 LETTERS (The Hard Stuff) ---
  { w: "UNIVERSITET", c: "Høyere skole" }, { w: "KJØLESKAPET", c: "Holder mat kald" },
  { w: "DATAMASKINEN", c: "Jobbe-verktøy" }, { w: "BRANNSTASJON", c: "Slukker brann" },
  { w: "POLITIBILEN", c: "Lovens voktere" }, { w: "UTFORDRING", c: "Noe vanskelig" },
  { w: "KONKLUSJON", c: "Siste del" }, { w: "KJÆRLIGHET", c: "Varm følelse" },
  { w: "LEILIGHETEN", c: "Hjem i blokk" }, { w: "APPELSINEN", c: "Oransje frukt" },
  { w: "TANNLEGEN", c: "Sjekker hull" }, { w: "HOVEDSTADEN", c: "Viktigste by" },
  { w: "SJOKOLADE", c: "Søtt og brunt" }, { w: "GRATULERER", c: "Hilsen ved seier" },
  { w: "SOMMERFERIE", c: "Lang pause" }, { w: "FOTBALLBANE", c: "Her spilles kamp" },
  { w: "KINOFORSTIL", c: "Film på lerret" }, { w: "OVERRASKELS", c: "Uventet ting" },

  // --- 200+ RANDOMIZED ADDITIONS (Logic Optimized) ---
  { w: "ISBIL", c: "Selger kald mat" }, { w: "BÅL", c: "Flammer ute" }, { w: "VED", c: "Brenner i peisen" },
  { w: "UR", c: "Viser tiden" }, { w: "IS", c: "Vann som is" }, { w: "GUL", c: "Farge på sola" },
  { w: "BLÅ", c: "Farge på havet" }, { w: "RØD", c: "Farge på tomat" }, { w: "GRÅ", c: "Farge på stein" },
  { w: "LIT", c: "Ikke stor" }, { w: "MAT", c: "Spiselig" }, { w: "VÅT", c: "Ikke tørr" },
  { w: "SØT", c: "Smaker sukker" }, { w: "SUR", c: "Smaker sitron" }, { w: "SALT", c: "Smaker hav" },
  { w: "MYK", c: "Ikke hard" }, { w: "ØM", c: "Gjør litt vondt" }, { w: "RÅ", c: "Ikke kokt" },
  { w: "FRI", c: "Uten lenker" }, { w: "NY", c: "Ikke brukt" }, { w: "DYR", c: "Koster mye" },
  { w: "PIL", c: "Skytes med bue" }, { w: "TÅ", c: "Sitter på foten" }, { w: "ØY", c: "Land i sjøen" },
  { w: "ELV", c: "Rennende vann" }, { w: "ÅR", c: "365 dager" }, { w: "UKE", c: "Sju dager" },
  { w: "DAG", c: "Lyst ute" }, { w: "NATT", c: "Mørkt ute" }, { w: "SNØ", c: "Hvitt fra himmelen" },
  { w: "REGN", c: "Vått fra himmelen" }, { w: "VIND", c: "Luft i bevegelse" }, { w: "LYN", c: "Glimt i skyen" },
  { w: "TORDEN", c: "Bråk i skyen" }, { w: "HAGL", c: "Iskuler" }, { w: "TÅKE", c: "Grått og uklart" },
  { w: "DYNE", c: "Varmt i senga" }, { w: "PUTE", c: "Under hodet" }, { w: "LAKEN", c: "På madrassen" },
  { w: "SKAP", c: "Her er klærne" }, { w: "KOMMODE", c: "Skuffer" }, { w: "SPEIL", c: "Ser deg selv" },
  { w: "GARDIN", c: "Foran vinduet" }, { w: "TEPPE", c: "På gulvet" }, { w: "MALING", c: "Farge på veggen" },
  { w: "TAPET", c: "Mønster på veggen" }, { w: "GULV", c: "Her går man" }, { w: "TAK", c: "Over oss inne" },
  { w: "VEGG", c: "Huset har fire" }, { w: "DØR", c: "Lukkes og åpnes" }, { w: "LÅS", c: "Sikrer døra" },
  { w: "NØKKEL", c: "Åpner låsen" }, { w: "KLOKKE", c: "Hva er tiden?" }, { w: "REIM", c: "Holder klokka" },
  { w: "VISER", c: "Peker på tallet" }, { w: "TALL", c: "En to tre" }, { w: "BOKSTAV", c: "A B C" },
  { w: "PEN", c: "Fin å se på" }, { w: "STYGG", c: "Ikke pen" }, { w: "SNILL", c: "God mot andre" },
  { w: "SLEMM", c: "Ikke snill" }, { w: "GLAD", c: "Smiler mye" }, { w: "TRIST", c: "Gråter kanskje" },
  { w: "SINT", c: "Roper kanskje" }, { w: "REDD", c: "Skjelver litt" }, { w: "TRØTT", c: "Vil sove" },
  { w: "VÅKEN", c: "Ikke trøtt" }, { w: "SULTEN", c: "Vil ha mat" }, { w: "TØRST", c: "Vil ha vann" },
  { w: "VARME", c: "Fra ovnen" }, { w: "KULDE", c: "Fra fryseren" }, { w: "LYS", c: "Fra sola" },
  { w: "MØRKE", c: "Uten lys" }, { w: "LYD", c: "Høres med øret" }, { w: "STILL", c: "Uten lyd" },
  { w: "LUKT", c: "Kjennes med nesa" }, { w: "SMAK", c: "Kjennes med tunga" }, { w: "HUD", c: "Dekker kroppen" },
  { w: "BEIN", c: "Inne i kroppen" }, { w: "MUSKEL", c: "Gjør oss sterke" }, { w: "BLOD", c: "Rødt i kroppen" },
  { w: "LUNGE", c: "Puster med" }, { w: "MAGE", c: "Her er maten" }, { w: "HALS", c: "Mellom hode og kropp" },
  { w: "MUNN", c: "Snakker med" }, { w: "NESE", c: "Lukter med" }, { w: "ØYE", c: "Ser med" },
  { w: "PANNE", c: "Over øynene" }, { w: "KINN", c: "Ved siden av nesa" }, { w: "HAKE", c: "Under munnen" },
  { w: "HÅR", c: "På hodet" }, { w: "SKJEGG", c: "På haken" }, { w: "HALS", c: "Svelger med" },
  { w: "RYGG", c: "Bak på kroppen" }, { w: "MAGE", c: "Foran på kroppen" }, { w: "NAVEL", c: "Midt på magen" },
  { w: "ARM", c: "Henger fra skuldra" }, { w: "HÅND", c: "Ytterst på armen" }, { w: "FINGER", c: "Har fem på hver hånd" },
  { w: "NEGL", c: "Hardt på fingeren" }, { w: "FOT", c: "Går på denne" }, { w: "TÅ", c: "Ytterst på foten" },
  { w: "KNRE", c: "Midt på beinet" }, { w: "LÅR", c: "Øverst på beinet" }, { w: "LEGG", c: "Nederst på beinet" },
  { w: "ANKEL", c: "Mellom legg og fot" }, { w: "HÆL", c: "Bak på foten" }, { w: "SÅLE", c: "Under foten" },
  { w: "SKO", c: "Beskytter foten" }, { w: "SOKK", c: "Inne i skoen" }, { w: "TRUSE", c: "Innerst på kroppen" },
  { w: "BH", c: "Støtter brystet" }, { w: "SKJORTE", c: "Pent plagg" }, { w: "GENSER", c: "Varmt plagg" },
  { w: "VEST", c: "Uten ermer" }, { w: "BELTE", c: "Holder buksa" }, { w: "LOMME", c: "Her har man ting" },
  { w: "GLIDELÅS", c: "Lukker jakka" }, { w: "KNAPP", c: "I knappehullet" }, { w: "KRAGE", c: "Øverst på skjorta" },
  { w: "ERME", c: "Dekker armen" }, { w: "HETTE", c: "På jakka" }, { w: "SKJERF", c: "Rundt halsen" },
  { w: "VOTT", c: "Varmt på hånda" }, { w: "HATT", c: "På hodet" }, { w: "KAPP", c: "Hodeplagg" },
  { w: "SLIPS", c: "Rundt halsen til dress" }, { w: "DRESS", c: "Pent antrekk" }, { w: "KJULE", c: "Plagg for jenter" },
  { w: "SKJØRT", c: "Underdel for jenter" }, { w: "BLUSE", c: "Overdel for jenter" }, { w: "KÅPE", c: "Lang jakke" },
  { w: "STØVEL", c: "Vanntett sko" }, { w: "SANDAL", c: "Åpen sko" }, { w: "TØFFEL", c: "Inne-sko" },
  { w: "SKØYTE", c: "På isen" }, { w: "SKI", c: "I snøen" }, { w: "STAV", c: "Trengs til ski" },
  { w: "AKEBRETT", c: "I bakken" }, { w: "SLEDE", c: "Bak hesten" }, { w: "VOGN", c: "Bak bilen" },
  { w: "SYKKEL", c: "Tråkker på pedal" }, { w: "PEDAL", c: "Gir fart" }, { w: "STYRE", c: "Svinger sykkelen" },
  { w: "HJUL", c: "Triller rundt" }, { w: "DEKK", c: "Gummi på hjulet" }, { w: "VENTIL", c: "Fyller luft" },
  { w: "KJEDE", c: "Går rundt tannhjul" }, { w: "BREMS", c: "Stopper farten" }, { w: "BJELLE", c: "Lager lyd" },
  { w: "REFLEKS", c: "Lyser i mørket" }, { w: "LYKT", c: "Viser vei" }, { w: "BATTERI", c: "Gir strøm" },
  { w: "LEDNING", c: "Fører strøm" }, { w: "KONTAKT", c: "I veggen" }, { w: "BRYTER", c: "Slår på lyset" },
  { w: "PÆRE", c: "Lyser i lampa" }, { w: "STIKK", c: "Sted for strøm" }, { w: "VARME", c: "Fra peisen" },
  { w: "OVN", c: "Varmer huset" }, { w: "PEIS", c: "Her brenner ved" }, { w: "PIPE", c: "Røyken går ut her" },
  { w: "VED", c: "Tre til brenning" }, { w: "ØKS", c: "Kløyver ved" }, { w: "SAG", c: "Delte planker" },
  { w: "HAMMER", c: "Slår inn spiker" }, { w: "SPIKER", c: "Holder ting sammen" }, { w: "SKRUE", c: "Settes inn med trekker" },
  { w: "TANG", c: "Holder fast ting" }, { w: "BOR", c: "Lager hull" }, { w: "HØVEL", c: "Gjør treverket glatt" },
  { w: "LIM", c: "Fester ting" }, { w: "TEIP", c: "Klissete rull" }, { w: "SAKS", c: "Klipper papir" },
  { w: "PAPIR", c: "Skriver på dette" }, { w: "BLYANT", c: "Tegner med" }, { w: "PENN", c: "Skriver med" },
  { w: "VISKEL", c: "Fjerner blyant" }, { w: "LINJAL", c: "Måler lengde" }, { w: "MAPPE", c: "Holder ark" },
  { w: "PERM", c: "Samler papirer" }, { w: "PULT", c: "Sitter ved på skolen" }, { w: "TAVLE", c: "Læreren skriver her" },
  { w: "KRITT", c: "Skriver på tavla" }, { w: "SVAMP", c: "Vasker tavla" }, { w: "SEKK", c: "Bæres på ryggen" },
  { w: "BOK", c: "Inneholder tekst" }, { w: "SIDE", c: "I boka" }, { w: "PERM", c: "Utsiden av boka" },
  { w: "LEKSE", c: "Skolearbeid hjemme" }, { w: "FERIE", c: "Fri fra skolen" }, { w: "EKSAMEN", c: "Stor prøve" },
  { w: "KART", c: "Viser verden" }, { w: "GLOBUS", c: "Rundt verdenskart" }, { w: "KOMPASS", c: "Viser nord" },
  { w: "NORD", c: "Opp på kartet" }, { w: "SØR", c: "Ned på kartet" }, { w: "ØST", c: "Høyre på kartet" },
  { w: "VEST", c: "Venstre på kartet" }, { w: "LAND", c: "Stat" }, { w: "BY", c: "Stor tettsted" },
  { w: "FYLKE", c: "Del av landet" }, { w: "KOMMUNE", c: "Lokalt område" }, { w: "GRENSE", c: "Mellom land" },
  { w: "PASS", c: "Må ha for å reise" }, { w: "VISUM", c: "Tillatelse til innreise" }, { w: "FLY", c: "Reiser i lufta" },
  { w: "BUSS", c: "Mange passasjerer" }, { w: "TRIKK", c: "Går i gata på skinner" }, { w: "T-BANE", c: "Under jorda" },
  { w: "BÅT", c: "På havet" }, { w: "FERGE", c: "Frakt mellom land" }, { w: "SKIP", c: "Stor båt" },
  { w: "HAVN", c: "Her ligger båtene" }, { w: "BRYGGA", c: "Her går man i land" }, { w: "FYR", c: "Lyser for skip" },
  { w: "ANKE", c: "Holder båten fast" }, { w: "SEIL", c: "Fanger vinden" }, { w: "MAST", c: "Holder seilet" },
  { w: "DEKK", c: "Gulvet på båten" }, { w: "LUGAR", c: "Soverom på båten" }, { w: "KAPTEIN", c: "Sjef på båten" },
  { w: "MATROS", c: "Jobber på båten" }, { w: "KOKK", c: "Lager maten" }, { w: "MENY", c: "Liste over mat" },
  { w: "SERVIT", c: "Bærer maten" }, { w: "TALLERK", c: "Mat på denne" }, { w: "GLASS", c: "Drikke i dette" },
  { w: "KOPP", c: "Varm drikke i denne" }, { w: "SKJE", c: "Spiser suppe med" }, { w: "GAFFEL", c: "Stikker maten" },
  { w: "KNIV", c: "Deler maten" }, { w: "SERVIETT", c: "Tørker munnen" }, { w: "DUK", c: "På bordet" },
  { w: "STOL", c: "Sitter på denne" }, { w: "BORD", c: "Spiser ved dette" }, { w: "REGNING", c: "Må betale denne" },
  { w: "PENGER", c: "Betaler med" }, { w: "KORT", c: "Plastpenger" }, { w: "KODE", c: "Må huske denne" },
  { w: "KVITTERI", c: "Bevis på kjøp" }, { w: "BUTIKK", c: "Her handler man" }, { w: "SENTER", c: "Mange butikker" },
  { w: "KASSE", c: "Her betaler man" }, { w: "POSE", c: "Bærer varene i" }, { w: "VARE", c: "Ting man kjøper" },
  { w: "PRIS", c: "Hva det koster" }, { w: "SALG", c: "Billigere nå" }, { w: "KUNDE", c: "Den som kjøper" },
  { w: "SELG", c: "Den som selger" }, { w: "JOBB", c: "Arbeid" }, { w: "LØNN", c: "Penger for jobb" },
  { w: "SKATT", c: "Penger til staten" }, { w: "BANK", c: "Passer på pengene" }, { w: "RENTE", c: "Prisen på lån" },
  { w: "LÅN", c: "Penger man skylder" }, { w: "GJELD", c: "Summen man skylder" }, { w: "FORMUE", c: "Det man eier" },
  { w: "RIK", c: "Har mye penger" }, { w: "FATTIG", c: "Har lite penger" }, { w: "BILLIG", c: "Koster lite" },
  { w: "DYR", c: "Koster mye" }, { w: "GRATIS", c: "Koster ingenting" }, { w: "GULL", c: "Gult metall" },
  { w: "SØLV", c: "Grått metall" }, { w: "KOBBER", c: "Brunt metall" }, { w: "JERN", c: "Hardt metall" },
  { w: "STÅL", c: "Sterkt metall" }, { w: "STEIN", c: "Fra fjellet" }, { w: "SAND", c: "Små steiner" },
  { w: "JORD", c: "Planter vokser her" }, { w: "LEIRE", c: "Myk jord" }, { w: "GRUS", c: "Småstein på veien" },
  { w: "ASFALT", c: "Svart på veien" }, { w: "BETONG", c: "Grått i huset" }, { w: "GLASS", c: "I vinduet" },
  { w: "PLAST", c: "Mange ting lages av" }, { w: "GUMMI", c: "I bildekk" }, { w: "TRE", c: "Materiale fra skogen" },
  { w: "PLANK", c: "Saget tre" }, { w: "PAPIR", c: "Laget av tre" }, { w: "PAPP", c: "Tykt papir" },
  { w: "STOFF", c: "Lages klær av" }, { w: "ULL", c: "Fra sauen" }, { w: "BOMULL", c: "Fra hvit plante" },
  { w: "SILKE", c: "Fra larven" }, { w: "SKINN", c: "Fra dyret" }, { w: "LÆR", c: "Behandlet skinn" },
  { w: "FARGE", c: "Rød blå gul" }, { w: "LYS", c: "Motsatt av mørk" }, { w: "MØRK", c: "Motsatt av lys" },
  { w: "RUND", c: "Som en ball" }, { w: "FIRKANT", c: "Fire hjørner" }, { w: "TREKANT", c: "Tre hjørner" },
  { w: "STREK", c: "Linje" }, { w: "PUNKT", c: "Liten prikk" }, { w: "SIRKEL", c: "Helt rund" },
  { w: "KULE", c: "Rund som jord" }, { w: "KUBE", c: "Terning" }, { w: "REKTAGEL", c: "Lang firkant" },
  { w: "STØRREL", c: "Hvor stor den er" }, { w: "LITEN", c: "Ikke stor" }, { w: "STOR", c: "Ikke liten" },
  { w: "LANG", c: "Mange meter" }, { w: "KORT", c: "Få meter" }, { w: "HØY", c: "Motsatt av lav" },
  { w: "LAV", c: "Motsatt av høy" }, { w: "BRED", c: "Motsatt av smal" }, { w: "SMAL", c: "Motsatt av bred" },
  { w: "TYKK", c: "Motsatt av tynn" }, { w: "TYNN", c: "Motsatt av tykk" }, { w: "TUNG", c: "Motsatt av lett" },
  { w: "LETT", c: "Motsatt av tung" }, { w: "HARD", c: "Motsatt av myk" }, { w: "MYK", c: "Motsatt av hard" },
  { w: "GLATT", c: "Som isen" }, { w: "RU", c: "Som sandpapir" }, { w: "SKARP", c: "Som kniven" },
  { w: "SLØV", c: "Ikke skarp" }, { w: "VARM", c: "Motsatt av kald" }, { w: "KALD", c: "Motsatt av varm" },
  { w: "FERSK", c: "Helt ny mat" }, { w: "GAMMEL", c: "Ikke ny" }, { w: "UNG", c: "Ikke gammel" },
  { w: "VAKKER", c: "Veldig fin" }, { w: "STYGG", c: "Ikke fin" }, { w: "FLINK", c: "God til noe" },
  { w: "DUM", c: "Ikke smart" }, { w: "SMART", c: "Klok" }, { w: "MODIG", c: "Tør mye" },
  { w: "REID", c: "Tør lite" }, { w: "STOLT", c: "Veldig fornøyd" }, { w: "TRYGG", c: "Ikke redd" },
  { w: "FARLIG", c: "Ikke trygg" }, { w: "VIKTIG", c: "Må gjøres" }, { w: "VANLIG", c: "Skjer ofte" },
  { w: "SJELDEN", c: "Skjer ikke ofte" }, { w: "HELT", c: "En person i historien" }, { w: "SKURK", c: "En dårlig person" },
  { w: "KONGE", c: "Sjef i landet" }, { w: "DRONNI", c: "Gift med konge" }, { w: "PRINS", c: "Sønn av konge" },
  { w: "PRINSES", c: "Datter av konge" }, { w: "SLOTT", c: "Her bor kongen" }, { w: "KRONE", c: "På hodet til kongen" },
  { w: "VAKT", c: "Passer på slottet" }, { w: "FLAGG", c: "Rødt hvitt blått" }, { w: "NASJON", c: "Et land" },
  { w: "FOLK", c: "Mennesker" }, { w: "BARN", c: "Liten person" }, { w: "VOKSEN", c: "Stor person" },
  { w: "MANN", c: "Voksen gutt" }, { w: "KVINNE", c: "Voksen jente" }, { w: "GUTT", c: "Liten mann" },
  { w: "JENTE", c: "Liten kvinne" }, { w: "BABY", c: "Helt ny person" }, { w: "VENN", c: "En du liker" },
  { w: "NABO", c: "Bor ved siden av" }, { w: "FAMILIE", c: "De du er i slekt med" }, { w: "SØSKEN", c: "Bror og søster" },
  { w: "BROR", c: "Gutt med samme foreldre" }, { w: "SØSTER", c: "Jente med samme foreldre" }, { w: "TANTE", c: "Søster til mor eller far" },
  { w: "ONKEL", c: "Bror til mor eller far" }, { w: "FETTER", c: "Sønn av tante eller onkel" }, { w: "KUSINE", c: "Datter av tante eller onkel" },
  { w: "BESTEMOR", c: "Mor til mor eller far" }, { w: "BESTEFAR", c: "Far til mor eller far" }, { w: "SLEKT", c: "Hele familien" },
  { w: "NAVN", c: "Hva du heter" }, { w: "ALDER", c: "Hvor gammel du er" }, { w: "BURSDA", c: "Dagen du ble født" },
  { w: "FEST", c: "Feiring" }, { w: "MORO", c: "Gøy" }, { w: "SPILL", c: "Kryssord for eksempel" },
  { w: "VINNER", c: "Den som vant" }, { w: "TAPER", c: "Den som ikke vant" }, { w: "POENG", c: "Dette samler man" },
  { w: "REGLER", c: "Må følges i spillet" }, { w: "TUR", c: "Nå er det deg" }, { w: "TERNING", c: "Seks sider" },
  { w: "BRIKKE", c: "Flyttes på brettet" }, { w: "BRETT", c: "Her spilles spillet" }, { w: "KORT", c: "Spill med disse" },

    // --- Grammatik Overload ---
  { w: "IKKE", c: "Adverbet for 'not'" },
  { w: "ALDRI", c: "Adverbet for 'never'" },
  { w: "ALLTID", c: "Adverbet for 'always'" },
  { w: "OFTE", c: "Adverbet for 'often'" },
  { w: "KANSKJE", c: "Adverbet for 'maybe'" },
  { w: "EGENTLIG", c: "Adverbet for 'actually'" },
  { w: "FREMDELES", c: "Adverbet for 'still'" },
  { w: "ALLEREDE", c: "Adverbet for 'already'" },
  { w: "FORDI", c: "Subjunksjon for 'because'" },
  { w: "HVIS", c: "Subjunksjon for 'if'" },
  { w: "SELVOM", c: "Subjunksjon for 'even though'" },
  { w: "SIDEN", c: "Subjunksjon for 'since'" },
  { w: "SIKKERT", c: "Adverbet for 'probably/surely'" },
  { w: "BARE", c: "Adverbet for 'just/only'" },
  { w: "OGSÅ", c: "Adverbet for 'also'" },
  { w: "SJELDEN", c: "Adverbet for 'seldom'" },
  { w: "DESSVERRE", c: "Adverbet for 'unfortunately'" },
  { w: "AT", c: "Subjunksjon for 'that'" },
  { w: "FAKTISK", c: "Adverbet for 'actually/factually'" },
  { w: "SUBJEKT", c: "Hva står S for i SAV?" },

   // --- Fortid av ---
  { w: "SÅ", c: "Fortid av 'å se'" },
  { w: "GIKK", c: "Fortid av 'å gå'" },
  { w: "VISSTE", c: "Fortid av 'å vite'" },
  { w: "GJORDE", c: "Fortid av 'å gjøre'" },
  { w: "VAR", c: "Fortid av 'å være'" },
  { w: "HADDE", c: "Fortid av 'å ha'" },
  { w: "TOK", c: "Fortid av 'å ta'" },
  { w: "FIKK", c: "Fortid av 'å få'" },
  { w: "SA", c: "Fortid av 'å si'" },
  { w: "KOM", c: "Fortid av 'å komme'" },
  { w: "SKREV", c: "Fortid av 'å skrive'" },
  { w: "FANT", c: "Fortid av 'å finne'" },
  { w: "VILLE", c: "Fortid av 'å ville'" },
  { w: "KUNNE", c: "Fortid av 'å kunne'" },
  { w: "FORSTOD", c: "Fortid av 'å forstå'" },
  { w: "SPURTE", c: "Fortid av 'å spørre'" },
  { w: "SATT", c: "Fortid av 'å sitte' (NB: satt er fortid av sitte, ikke sette)" },
  { w: "LÅ", c: "Fortid av 'å ligge'" },
  { w: "LA", c: "Fortid av 'å legge'" },
  { w: "VANT", c: "Fortid av 'å vinne'" },

   // --- Artikkeler En,Ei,Et ---
  { w: "ET", c: "Artikkel for 'hus'" },
  { w: "EN", c: "Artikkel for 'bil'" },
  { w: "EI", c: "Artikkel for 'sol'" },
  { w: "EPLET", c: "Bestemt form av 'et eple'" },
  { w: "MANNEN", c: "Bestemt form av 'en mann'" },
  { w: "BARN", c: "Flertall av 'et barn'" },
  { w: "HUNDENE", c: "Bestemt form flertall av 'en hund'" },
  { w: "ET", c: "Artikkel for 'bord'" },
  { w: "EI", c: "Artikkel for 'bok'" },
  { w: "JENTA", c: "Bestemt form av 'ei jente'" },
  { w: "ET", c: "Artikkel for 'vindu'" },
  { w: "DAGER", c: "Flertall av 'en dag'" },
  { w: "LANDET", c: "Bestemt form av 'et land'" },
  { w: "EN", c: "Artikkel for 'kopp'" },
  { w: "DØRA", c: "Bestemt form av 'ei dør'" },
  { w: "FØTTER", c: "Flertall av 'en fot'" },
  { w: "BØKER", c: "Flertall av 'ei bok'" },
  { w: "ØYET", c: "Bestemt form av 'et øye'" },
  { w: "EN", c: "Artikkel for 'skole'" },
  { w: "ET", c: "Artikkel for 'tre'" },

   // --- Motsatte Av ---
  { w: "LITEN", c: "Motsatte av 'stor'" },
  { w: "DÅRLIG", c: "Motsatte av 'god'" },
  { w: "GAMMEL", c: "Motsatte av 'ny'" },
  { w: "KALD", c: "Motsatte av 'varm'" },
  { w: "ENKEL", c: "Motsatte av 'vanskelig'" },
  { w: "FATTIG", c: "Motsatte av 'rik'" },
  { w: "SLEMMER", c: "Motsatte av 'snill' (NB: Vanligvis 'slem')" },
  { w: "MØRK", c: "Motsatte av 'lys'" },
  { w: "LETT", c: "Motsatte av 'tung'" },
  { w: "SAKTE", c: "Motsatte av 'rask'" },
  { w: "STYGG", c: "Motsatte av 'pen/vakker'" },
  { w: "TRIST", c: "Motsatte av 'glad'" },
  { w: "LAV", c: "Motsatte av 'høy'" },
  { w: "TOM", c: "Motsatte av 'full'" },
  { w: "BILLIG", c: "Motsatte av 'dyr' (pris)" },
  { w: "TØRR", c: "Motsatte av 'våt'" },
  { w: "METT", c: "Motsatte av 'sulten'" },
  { w: "MYK", c: "Motsatte av 'hard'" },
  { w: "SENT", c: "Motsatte av 'tidlig'" },
  { w: "FEIL", c: "Motsatte av 'riktig'" },

  // --- Kroppen ---
  { w: "HODE", c: "Man tenker med denne" },
  { w: "ØYNE", c: "Man ser med disse" },
  { w: "ØRER", c: "Man hører med disse" },
  { w: "NESE", c: "Man lukter med denne" },
  { w: "MUNN", c: "Man snakker med denne" },
  { w: "HALS", c: "Mellom hodet og kroppen" },
  { w: "FINGRE", c: "Du har fem på hver hånd" },
  { w: "BEIN", c: "Du går på disse" },
  { w: "HJERTE", c: "Den pumper blod" },
  { w: "LUNGER", c: "Man puster med disse" },
  { w: "SYK", c: "Når du ikke er frisk" },
  { w: "LEGE", c: "En som hjelper syke" },
  { w: "VONDT", c: "Man får dette når man slår seg" },
  { w: "MEDISIN", c: "Man tar dette mot smerte" },
  { w: "LYKKELIG", c: "Å være veldig glad" },
  { w: "TRØTT", c: "Å trenge søvn" },
  { w: "SULTEN", c: "Å trenge mat" },
  { w: "TØRST", c: "Å trenge vann" },
  { w: "KNE", c: "Den sitter midt på beinet" },
  { w: "BRYN", c: "Håret over øynene" },

  // --- Tid ---
  { w: "TIME", c: "60 minutter" },
  { w: "DAG", c: "24 timer" },
  { w: "UKE", c: "7 dager" },
  { w: "ÅR", c: "365 dager" },
  { w: "MANDAG", c: "Den første dagen i uka" },
  { w: "SØNDAG", c: "Den siste dagen i uka" },
  { w: "I GÅR", c: "Dagen før i dag" },
  { w: "I MORGEN", c: "Dagen etter i dag" },
  { w: "JANUAR", c: "Den første måneden" },
  { w: "DESEMBER", c: "Den siste måneden" },
  { w: "MIDDAG", c: "Når sola står høyest" },
  { w: "NATT", c: "Når det er mørkt ute" },
  { w: "SEKEL", c: "100 år" },
  { w: "TID", c: "Klokka viser dette" },
  { w: "FERIE", c: "Man har fri fra jobb" },
  { w: "MINUTT", c: "60 sekunder" },
  { w: "SOMMER", c: "Den varme årstiden" },
  { w: "VINTER", c: "Den kalde årstiden" },
  { w: "HØST", c: "Når bladene faller" },
  { w: "VÅR", c: "Når blomstene kommer" },

  { w: "MAT", c: "Noe man spiser" },
  { w: "DRIKKE", c: "Noe man drikker" },
  { w: "VANN", c: "Det viktigste å drikke" },
  { w: "BRØD", c: "Laget av mel og vann" },
  { w: "MELK", c: "Hvit drikke fra kua" },
  { w: "KAFFE", c: "Varm, mørk drikke" },
  { w: "SUKKER", c: "Det smaker søtt" },
  { w: "SALT", c: "Det smaker salt" },
  { w: "KNIV", c: "Man skjærer med denne" },
  { w: "GAFFEL", c: "Man stikker maten med denne" },
  { w: "SKJE", c: "Man spiser suppe med denne" },
  { w: "TALLERKEN", c: "Maten ligger på denne" },
  { w: "GLASS", c: "Man drikker av dette" },
  { w: "KOPP", c: "Man drikker kaffe av denne" },
  { w: "KJØKKEN", c: "Rommet der man lager mat" },
  { w: "OVN", c: "Her steker man maten" },
  { w: "KJØLESKAP", c: "Her holder maten seg kald" },
  { w: "FROKOST", c: "Dagens første måltid" },
  { w: "LUNSJ", c: "Måltid midt på dagen" },
  { w: "KVELDSMAT", c: "Siste måltid før man sover" },

  // Preposisjoner
  { w: "I", c: "Preposisjon for 'in'" },
  { w: "PÅ", c: "Preposisjon for 'on'" },
  { w: "UNDER", c: "Preposisjon for 'under'" },
  { w: "OVER", c: "Preposisjon for 'over'" },
  { w: "MELLOM", c: "Preposisjon for 'between'" },
  { w: "BAK", c: "Preposisjon for 'behind'" },
  { w: "FORAN", c: "Preposisjon for 'in front of'" },
  { w: "VED", c: "Preposisjon for 'next to'" },
  { w: "FRA", c: "Preposisjon for 'from'" },
  { w: "TIL", c: "Preposisjon for 'to'" },

  // Spørreord
  { w: "HVEM", c: "Spørreord for 'who'" },
  { w: "HVA", c: "Spørreord for 'what'" },
  { w: "HVOR", c: "Spørreord for 'where'" },
  { w: "HVORFOR", c: "Spørreord for 'why'" },
  { w: "HVORDAN", c: "Spørreord for 'how'" },
  { w: "NÅR", c: "Spørreord for 'when'" },
  { w: "HVILKEN", c: "Spørreord for 'which'" },
  { w: "HVIS", c: "Spørreord for 'whose' (eierskap)" },
  { w: "HVORMANGE", c: "Spørreord for 'how many'" },
  { w: "HVORMYE", c: "Spørreord for 'how much'" },

  // Preposisjoner
  { w: "I", c: "Preposisjon for 'in'" },
  { w: "PÅ", c: "Preposisjon for 'on'" },
  { w: "UNDER", c: "Preposisjon for 'under'" },
  { w: "OVER", c: "Preposisjon for 'over'" },
  { w: "MELLOM", c: "Preposisjon for 'between'" },
  { w: "BAK", c: "Preposisjon for 'behind'" },
  { w: "FORAN", c: "Preposisjon for 'in front of'" },
  { w: "VED", c: "Preposisjon for 'next to'" },
  { w: "FRA", c: "Preposisjon for 'from'" },
  { w: "TIL", c: "Preposisjon for 'to'" },

  { w: "ALDRI", c: "Adverbet for 'never'" },
  { w: "ALLTID", c: "Adverbet for 'always'" },
  { w: "OFTE", c: "Adverbet for 'often'" },
  { w: "KANSKJE", c: "Adverbet for 'maybe'" },
  { w: "EGENTLIG", c: "Adverbet for 'actually'" },
  { w: "FREMDELES", c: "Adverbet for 'still'" },
  { w: "ALLEREDE", c: "Adverbet for 'already'" },
  { w: "SIKKERT", c: "Adverbet for 'probably'" },
  { w: "OGSÅ", c: "Adverbet for 'also'" },

  // Subjunksjoner (Leddsetningsinnledere)
  { w: "FORDI", c: "Subjunksjon for 'because'" },
  { w: "HVIS", c: "Subjunksjon for 'if'" },
  { w: "SELVOM", c: "Subjunksjon for 'although'" },
  { w: "SIDEN", c: "Subjunksjon for 'since'" },
  { w: "AT", c: "Subjunksjon for 'that'" },
  { w: "DA", c: "Når (om fortid/engangshendelse)" },
  { w: "NÅR", c: "Når (om vane/fremtid)" },
  { w: "MENS", c: "Subjunksjon for 'while'" },
  { w: "FØR", c: "Subjunksjon for 'before'" },
  { w: "ETTER", c: "Subjunksjon for 'after'" },

  // Mengdeord (Kvantorer)
  { w: "ALT", c: "Mengdeord for 'everything'" },
  { w: "INGENTING", c: "Mengdeord for 'nothing'" },
  { w: "NOEN", c: "Mengdeord for 'someone/somebody'" },
  { w: "INGEN", c: "Mengdeord for 'no one/nobody'" },
  { w: "NOE", c: "Mengdeord for 'something'" },
  { w: "MANGE", c: "Mengdeord for 'many'" },
  { w: "FÅ", c: "Mengdeord for 'few'" },
  { w: "ALLE", c: "Mengdeord for 'all'" },
  { w: "NOEN", c: "Mengdeord for 'some/any'" },
  { w: "BEGGE", c: "Mengdeord for 'both'" },

  // I stua
  { w: "SOFA", c: "En stor sitteplass i stua" },
  { w: "BORD", c: "Møbelet 'table'" },
  { w: "STOL", c: "Møbelet 'chair'" },
  { w: "BILDE", c: "Noe man har på veggen (painting)" },
  { w: "TEPPE", c: "Ligger på gulvet (carpet)" },
  { w: "LAMPE", c: "Gir lys i rommet" },
  { w: "TV", c: "Apparat for å se på film" },
  { w: "VINDU", c: "Man ser ut gjennom dette" },
  { w: "DØR", c: "Man går inn og ut av denne" },
  { w: "VEGG", c: "Selve 'veggen' i et hus" },

  // På kjøkkenet
  { w: "KJØLESKAP", c: "Holder maten kald" },
  { w: "OVN", c: "Her steker man maten" },
  { w: "TALLERKEN", c: "Maten ligger på denne" },
  { w: "GLASS", c: "Man drikker av dette" },
  { w: "KOPP", c: "Man drikker kaffe av denne" },
  { w: "KNIV", c: "Man skjærer med denne" },
  { w: "GAFFEL", c: "Man spiser med denne" },
  { w: "SKJE", c: "Man spiser suppe med denne" },
  { w: "PANNE", c: "Man steker mat i denne" },
  { w: "VASK", c: "Her vasker man opp (sink)" },

  // I byen
  { w: "GATE", c: "Hvor bilene kjører (street)" },
  { w: "PARK", c: "Et grønt område med trær" },
  { w: "BUTIKK", c: "Her kjøper man ting" },
  { w: "SYKEHUS", c: "Her er leger og pasienter" },
  { w: "SKOLE", c: "Her lærer elevene" },
  { w: "KINO", c: "Her ser man på film" },
  { w: "BIBLIOTEK", c: "Her låner man bøker" },
  { w: "BRU", c: "Går over vannet (bridge)" },
  { w: "KIRKE", c: "Et religiøst hus" },
  { w: "TORG", c: "En åpen plass i byen (square)" },

  // Yrker
  { w: "LÆRER", c: "Jobber på skole" },
  { w: "LEGE", c: "Jobber på sykehus" },
  { w: "SYKEPLEIER", c: "Hjelper syke mennesker" },
  { w: "POLITI", c: "Passer på lov og orden" },
  { w: "SJÅFØR", c: "En person som kjører" },
  { w: "KOKK", c: "Lager mat profesjonelt" },
  { w: "BONDE", c: "Jobber på gård" },
  { w: "INGENIØR", c: "Designer og bygger ting" },
  { w: "ADVOKAT", c: "Jobber med loven" },
  { w: "SERVITØR", c: "Serverer mat på restaurant" },

  // Motsatte av (Antonymer)
  { w: "TRIST", c: "Motsatte av 'glad'" },
  { w: "LAV", c: "Motsatte av 'høy'" },
  { w: "TOM", c: "Motsatte av 'full'" },
  { w: "BILLIG", c: "Motsatte av 'dyr'" },
  { w: "TØRR", c: "Motsatte av 'våt'" },
  { w: "METT", c: "Motsatte av 'sulten'" },
  { w: "MYK", c: "Motsatte av 'hard'" },
  { w: "SENT", c: "Motsatte av 'tidlig'" },
  { w: "FEIL", c: "Motsatte av 'riktig'" },
  { w: "FARLIG", c: "Motsatte av 'trygg'" },

  // Farger
  { w: "RØD", c: "Fargen 'red'" },
  { w: "BLÅ", c: "Fargen 'blue'" },
  { w: "GRØNN", c: "Fargen 'green'" },
  { w: "GUL", c: "Fargen 'yellow'" },
  { w: "HVIT", c: "Fargen 'white'" },
  { w: "SVART", c: "Fargen 'black'" },
  { w: "GRÅ", c: "Fargen 'gray'" },
  { w: "BRUN", c: "Fargen 'brown'" },
  { w: "LILLA", c: "Fargen 'purple'" },
  { w: "ORANSJE", c: "Fargen 'orange'" },

  // Personlighet
  { w: "SNILL", c: "En person som er 'kind'" },
  { w: "SLEM", c: "En person som er 'mean'" },
  { w: "MORSOM", c: "En person som er 'funny'" },
  { w: "KJEDELIG", c: "Noe som er 'boring'" },
  { w: "SMART", c: "En som er 'clever/smart'" },
  { w: "DUM", c: "Motsatte av smart" },
  { w: "ROLIG", c: "En som er 'quiet/calm'" },
  { w: "BRÅKETE", c: "En som lager mye lyd (loud)" },
  { w: "MODIG", c: "En som er 'brave'" },
  { w: "LAT", c: "En som ikke vil jobbe (lazy)" },

  // Størrelse og Form
  { w: "LANG", c: "Motsatte av kort" },
  { w: "KORT", c: "Motsatte av lang" },
  { w: "BRED", c: "Noe som er 'wide'" },
  { w: "SMAL", c: "Noe som er 'narrow'" },
  { w: "RUND", c: "Formen på en sirkel" },
  { w: "FIRKANTET", c: "Formen på en boks" },
  { w: "TYKK", c: "Noe som er" },
  { w: "TYNN", c: "Noe som er" },
  { w: "TUNG", c: "Noe som veier mye" },
  { w: "FLAT", c: "Noe som er 'flat'" },

  // Format: { w: "INFINITIV", c: "Presens | Preteritum | Futurum" }

  { w: "ÅSPISE", c: "Spiser | Spiste | Skal spise" },
  { w: "ÅDRIKKE", c: "Drikker | Drak | Skal drikke" },
  { w: "ÅSOVE", c: "Sover | Sov | Skal sove" },
  { w: "ÅGÅ", c: "Går | Gikk | Skal gå" },
  { w: "ÅKOMME", c: "Kommer | Kom | Skal komme" },
  { w: "ÅSE", c: "Ser | Så | Skal se" },
  { w: "ÅHØRE", c: "Hører | Hørte | Skal høre" },
  { w: "ÅLESE", c: "Leser | Leste | Skal lese" },
  { w: "ÅSKRIVE", c: "Skriver | Skrev | Skal skrive" },
  { w: "ÅSNAKKE", c: "Snakker | Snakket | Skal snakke" },
  { w: "ÅKJØPE", c: "Kjøper | Kjøpte | Skal kjøpe" },
  { w: "ÅSELGE", c: "Selger | Solgte | Skal selge" },
  { w: "ÅJOBBE", c: "Jobber | Jobbet | Skal jobbe" },
  { w: "ÅLÆRE", c: "Lærer | Lærte | Skal lære" },
  { w: "ÅFORSTÅ", c: "Forstår | Forstod | Skal forstå" },
  { w: "ÅVENTE", c: "Venter | Ventet | Skal vente" },
  { w: "ÅREISE", c: "Reiser | Reiste | Skal reise" },
  { w: "ÅBO", c: "Bor | Bodde | Skal bo" },
  { w: "ÅBRUKE", c: "Bruker | Brukte | Skal bruke" },
  { w: "ÅHJELPE", c: "Hjelper | Hjalp | Skal hjelpe" },

  // FORTID (Preteritum)
  { w: "TOK", c: "Fortid av 'å ta'" },
  { w: "SA", c: "Fortid av 'å si'" },
  { w: "DRO", c: "Fortid av 'å dra'" },
  { w: "GIKK", c: "Fortid av 'å gå'" },
  { w: "SÅ", c: "Fortid av 'å se'" },
  { w: "KOM", c: "Fortid av 'å komme'" },
  { w: "GJORDE", c: "Fortid av 'å gjøre'" },
  { w: "VAR", c: "Fortid av 'å være'" },
  { w: "HADDE", c: "Fortid av 'å ha'" },
  { w: "VANT", c: "Fortid av 'å vinne'" },
  { w: "SATT", c: "Fortid av 'å sitte'" },
  { w: "LÅ", c: "Fortid av 'å ligge'" },
  { w: "SKREV", c: "Fortid av 'å skrive'" },
  { w: "KJØPTE", c: "Fortid av 'å kjøpe'" },
  { w: "SPISTE", c: "Fortid av 'å spise'" },

  // NÅTID (Presens)
  { w: "TAR", c: "Nåtid av 'å ta'" },
  { w: "SIER", c: "Nåtid av 'å si'" },
  { w: "DRAR", c: "Nåtid av 'å dra'" },
  { w: "GÅR", c: "Nåtid av 'å gå'" },
  { w: "SER", c: "Nåtid av 'å se'" },
  { w: "KOMMER", c: "Nåtid av 'å komme'" },
  { w: "GJØR", c: "Nåtid av 'å gjøre'" },
  { w: "ER", c: "Nåtid av 'å være'" },
  { w: "HAR", c: "Nåtid av 'å ha'" },

  // FRAMTID (Futurum)
  { w: "SKAL TA", c: "Framtid av 'å ta'" },
  { w: "SKAL SI", c: "Framtid av 'å si'" },
  { w: "SKAL DRA", c: "Framtid av 'å dra'" },
  { w: "SKAL GÅ", c: "Framtid av 'å gå'" },
  { w: "SKAL SE", c: "Framtid av 'å se'" },
  { w: "SKAL KOMME", c: "Framtid av 'å komme'" }

];

const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P","Å"], 
  ["A","S","D","F","G","H","J","K","L","Ø","Æ"], 
  ["Z","X","C","V","B","N","M", "⌫"]
];

// --- CONFETTI PARTICLE ---
const ConfettiParticle = () => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(fallAnim, {
        toValue: 1,
        duration: 2000 + Math.random() * 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, SCREEN_HEIGHT],
  });

  const rotate = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
  });

  const left = Math.random() * SCREEN_WIDTH;
  const color = ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa'][Math.floor(Math.random() * 5)];

  return (
    <Animated.View style={[styles.confetti, { backgroundColor: color, left, transform: [{ translateY }, { rotate }] }]} />
  );
};

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(LEVELS[1]);
  const [gridData, setGridData] = useState({}); 
  const [placedWords, setPlacedWords] = useState([]);
  const [userLetters, setUserLetters] = useState({});
  const [wrongCells, setWrongCells] = useState([]);
  const [correctCells, setCorrectCells] = useState([]); 
  const [selR, setSelR] = useState(0);
  const [selC, setSelC] = useState(0);
  const [dir, setDir] = useState("h"); 
  const [loading, setLoading] = useState(true);
  const [showWin, setShowWin] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const cellSize = Math.floor((SCREEN_WIDTH - 30) / currentLevel.size);

  const generate = useCallback((levelObj = currentLevel) => {
    setLoading(true); setShowWin(false); setShowLevelSelect(false); 
    setUserLetters({}); setWrongCells([]); setCorrectCells([]);
    
    let tempGrid = {};
    let finalWords = [];
    const size = levelObj.size;

    const canPlaceStrict = (word, row, col, isHoriz) => {
      if (row < 0 || col < 0 || (isHoriz && col + word.length > size) || (!isHoriz && row + word.length > size)) return false;
      let intersects = false;
      for (let i = 0; i < word.length; i++) {
        const r = isHoriz ? row : row + i;
        const c = isHoriz ? col + i : col;
        const existing = tempGrid[`${r}-${c}`];
        if (existing && existing !== word[i]) return false;
        if (existing === word[i]) intersects = true;
        const neighbors = isHoriz ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]];
        for (let [dr, dc] of neighbors) {
          if (tempGrid[`${r + dr}-${c + dc}`] && !existing) return false;
        }
      }
      const pre = isHoriz ? `${row}-${col - 1}` : `${row - 1}-${col}`;
      const post = isHoriz ? `${row}-${col + word.length}` : `${row + word.length}-${col}`;
      if (tempGrid[pre] || tempGrid[post]) return false;
      return finalWords.length === 0 || intersects;
    };

    const solve = (bank, count) => {
      if (count >= levelObj.words || bank.length === 0) return true;
      for (let i = 0; i < bank.length; i++) {
        const candidate = bank[i];
        for (let target of [...finalWords].sort(() => Math.random() - 0.5)) {
          for (let charIdx = 0; charIdx < candidate.w.length; charIdx++) {
            const matchIdx = target.w.indexOf(candidate.w[charIdx]);
            if (matchIdx !== -1) {
              const newDir = target.dir === 'h' ? 'v' : 'h';
              const sR = newDir === 'v' ? target.cells[matchIdx].r - charIdx : target.cells[matchIdx].r;
              const sC = newDir === 'h' ? target.cells[matchIdx].c - charIdx : target.cells[matchIdx].c;
              if (canPlaceStrict(candidate.w, sR, sC, newDir === 'h')) {
                const newCells = candidate.w.split('').map((_, k) => ({ r: newDir === 'v' ? sR + k : sR, c: newDir === 'h' ? sC + k : sC }));
                newCells.forEach((cell, k) => tempGrid[`${cell.r}-${cell.c}`] = candidate.w[k]);
                finalWords.push({ ...candidate, dir: newDir, cells: newCells, r: sR, c_pos: sC });
                if (solve(bank.filter((_, idx) => idx !== i), count + 1)) return true;
                const rem = finalWords.pop();
                rem.cells.forEach(cl => { if (!finalWords.some(w => w.cells.some(c => c.r === cl.r && c.c === cl.c))) delete tempGrid[`${cl.r}-${cl.c}`]; });
              }
            }
          }
        }
      }
      return false;
    };

    const bank = [...WORD_BANK].sort(() => Math.random() - 0.5);
    const first = bank.shift();
    const fR = Math.floor(size/2), fC = Math.max(0, Math.floor(size/2) - Math.floor(first.w.length/2));
    const fCells = first.w.split('').map((_, i) => { tempGrid[`${fR}-${fC+i}`] = first.w[i]; return { r: fR, c: fC + i }; });
    finalWords.push({ ...first, dir: 'h', cells: fCells, r: fR, c_pos: fC });
    solve(bank, 1);
    
    const sorted = [...finalWords].sort((a,b) => a.r - b.r || a.c_pos - b.c_pos);
    sorted.forEach((w, i) => w.num = i + 1);
    setGridData(tempGrid); setPlacedWords(sorted); setCurrentLevel(levelObj); setLoading(false);
    if (sorted[0]) { setSelR(sorted[0].cells[0].r); setSelC(sorted[0].cells[0].c); setDir(sorted[0].dir); }
  }, [currentLevel]);

  useEffect(() => { generate(); }, []);

  const activeWord = placedWords.find(w => w.cells.some(cl => cl.r === selR && cl.c === selC) && w.dir === dir) ||
                     placedWords.find(w => w.cells.some(cl => cl.r === selR && cl.c === selC));

  const checkVictory = (current) => {
    const keys = Object.keys(gridData);
    if (keys.length > 0 && keys.every(k => gridData[k] === current[k])) {
      setShowWin(true);
    }
  };

  const onKey = (key) => {
    if (showWin || !activeWord) return;
    const coord = `${selR}-${selC}`;
    let next = { ...userLetters };
    if (key === "⌫") {
      next[coord] = "";
      const idx = activeWord.cells.findIndex(cl => cl.r === selR && cl.c === selC);
      if (idx > 0) { setSelR(activeWord.cells[idx-1].r); setSelC(activeWord.cells[idx-1].c); }
    } else {
      next[coord] = key;
      const idx = activeWord.cells.findIndex(cl => cl.r === selR && cl.c === selC);
      if (idx < activeWord.cells.length - 1) { setSelR(activeWord.cells[idx+1].r); setSelC(activeWord.cells[idx+1].c); }
    }
    setUserLetters(next);
    checkVictory(next);
  };

  const handleGlobalCheck = () => {
    if (!activeWord) return;
    const wrongs = [];
    const rights = [];
    
    activeWord.cells.forEach(cl => {
      const coord = `${cl.r}-${cl.c}`;
      if (userLetters[coord]) {
        if (userLetters[coord] === gridData[coord]) {
          rights.push(coord);
        } else {
          wrongs.push(coord);
        }
      }
    });

    setWrongCells(wrongs);
    setCorrectCells(rights);

    setTimeout(() => {
      setWrongCells([]);
      setCorrectCells([]);
    }, 1500);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#fbbf24" /></View>;

  return (
    <SafeAreaView style={styles.safe}>
      <Modal visible={showWin} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {Array.from({ length: 40 }).map((_, i) => <ConfettiParticle key={i} />)}
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>🎉</Text>
            <Text style={styles.cardTitle}>GRATULERER!</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => generate()}>
              <Text style={styles.primaryBtnT}>SPILL IGJEN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showLevelSelect} transparent animationType="slide">
        <View style={styles.modalOverlay}><View style={styles.card}>
          <Text style={styles.cardTitle}>VELG NIVÅ</Text>
          {LEVELS.map(l => (
            <TouchableOpacity key={l.id} style={styles.levelBtn} onPress={() => generate(l)}>
              <Text style={styles.levelBtnT}>{l.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowLevelSelect(false)}><Text style={styles.cancelT}>Avbryt</Text></TouchableOpacity>
        </View></View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowLevelSelect(true)} style={styles.levelChip}><Text style={styles.levelChipT}>{currentLevel.label}</Text></TouchableOpacity>
        <Text style={styles.title}>KRYSSORD</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => generate()}><Text style={styles.btnT}>NYTT</Text></TouchableOpacity>
      </View>

      <View style={styles.gridBox}>
        <View style={styles.grid}>
          {Array.from({ length: currentLevel.size }).map((_, r) => (
            <View key={r} style={styles.row}>
              {Array.from({ length: currentLevel.size }).map((_, c) => {
                const coord = `${r}-${c}`;
                const char = gridData[coord], isSel = selR === r && selC === c;
                const inT = activeWord?.cells.some(cl => cl.r === r && cl.c === c);
                const startW = placedWords.find(w => w.cells[0].r === r && w.cells[0].c === c);
                
                return (
                  <TouchableOpacity 
                    key={c} 
                    activeOpacity={1} 
                    onPress={() => { if(char) { if(isSel) setDir(dir==='h'?'v':'h'); else {setSelR(r); setSelC(c); }} }}
                    style={[
                      styles.cell, {width: cellSize, height: cellSize}, 
                      !char ? styles.black : styles.white, 
                      inT && styles.track, isSel && styles.active, 
                      wrongCells.includes(coord) && styles.errorCell,
                      correctCells.includes(coord) && styles.successCell
                    ]}>
                    {startW && <Text style={[styles.num, {fontSize: cellSize * 0.35}]}>{startW.num}</Text>}
                    <Text style={[styles.cellText, {fontSize: cellSize * 0.6}, isSel && {color:'#000'}]}>{userLetters[coord] || ""}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.clueArea}>
        {activeWord ? (
          <View>
            <Text style={styles.clueLabel}>{activeWord.num} {activeWord.dir==='h'?'VANNRETT':'LODDRETT'}</Text>
            <Text style={styles.clueText} numberOfLines={2}>{activeWord.c}</Text>
            <View style={styles.toolbar}>
              <TouchableOpacity style={styles.toolBtn} onPress={() => {
                const next = {...userLetters, [`${selR}-${selC}`]: gridData[`${selR}-${selC}`]};
                setUserLetters(next); checkVictory(next);
              }}><Text style={styles.toolBtnT}>BOKSTAV</Text></TouchableOpacity>
              <TouchableOpacity style={styles.toolBtn} onPress={() => {
                const next = {...userLetters};
                activeWord.cells.forEach(cl => next[`${cl.r}-${cl.c}`] = gridData[`${cl.r}-${cl.c}`]);
                setUserLetters(next); checkVictory(next);
              }}><Text style={styles.toolBtnT}>ORD</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.toolBtn, {borderColor: '#fbbf24'}]} onPress={handleGlobalCheck}>
                <Text style={[styles.toolBtnT, {color: '#fbbf24'}]}>SJEKK</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : <Text style={styles.clueText}>Velg en rute</Text>}
      </View>

      <View style={styles.kb}>
        {KB_ROWS.map((row, i) => (
          <View key={i} style={styles.kbRow}>{row.map(k => (
            <TouchableOpacity key={k} style={[styles.key, k==="⌫"&&{width:50}]} onPress={() => onKey(k)}><Text style={styles.keyText}>{k}</Text></TouchableOpacity>
          ))}</View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', backgroundColor: '#1e293b' },
  levelChip: { backgroundColor: '#fbbf24', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  levelChipT: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  title: { color: '#fbbf24', fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  newBtn: { backgroundColor: '#334155', padding: 8, borderRadius: 5 },
  btnT: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  gridBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { backgroundColor: '#000', padding: 1 },
  row: { flexDirection: 'row' },
  cell: { justifyContent: 'center', alignItems: 'center', margin: 0.5 },
  white: { backgroundColor: '#fff' }, black: { backgroundColor: '#000' },
  track: { backgroundColor: '#cbd5e1' }, active: { backgroundColor: '#fbbf24' },
  errorCell: { backgroundColor: '#fca5a5' }, // RED
  successCell: { backgroundColor: '#86efac' }, // GREEN
  cellText: { fontWeight: 'bold', color: '#1e293b' },
  num: { position: 'absolute', top: 0, left: 1, color: '#475569' },
  clueArea: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#1e293b', borderTopWidth: 4, borderColor: '#fbbf24', height: 130 },
  clueLabel: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },
  clueText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  toolBtn: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 4, borderWidth: 1, borderColor: '#475569' },
  toolBtnT: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  kb: { paddingBottom: 20, backgroundColor: '#1e293b' },
  kbRow: { flexDirection: 'row', justifyContent: 'center' },
  key: { backgroundColor: '#475569', width: (SCREEN_WIDTH-60)/11.5, height: 45, margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  keyText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.9)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#1e293b', padding: 30, borderRadius: 20, alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#fbbf24' },
  cardEmoji: { fontSize: 50, marginBottom: 10 },
  cardTitle: { color: '#fbbf24', fontSize: 22, fontWeight: '900', marginBottom: 20 },
  primaryBtn: { backgroundColor: '#fbbf24', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  primaryBtnT: { fontWeight: 'bold', color: '#000' },
  levelBtn: { backgroundColor: '#334155', width: '100%', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  levelBtnT: { color: '#fff', fontWeight: 'bold' },
  cancelT: { color: '#94a3b8', marginTop: 10 },
  confetti: { position: 'absolute', width: 10, height: 10, borderRadius: 2 },
});