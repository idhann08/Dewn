async function getLyrics(song, duration) {

    try {

        const params = new URLSearchParams({
            track_name: song.title,
            artist_name: song.artist,
            album_name: song.album,
            duration: Math.round(duration)
        });

        const response = await fetch(
            `https://lrclib.net/api/get?${params}`
        );

        if (!response.ok) {

            console.log(
                "Lyrics tidak ditemukan:",
                song.title,
                response.status
            );

            return [];
        }

        const data = await response.json();

        if (!data.syncedLyrics) {

            console.log(
                "Tidak ada synced lyrics:",
                song.title
            );

            return [];
        }

        return parseLRC(data.syncedLyrics);

    } catch (error) {

        console.error(
            "Lyrics error:",
            error
        );

        return [];
    }
};

function parseLRC(lrc) {

    const lyrics = [];

    const lines = lrc.split(/\r?\n/);

    lines.forEach(line => {

        const match = line.match(
            /^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/
        );

        if (!match) return;

        const minutes = Number(match[1]);
        const seconds = Number(match[2]);
        const text = match[3].trim();

        if (!text) return;

        const time =
            minutes * 60 + seconds;

        lyrics.push({
            time: time,
            text: text
        });

    });

    return lyrics.sort(
        (a, b) => a.time - b.time
    );
}