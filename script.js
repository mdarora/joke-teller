const audioElement = document.getElementById("audio");
const jokeButton = document.getElementById("tell-joke-btn");
const lastJokeButton = document.getElementById("tell-last-joke-btn");
const categoryButton = document.getElementById("joke-category");
const jokeText = document.getElementById("jokeText");
const jokeContainer = document.getElementById("joke-container");
const baseApi = 'https://v2.jokeapi.dev/joke/';
let jokeCategory = 'Any';

// VoiceRSS Javascript SDK
const VoiceRSS = { speech: function (e) { this._validate(e), this._request(e) }, _validate: function (e) { if (!e) throw "The settings are undefined"; if (!e.key) throw "The API key is undefined"; if (!e.src) throw "The text is undefined"; if (!e.hl) throw "The language is undefined"; if (e.c && "auto" != e.c.toLowerCase()) { var a = !1; switch (e.c.toLowerCase()) { case "mp3": a = (new Audio).canPlayType("audio/mpeg").replace("no", ""); break; case "wav": a = (new Audio).canPlayType("audio/wav").replace("no", ""); break; case "aac": a = (new Audio).canPlayType("audio/aac").replace("no", ""); break; case "ogg": a = (new Audio).canPlayType("audio/ogg").replace("no", ""); break; case "caf": a = (new Audio).canPlayType("audio/x-caf").replace("no", "") }if (!a) throw "The browser does not support the audio codec " + e.c } }, _request: function (e) { var a = this._buildRequest(e), t = this._getXHR(); t.onreadystatechange = function () { if (4 == t.readyState && 200 == t.status) { if (0 == t.responseText.indexOf("ERROR")) throw t.responseText; audioElement.src = t.responseText, audioElement.play() } }, t.open("POST", "https://api.voicerss.org/", !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(a) }, _buildRequest: function (e) { var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec(); return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true" }, _detectCodec: function () { var e = new Audio; return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" : e.canPlayType("audio/wav").replace("no", "") ? "wav" : e.canPlayType("audio/aac").replace("no", "") ? "aac" : e.canPlayType("audio/ogg").replace("no", "") ? "ogg" : e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : "" }, _getXHR: function () { try { return new XMLHttpRequest } catch (e) { } try { return new ActiveXObject("Msxml3.XMLHTTP") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP") } catch (e) { } try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e) { } throw "The browser does not support HTTP request" } };


let lastJoke = "";

function listenLastJokeAgain() {
    jokeButton.disabled = true;
    lastJokeButton.disabled = true;
    jokeText.textContent = lastJoke;
    jokeContainer.style.display = "flex";
    tellJoke(lastJoke);
}

const getJoke = async () => {
    let apiUrl = baseApi + jokeCategory;

    let joke = '';
    try {
        jokeButton.textContent = "Loading...";
        const res = await fetch(apiUrl);
        const data = await res.json();
        joke = !data.setup ? data.joke : `${data.setup} ... ${data.delivery}`;
        lastJoke = joke;
        jokeButton.textContent = "Tell me a joke";
        return joke;

    } catch (error) {
        console.error(error);
    }
}

function tellJoke(joke) {
    VoiceRSS.speech({
        key: 'e985f868e96c46d9b0789c3855350152',
        src: joke,
        hl: 'en-us',
        v: 'Linda',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

jokeButton.addEventListener("click", () => {
    getJoke().then((joke) => {
        jokeText.textContent = joke;
        jokeContainer.style.display = "flex";
        tellJoke(joke);
    });
    jokeButton.disabled = true;
    lastJokeButton.disabled = true;
});

audioElement.addEventListener("ended", () => {
    jokeText.textContent = "";
    jokeContainer.style.display = "none";
    jokeButton.disabled = false;
    lastJokeButton.disabled = false;
});


lastJokeButton.addEventListener("click", listenLastJokeAgain);

categoryButton.addEventListener("change", () => {
    jokeCategory = categoryButton.value;
});