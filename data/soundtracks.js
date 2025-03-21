const soundtracks = [
    {
        title: "2001: A Space Odyssey",
        composer: "Various Artists",
        year: "1968",
        genre: ["Orchestral", "Futuristic", "Ambient"],
        label: "MGM Records",
        image: "space.jpg",
        track: [
            {
                song: "Also Sprach Zarathustra",
                link: "https://www.youtube.com/watch?v=rcC6B-i28YE",
            },
        ],
    },
    {
        title: "For a Few Dollars More",
        composer: "Ennio Morricone",
        year: "1965",
        genre: ["Western", "Spaghetti Western", "Dramatic"],
        label: "RCA Victor",
        image: "dollarsmore.jpg",
        track: [
            {
                song: "For a Few Dollars More (Main Title)",
                link: "https://www.youtube.com/watch?v=zTDDLlEbLi4",
            },
        ],
    },
    {
        title: "Once Upon a Time in the West",
        composer: "Ennio Morricone",
        year: "1968",
        genre: ["Western", "Epic", "Orchestral"],
        label: "RCA Victor",
        image: "west.jpg",
        track: [
            {
                song: "Once Upon a Time in the West (Main Theme)",
                link: "https://www.youtube.com/watch?v=6MZw_Iv0wdU",
            },
        ],
    },
    {
        title: "The Good, the Bad and the Ugly",
        composer: "Ennio Morricone",
        year: "1966",
        genre: ["Western", "Spaghetti Western", "Iconic"],
        label: "RCA Victor",
        image: "goodbadugly.jpg",
        track: [
            {
                song: "The Good, the Bad and the Ugly (Main Title)",
                link: "https://www.youtube.com/watch?v=lPdMDxh5ylc",
            },
        ],
    },
    {
        title: "Star Wars: Episode IV - A New Hope",
        composer: "John Williams",
        year: "1977",
        genre: ["Orchestral", "Sci-Fi", "Adventure"],
        label: "20th Century Records",
        image: "newhope.jpg",
        track: [
            {
                song: "Main Title",
                link: "https://www.youtube.com/watch?v=ZxMdImpj4mk",
            },
        ],
    },
    {
        title: "The Godfather",
        composer: "Nino Rota",
        year: "1972",
        genre: ["Orchestral", "Dramatic", "Classic"],
        label: "Paramount Music",
        image: "godfather.jpg",
        track: [
            {
                song: "The Godfather (Main Theme)",
                link: "https://www.youtube.com/watch?v=MnSEZQEAPmE",
            },
        ],
    },
    {
        title: "Jurassic Park",
        composer: "John Williams",
        year: "1993",
        genre: ["Orchestral", "Adventure", "Action"],
        label: "MCA Records",
        image: "jurassic.jpg",
        track: [
            {
                song: "Theme from Jurassic Park",
                link: "https://www.youtube.com/watch?v=BXsWn9DhF5g",
            },
        ],
    },
    {
        title: "Blade Runner",
        composer: "Vangelis",
        year: "1982",
        genre: ["Electronic", "Futuristic", "Noir"],
        label: "Polydor Records",
        image: "bladerunner.jpg",
        track: [
            {
                song: "Main Title",
                link: "https://www.youtube.com/watch?v=Jrg5lG90kzw",
            },
        ],
    },
    {
        title: "The Dark Knight",
        composer: "Hans Zimmer",
        year: "2008",
        genre: ["Orchestral", "Dark", "Action"],
        label: "Warner Bros. Records",
        image: "darkknight.jpg",
        track: [
            {
                song: "Why So Serious?",
                link: "https://www.youtube.com/watch?v=d9bBulaGOzk",
            },
        ],
    },
    {
        title: "Inception",
        composer: "Hans Zimmer",
        year: "2010",
        genre: ["Orchestral", "Mind-Bending", "Thriller"],
        label: "Reprise Records",
        image: "inception.jpg",
        track: [
            {
                song: "Time",
                link: "https://www.youtube.com/watch?v=c56t7upa8Bk",
            },
        ],
    },
    {
        title: "Pulp Fiction",
        composer: "Various Artists",
        year: "1994",
        genre: ["Eclectic", "Retro"],
        label: "MCA Records",
        image: "pulpfiction.jpg",
        track: [
            {
                song: "Misirlou",
                link: "https://www.youtube.com/watch?v=ChCp6xuaFiA",
            },
        ],
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        composer: "Howard Shore",
        year: "2001",
        genre: ["Orchestral", "Fantasy", "Epic"],
        label: "Reprise Records",
        image: "lordoftherings.jpg",
        track: [
            {
                song: "The Fellowship Theme",
                link: "https://www.youtube.com/watch?v=-GS3QN_Yapc",
            },
        ],
    },
    {
        title: "Gladiator",
        composer: "Hans Zimmer",
        year: "2000",
        genre: ["Orchestral", "Epic", "Historical"],
        label: "Decca Records",
        image: "gladiator.jpg",
        track: [
            {
                song: "Now We Are Free",
                link: "https://www.youtube.com/watch?v=uJ96_LIXlko",
            },
        ],
    },
    {
        title: "Jackie Brown",
        composer: "Various Artists",
        year: "1997",
        genre: ["Soul", "Blaxploitation"],
        label: "Maverick Records",
        image: "jackie.jpg",
        track: [
            {
                song: "Across 110th Street",
                link: "https://www.youtube.com/watch?v=UbH3hSS1xCY",
            },
        ],
    },
    {
        title: "Superfly",
        composer: "Curtis Mayfield",
        year: "1972",
        genre: ["Funk", "Soul", "Blaxploitation"],
        label: "Curtom Records",
        image: "superfly.jpg",
        track: [
            {
                song: "Superfly",
                link: "https://www.youtube.com/watch?v=TD3mb6uVm80",
            },
        ],
    },
    {
        title: "Purple Rain",
        composer: "Prince and The Revolution",
        year: "1984",
        genre: ["Pop", "Rock", "R&B"],
        label: "Warner Bros. Records",
        image: "purplerain.jpg",
        track: [
            {
                song: "Purple Rain",
                link: "https://www.youtube.com/watch?v=347vCib_lMs",
            },
        ],
    },
    {
        title: "Reservoir Dogs",
        composer: "Various Artists",
        year: "1992",
        genre: ["Soundtrack", "Rock", "Retro"],
        label: "MCA Records",
        image: "dogs.jpg",
        track: [
            {
                song: "Little Green Bag",
                link: "https://www.youtube.com/watch?v=ln7Vn_WKkWU",
            },
        ],
    },
    {
        title: "Once Upon a Time in Hollywood",
        composer: "Various Artists",
        year: "2019",
        genre: ["Soundtrack", "Retro", "Rock"],
        label: "Sony Music",
        image: "timeinhollywood.jpg",
        track: [
            {
                song: "Treat Her Right",
                link: "https://www.youtube.com/watch?v=dEnGjhDFtKY",
            },
        ],
    },
    {
        title: "The Thing",
        composer: "Ennio Morricone",
        year: "1982",
        genre: ["Orchestral", "Horror", "Suspense"],
        label: "Varèse Sarabande",
        image: "thething.jpg",
        track: [
            {
                song: "Humanity Part 1",
                link: "https://www.youtube.com/watch?v=Mu8wT_pd4So",
            },
        ],
    },
];

module.exports = soundtracks;
