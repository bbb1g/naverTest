if ( !window.audiop ) window.audiop = {};
audiop.WebPlayerCoreInfo = {
    version: "0.1.1.0"
}
/**
 * Created by naver on 26/04/2017.
 */
if ( !window.audiop ) window.audiop = {};
audiop.MusicWebPlayerCoreConfig = {
    https: {
        audiopMusicWebPlayerCoreHtml5JsUrl: "https://static-audiop.pstatic.net/webplayercore/" + audiop.WebPlayerCoreInfo.version + "/js/audiop_musicwebplayer_core_html5.js",
        audiopMusicWebPlayerCoreHtml5ExtJsUrl: "https://static-audiop.pstatic.net/webplayercore/" + audiop.WebPlayerCoreInfo.version + "/js/audiop_musicwebplayer_core_html5_ext.js",

        audiopAPIInfoes: "https://apis.naver.com/audiopweb/audiopapiweb/audio/{audioId}/infoes?kbps={kbps}",
        audiopAPIPlay : "https://apis.naver.com/audiopweb/audiopapiweb/play/web/audio/{audioId}?kbps={kbps}&extra={extra}",

        playLogUrl : "https://audioapi.nmv.naver.com/pc", // �ъ깮濡쒓렇 url
        qualityLogUrl : "https://logapi.audiop.naver.com/quality.html", // �덉쭏濡쒓렇 url

        musicAPIStPlay: "http://apis.naver.com/nmwebplayer/music/mobilewebmusic_stplay_trackStPlay?play.trackId={play.trackId}&play.serviceType={play.serviceType}&deviceId={deviceId}&play.mediaSourceType={mediaSourceType}",
        musicAPIStLog: "https://apis.naver.com/nmwebplayer/music/mobilewebmusic_stplay_trackStLog?log.serviceType={log.serviceType}&log.time={log.time}&log.trackId={log.trackId}&log.recordTime={log.recordTime}&log.totalTime={log.totalTime}&log.token={log.token}&log.info={log.info}&deviceId={deviceId}",
        musicAPIDeviceInfo: "https://apis.naver.com/nmwebplayer/musicapiweb/device/{deviceType}/deviceId",
        musicAPIAudioId: "https://apis.naver.com/nmwebplayer/musicapiweb/audioplatform/track/{trackId}/audioId.json"
    }
};
/**
 * UAParser.js v0.7.14
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright 짤 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.14',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
            if (typeof str1 === "string") {
                return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
            } else {
                return false;
            }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            //var result = {},
            var i = 0, j, k, p, q, matches, match;//, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                    this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            //console.log(this);
            //return this;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
        ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
        ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
        ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
            // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
            // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w\.-]+)/i
            // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
        ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
        ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
        ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
        ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
        ], [[NAME, 'Puffin'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
            // UCBrowser
        ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
        ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
        ], [[NAME, 'WeChat'], VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
        ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
        ], [NAME, VERSION], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
        ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
        ], [VERSION, [NAME, 'Facebook']], [

            /(headlesschrome) ([\w\.]+)/i                                       // Chrome Headless
        ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
        ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
        ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
        ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
            // Chrome/OmniWeb/Arora/Tizen/Nokia
        ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
        ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
        ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
        ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
        ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
        ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
        ], [VERSION, NAME], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
        ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
        ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
        ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
        ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
        ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
        ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
        ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
        ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
        ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
        ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
        ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
        ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
        ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
        ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
        ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
        ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
        ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
        ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
        ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
            // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
        ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
            // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
        ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
        ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
        ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
        ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
        ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
        ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
        ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
            // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
        ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
        ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
        ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
        ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
        ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

            // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
        ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
        ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
        ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
        ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
        ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
        ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
        ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
        ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w+)*/i                                                       // Siemens
        ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
        ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
        ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
        ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
        ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
        ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
        ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
        ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
        ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
        ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
        ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)\s/i                                          // Google Pixel C
        ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel xl|pixel)\s/i                                   // Google Pixel
        ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                    // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
        ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [

            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu Tablet
        ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [

            /android.+a000(1)\s+build/i                                         // OnePlus
        ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
        ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Venue[\d\s]*)\s+build/i                          // Dell Venue Tablets
        ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
        ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
        ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
        ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(zte)?.+(k\d{2})\s+build/i                        // ZTE K Series Tablet
        ], [[VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
        ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
        ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
        ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2}x?.*)\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(.+)\s+build/i          // Dragon Touch Tablet
        ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?.+)\s+build/i                                // Insignia Tablets
        ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?.+)\s+build/i                         // NextBook Tablets
        ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
        ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-?)?(V1[12])\s+build/i                     // LvTel Phones
        ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
        ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(.*\b)\s+build/i             // Le Pan Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
        ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
        ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
        ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q.+)\s+build/i                           // Gigaset Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
        ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /(android.+)[;\/].+build/i                                          // Generic Android Device
        ], [MODEL, [VENDOR, 'Generic']]


            /*//////////////////////////
                // TODO: move to string map
                ////////////////////////////

                /(C6603)/i                                                          // Sony Xperia Z C6603
                ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
                /(C6903)/i                                                          // Sony Xperia Z 1
                ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

                /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
                ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
                /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
                ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
                /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
                ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
                /(SM-G313HZ)/i                                                      // Samsung Galaxy V
                ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
                /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
                ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
                /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
                ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
                /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
                ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

                /(T3C)/i                                                            // Advan Vandroid T3C
                ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
                /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
                ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
                /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
                ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

                /(V972M)/i                                                          // ZTE V972M
                ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

                /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
                ], [VENDOR, MODEL, [TYPE, MOBILE]], [
                /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
                ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
                /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
                ], [VENDOR, MODEL, [TYPE, MOBILE]], [
                /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
                ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

                /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
                ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

                /////////////
                // END TODO
                ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
        ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
        ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
        ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
        ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,                  // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
        ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
        ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
        ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
            // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
        ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
        ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
        ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
        ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
            // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
            // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
        ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
        ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
        ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
        ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                  // Haiku
        ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]+(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i                // iOS
        ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
        ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
            // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
        ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////

    var Browser = function (name, version) {
        this[NAME] = name;
        this[VERSION] = version;
    };
    var CPU = function (arch) {
        this[ARCHITECTURE] = arch;
    };
    var Device = function (vendor, model, type) {
        this[VENDOR] = vendor;
        this[MODEL] = model;
        this[TYPE] = type;
    };
    var Engine = Browser;
    var OS = Browser;

    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;
        var browser = new Browser();
        var cpu = new CPU();
        var device = new Device();
        var engine = new Engine();
        var os = new OS();

        this.getBrowser = function () {
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            browser = new Browser();
            cpu = new CPU();
            device = new Device();
            engine = new Engine();
            os = new OS();
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else if (window) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }


    /////////////////////////////////
    // AudioPlatform Custom        //
    /////////////////////////////////
    if ( !window.audiop ) window.audiop = {};
    window.audiop.UAParser = UAParser;


})(typeof window === 'object' ? window : this);
if ( !window.audiop ) window.audiop = {};
audiop.PartnerInfoUtils = {

    _parser: new audiop.UAParser(),

    getPartnerVer: function (partnerId) {
        if (!partnerId) {
            return "";
        }

        var os = audiop.PartnerInfoUtils._parser.getOS();
        return partnerId + "-WEB-v" + audiop.WebPlayerCoreInfo.version + "/" + os.name.toUpperCase() + "-v" + os.version;
    }
};
/**
 * Created by naver on 13/06/2017.
 */
if ( !window.audiop ) window.audiop = {};
audiop.ProtocolUtils = {
    /**
     * swf 蹂댁븞�댁뒋
     * - 李멸퀬 : https://oss.navercorp.com/AudioPlatform/audioplatform-documents/wiki/%EC%98%A4%EB%94%94%EC%98%A4%ED%94%8C%EB%9E%AB%ED%8F%BC%20APIGW%20%EC%A0%95%EC%B1%85
     * - https://(�뱁럹�댁�) -> http://...swf -> http://apigw  =>  �몄텧媛���
     * - https://(�뱁럹�댁�) -> https://...swf -> https://apigw  =>  �몄텧媛���
     *
     * xdomainrequest 蹂댁븞�댁뒋 (�쒕줈�ㅻⅨ scheme �쇰줈 �몄텧 遺덇�)
     * - http://(�뱁럹�댁�) -> http://apigw  =>  �몄텧媛���
     * - https://(�뱁럹�댁�) -> https://apigw  =>  �몄텧媛���
     * @param url
     * @returns {*}
     */
    adjustProtocol : function(url) {

        if (this.checkCurrentProtocol() == "https") {
            url = url.replace(/^http[s]?/, "http");
        } else {
            url = url.replace(/^http[s]?/, "http");
        }

        return url;
    },

    checkCurrentProtocol : function() {
        return !!location.href.match(/^https/) ? "https" : "http";
    }
}
/**
 * Created by naver on 19/07/2017.
 */
if ( !window.audiop ) window.audiop = {};
audiop.JsDynamicLoader = {

    /**
     * 濡쒕뵫�� �꾨즺�� js紐⑸줉
     * - key : js url
     * - value : true(濡쒕뱶 �꾨즺)
     */
    _loadedJs : {},

    /**
     * js dynamic loading
     * @param containerId
     * @param jsUrl
     * @param jsLoadedFunc
     * @param callbackFunc
     */
    loadJs : function (containerId, jsUrl, jsLoadedFunc, callbackFunc) {
        /**
         * �대� 濡쒕뵫�� js 以묐났濡쒕뱶 諛⑹�
         */
        if (jsLoadedFunc()) {
            callbackFunc();
            return ;
        }

        var loadedJs = audiop.JsDynamicLoader;

        var script = document.createElement("script");

        script.onreadystatechange = function () {

            if (this.readyState == 'loaded' || this.readyState == 'complete') {
                if (loadedJs[jsUrl]) {
                    return ;
                }
                loadedJs[jsUrl] = true;
                callbackFunc();
            }
        }
        script.onload = function () {

            if (loadedJs[jsUrl]) {
                return ;
            }
            loadedJs[jsUrl] = true;
            callbackFunc();
        }

        script.src = jsUrl;

        document.getElementById(containerId).appendChild(script);
    }
}


if ( !window.audiop ) window.audiop = {};
audiop.ObjectDeepCopy = {

    copy : function(obj) {
        var newObj = {};

        for (var key in obj) {
            newObj[key] = obj[key];
        }

        return newObj;
    }
}
if ( !window.audiop ) window.audiop = {};
audiop.DateFormatUtils = {

    format : function (date, formatString) {
        if (!date || !formatString) {
            return "";
        }


        var formattedDateString = formatString.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss)/gi, function(token) {
            switch (token) {
                case "yyyy": return date.getFullYear();
                case "MM": return audiop.DateFormatUtils._zerofeed(date.getMonth() + 1, 2);
                case "dd": return audiop.DateFormatUtils._zerofeed(date.getDate(), 2);
                case "HH": return audiop.DateFormatUtils._zerofeed(date.getHours(), 2);
                case "hh": return audiop.DateFormatUtils._zerofeed(((h = date.getHours() % 12) ? h : 12), 2);
                case "mm": return audiop.DateFormatUtils._zerofeed(date.getMinutes(), 2);
                case "ss": return audiop.DateFormatUtils._zerofeed(date.getSeconds(), 2);
                default: return token;
            }
        });

        return formattedDateString;
    },


    _zerofeed : function (value, zerofeedValueLength) {

        var valueStr = "" + value;
        var zerofeedCount = Math.max(zerofeedValueLength - valueStr.length, 0);

        for (var i=0, len=zerofeedCount; i<len; i++) {
            valueStr = "0" + valueStr;
        }

        return valueStr;
    }

}
/**
 * Created by naver on 19/07/2017.
 */
if ( !window.audiop ) window.audiop = {};
audiop.AudiopWebPlayerCoreSelector = {

    _parser : new audiop.UAParser(),

    /**
     * 釉뚮씪�곗� �섍꼍�� �곕씪 濡쒕뵫�� �ъ깮 (�쒕툕)紐⑤뱢 �좏삎 �좏깮
     * @private
     */
    choosePlayerCore : function () {

        var parser = audiop.AudiopWebPlayerCoreSelector._parser;
        var os = parser.getOS();
        var osName = os.name.toLowerCase();

        var browser = parser.getBrowser();
        var browserName = browser.name.toLowerCase();

        var mseSupport = audiop.AudiopWebPlayerCoreSelector._isMSESupported();


        if (osName.match(/iOS/gi)) {
            if (!mseSupport) {
                return "AUDIO_TAG_HLS";
            }
        }

        if (osName.match(/Android/gi)) {

            if (os.version.match(/^[0-4]\..*/)) {
                return "AUDIO_TAG_PROGRESSIVE";
            }

            if (!mseSupport) {
                return "AUDIO_TAG_HLS";
            }
        }

        if (browserName == "ie") {
            if (browser.version.match(/^(8).*/)) {
                return "FLASH_IE_LOW";
            }
            if (browser.version.match(/^(9).*/)) {
                return "FLASH_IE_LOW";
            }
            if (browser.version.match(/^(10).*/)) {
                return "FLASH_IE_HIGH";
            }
            if (browser.version.match(/^(11).*/)) {
                return "FLASH_IE_HIGH";
            }
        }

        if (browserName.match(/edge/gi)) {
            return "MSE";
        }

        if (browserName.match(/chrome/gi) || browserName.match(/chromium/gi)) {
            return "MSE";
        }

        if (browserName.match(/firefox/gi)) {
            return "MSE";
        }

        if (browserName.match(/safari/gi)) {
            if (osName.match(/iOS/gi)) {
                return "AUDIO_TAG_HLS";
            } else {
                return "MSE";
            }
        }

        var whaleBrowser = navigator.userAgent.match(/Whale/);
        if (!!whaleBrowser) {
            return "MSE";
        }

        if (mseSupport) {
            return "MSE";
        } else {
            return "AUDIO_TAG_HLS";
        }
    },

    _isMSESupported : function() {
        var mediaSource = window.MediaSource = window.MediaSource || window.WebKitMediaSource;
        var sourceBuffer = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
        var isTypeSupported = !!mediaSource && typeof mediaSource.isTypeSupported === 'function' && mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');

        var sourceBufferValidAPI = !sourceBuffer || (sourceBuffer.prototype && typeof sourceBuffer.prototype.appendBuffer === 'function' && typeof sourceBuffer.prototype.remove === 'function');
        return isTypeSupported && sourceBufferValidAPI;
    }
}
"undefined"==typeof window.Element&&(window.Element=function(){}),Object.getPrototypeOf||(Object.getPrototypeOf=function(e){if(e!==Object(e))throw TypeError("Object.getPrototypeOf called on non-object");return e.__proto__||e.constructor.prototype||Object.prototype}),"function"!=typeof Object.getOwnPropertyNames&&(Object.getOwnPropertyNames=function(e){if(e!==Object(e))throw TypeError("Object.getOwnPropertyNames called on non-object");var t,n=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push(t);return n}),"function"!=typeof Object.create&&(Object.create=function(e,t){function n(){}if("object"!=typeof e)throw TypeError();n.prototype=e;var r=new n;if(e&&(r.constructor=n),void 0!==t){if(t!==Object(t))throw TypeError();Object.defineProperties(r,t)}return r}),function(){if(!Object.defineProperty||!function(){try{return Object.defineProperty({},"x",{}),!0}catch(e){return!1}}()){var e=Object.defineProperty;Object.defineProperty=function(t,n,r){if(e)try{return e(t,n,r)}catch(i){}if(t!==Object(t))throw TypeError("Object.defineProperty called on non-object");return Object.prototype.__defineGetter__&&"get"in r&&Object.prototype.__defineGetter__.call(t,n,r.get),Object.prototype.__defineSetter__&&"set"in r&&Object.prototype.__defineSetter__.call(t,n,r.set),"value"in r&&(t[n]=r.value),t}}}(),"function"!=typeof Object.defineProperties&&(Object.defineProperties=function(e,t){if(e!==Object(e))throw TypeError("Object.defineProperties called on non-object");var n;for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&Object.defineProperty(e,n,t[n]);return e}),Object.keys||(Object.keys=function(e){if(e!==Object(e))throw TypeError("Object.keys called on non-object");var t,n=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push(t);return n}),Function.prototype.bind||(Function.prototype.bind=function(e){function t(){}if("function"!=typeof this)throw TypeError("Bind must be called on a function");var n=[].slice,r=n.call(arguments,1),i=this,o=function(){return i.apply(this instanceof t?this:e,r.concat(n.call(arguments)))};return t.prototype=i.prototype,o.prototype=new t,o}),Array.isArray=Array.isArray||function(e){return Boolean(e&&"[object Array]"===Object.prototype.toString.call(Object(e)))},Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if(0===n)return-1;var r=0;if(arguments.length>0&&(r=Number(arguments[1]),isNaN(r)?r=0:0!==r&&r!==1/0&&r!==-(1/0)&&(r=(r>0||-1)*Math.floor(Math.abs(r)))),r>=n)return-1;for(var i=r>=0?r:Math.max(n-Math.abs(r),0);i<n;i++)if(i in t&&t[i]===e)return i;return-1}),Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if(0===n)return-1;var r=n;arguments.length>1&&(r=Number(arguments[1]),r!==r?r=0:0!==r&&r!==1/0&&r!==-(1/0)&&(r=(r>0||-1)*Math.floor(Math.abs(r))));for(var i=r>=0?Math.min(r,n-1):n-Math.abs(r);i>=0;i--)if(i in t&&t[i]===e)return i;return-1}),Array.prototype.every||(Array.prototype.every=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();var r,i=arguments[1];for(r=0;r<n;r++)if(r in t&&!e.call(i,t[r],r,t))return!1;return!0}),Array.prototype.some||(Array.prototype.some=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();var r,i=arguments[1];for(r=0;r<n;r++)if(r in t&&e.call(i,t[r],r,t))return!0;return!1}),Array.prototype.forEach||(Array.prototype.forEach=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();var r,i=arguments[1];for(r=0;r<n;r++)r in t&&e.call(i,t[r],r,t)}),Array.prototype.map||(Array.prototype.map=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();var r=[];r.length=n;var i,o=arguments[1];for(i=0;i<n;i++)i in t&&(r[i]=e.call(o,t[i],i,t));return r}),Array.prototype.filter||(Array.prototype.filter=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();var r,i=[],o=arguments[1];for(r=0;r<n;r++)if(r in t){var a=t[r];e.call(o,a,r,t)&&i.push(a)}return i}),Array.prototype.reduce||(Array.prototype.reduce=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();if(0===n&&1===arguments.length)throw TypeError();var r,i=0;if(arguments.length>=2)r=arguments[1];else for(;;){if(i in t){r=t[i++];break}if(++i>=n)throw TypeError()}for(;i<n;)i in t&&(r=e.call(void 0,r,t[i],i,t)),i++;return r}),Array.prototype.reduceRight||(Array.prototype.reduceRight=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw TypeError();if(0===n&&1===arguments.length)throw TypeError();var r,i=n-1;if(arguments.length>=2)r=arguments[1];else for(;;){if(i in this){r=this[i--];break}if(--i<0)throw TypeError()}for(;i>=0;)i in t&&(r=e.call(void 0,r,t[i],i,t)),i--;return r}),String.prototype.trim||(String.prototype.trim=function(){return String(this).replace(/^\s+/,"").replace(/\s+$/,"")}),Date.now||(Date.now=function(){return Number(new Date)}),Date.prototype.toISOString||(Date.prototype.toISOString=function(){function e(e){return("00"+e).slice(-2)}function t(e){return("000"+e).slice(-3)}return this.getUTCFullYear()+"-"+e(this.getUTCMonth()+1)+"-"+e(this.getUTCDate())+"T"+e(this.getUTCHours())+":"+e(this.getUTCMinutes())+":"+e(this.getUTCSeconds())+"."+t(this.getUTCMilliseconds())+"Z"}),"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(e){return e<10?"0"+e:e}function this_value(){return this.valueOf()}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,o,a,s=gap,u=t[e];switch(u&&"object"==typeof u&&"function"==typeof u.toJSON&&(u=u.toJSON(e)),"function"==typeof rep&&(u=rep.call(t,e,u)),typeof u){case"string":return quote(u);case"number":return isFinite(u)?String(u):"null";case"boolean":case"null":return String(u);case"object":if(!u)return"null";if(gap+=indent,a=[],"[object Array]"===Object.prototype.toString.apply(u)){for(o=u.length,n=0;n<o;n+=1)a[n]=str(n,u)||"null";return i=0===a.length?"[]":gap?"[\n"+gap+a.join(",\n"+gap)+"\n"+s+"]":"["+a.join(",")+"]",gap=s,i}if(rep&&"object"==typeof rep)for(o=rep.length,n=0;n<o;n+=1)"string"==typeof rep[n]&&(r=rep[n],i=str(r,u),i&&a.push(quote(r)+(gap?": ":":")+i));else for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(i=str(r,u),i&&a.push(quote(r)+(gap?": ":":")+i));return i=0===a.length?"{}":gap?"{\n"+gap+a.join(",\n"+gap)+"\n"+s+"}":"{"+a.join(",")+"}",gap=s,i}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(e,t,n){var r;if(gap="",indent="","number"==typeof n)for(r=0;r<n;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=t,t&&"function"!=typeof t&&("object"!=typeof t||"number"!=typeof t.length))throw new Error("JSON.stringify");return str("",{"":e})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&"object"==typeof i)for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),void 0!==r?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),window.nts=window.nts||{},window.nts.ria=window.nts.ria||{},window.nts.ria.audio=window.nts.ria.audio||{},function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(1),a=r(o),s=n(10),u=r(s),l=function(){function e(t){i(this,e),this._loggerModule=t.toString().indexOf("HTMLAudioElement")>0?new a["default"](t):new u["default"](t)}return e.prototype.setInitLogInfo=function(e){this._loggerModule.setInitLogInfo(e)},e.prototype.setAudio=function(e){this._loggerModule.setAudio(e)},e.prototype.reset=function(){this._loggerModule.reset()},e.prototype.on=function(e){this._loggerModule.on(e)},e.prototype.off=function(e){this._loggerModule.off(e)},e}();t["default"]=l,window.nts.ria.audio.PlatformLogger=l,window.nts.ria.audio.PlatformLogger.version="1.0.11"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var s=n(2),u=r(s),l=n(8),c=r(l),f=n(4),p=r(f),d=function(e){function t(n){i(this,t);var r=o(this,e.call(this,n));return r.logSender=new c["default"],r.pcType=p["default"].pcType(),r}return a(t,e),t.prototype.addEvent=function(){var e=this;this.evt=function(t){return e.eventHandler(t)},this.audio.addEventListener("loadstart",this.evt),this.audio.addEventListener("canplay",this.evt),this.audio.addEventListener("play",this.evt),this.audio.addEventListener("playing",this.evt),this.audio.addEventListener("pause",this.evt),this.audio.addEventListener("seeked",this.evt),this.audio.addEventListener("seeking",this.evt),this.audio.addEventListener("waiting",this.evt),this.audio.addEventListener("timeupdate",this.evt),this.audio.addEventListener("ended",this.evt),this.audio.addEventListener("error",this.evt)},t.prototype.removeEvent=function(){this.audio.removeEventListener("loadstart",this.evt),this.audio.removeEventListener("canplay",this.evt),this.audio.removeEventListener("play",this.evt),this.audio.removeEventListener("playing",this.evt),this.audio.removeEventListener("pause",this.evt),this.audio.removeEventListener("seeked",this.evt),this.audio.removeEventListener("seeking",this.evt),this.audio.removeEventListener("waiting",this.evt),this.audio.removeEventListener("timeupdate",this.evt),this.audio.removeEventListener("ended",this.evt),this.audio.removeEventListener("error",this.evt)},t.prototype.setAudio=function(e){this.reset(),this.audio=e,this.addEvent()},t.prototype.onError=function(){/*this.ptLogInfo.ec=4;this.audio.error.code*/},t.prototype.sendLog=function(e,t,n,r,i){this.logSender.sendLog(e,t,n,r,i)},t}(u["default"]);t["default"]=d},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(3),a=r(o),s=n(5),u=r(s),l=n(6),c=r(l),f=n(7),p=r(f),d=function(){function e(t){i(this,e),this._initLogInfo=null,this._playingTimer=null,this._playingTimerInterval=100,this._waitingTimer=null,this._waitingTimerInterval=100,this._observers={},this.setAudio(t)}return e.prototype.reset=function(){this.audio&&(this.removeEvent(),this.audio=null)},e.prototype.on=function(e){this._observers[e]=e},e.prototype.off=function(e){delete this._observers[e]},e.prototype.dispatchEvent=function(e){for(var t in this._observers)this._observers[t](e)},e.prototype.setInitLogInfo=function(e){this._initLogInfo=e,this._initLogInfo.pt=this.pcType,this.ptLogInfo=new u["default"](this._initLogInfo),this.ptLogInfo.ql=new c["default"],this.ptLogInfo.ql.q=this._initLogInfo.q,this._playingTime=0,this._waitingTime=0,this._isFirstPlayed=!1,this._lock=!1,this._sendPtLog()},e.prototype.eventHandler=function(e){switch(e.type){case"loadstart":break;case"canplay":this._waitingTimerStop();break;case"play":this._lock=!0,0==this._isFirstPlayed&&(this.ptLogInfo.ct=p["default"].getTimeStamp(),this.ptLogInfo.ql.qit_start=+new Date);break;case"playing":this._waitingTimerStop(),0==this._isFirstPlayed&&(this._isFirstPlayed=!0,this._sendIpcLog(),this.ptLogInfo.ql.qit_end=+new Date,this._writeLocalStorage()),this._playingTimerStart(),this._lock=!1;break;case"pause":this._playingTimerStop();break;case"seeking":1==this._isFirstPlayed&&(this._lock=!0);break;case"seeked":1==this._isFirstPlayed&&(this.ptLogInfo.ql.addSeekPoint(this.audio.currentTime||parseInt(e.data)),this._writeLocalStorage(),this._lock=!1);break;case"waiting":this._playingTimerStop(),0==this._lock&&(this.ptLogInfo.ql.bc++,this._waitingTimerStart());break;case"timeupdate":break;case"ended":this._playingTimerStop(),this._sendPtLog(),this.setInitLogInfo(this._initLogInfo);break;case"error":this.onError(e)}},e.prototype._sendIpcLog=function(){var e=new a["default"](this._initLogInfo);this.sendLog(this._initLogInfo.ipcURL,JSON.stringify(e.toObject()),"ipc",this.dispatchEvent.bind(this),this._initLogInfo.header)},e.prototype._sendPtLog=function(){localStorage.getItem(this._getLogId())&&(this.sendLog(this._initLogInfo.ptURL,localStorage.getItem(this._getLogId()),"pt",this.dispatchEvent.bind(this),this._initLogInfo.header),localStorage.removeItem(this._getLogId()))},e.prototype._writeLocalStorage=function(){try{var e=JSON.stringify(this.ptLogInfo.toObject());localStorage.setItem(this._getLogId(),e)}catch(t){localStorage.clear()}},e.prototype._getLogId=function(){return"log."+this._initLogInfo.sid},e.prototype._playingTimerStart=function(){var e=this;this._playingTimerStop(),this._playingTimer=setInterval(function(){return e._onPlayingTimer()},this._playingTimerInterval)},e.prototype._playingTimerStop=function(){clearInterval(this._playingTimer)},e.prototype._waitingTimerStart=function(){var e=this;this._waitingTimerStop(),this._waitingTimer=setInterval(function(){return e._onWaitingTimer()},this._waitingTimerInterval)},e.prototype._waitingTimerStop=function(){clearInterval(this._waitingTimer)},e.prototype._onPlayingTimer=function(){this._playingTime+=this._playingTimerInterval,this.ptLogInfo.ql.wt=this._playingTime,this._writeLocalStorage()},e.prototype._onWaitingTimer=function(){this._waitingTime+=this._waitingTimerInterval,this.ptLogInfo.ql.bt=this._waitingTime,this._writeLocalStorage()},e}();t["default"]=d},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(4),a=r(o),s=function(){function e(t){i(this,e),this._initLogInfo=t}return e.prototype.toObject=function(){var e=a["default"].osInfo();return{sid:this._initLogInfo.sid.toString(),pt:this._initLogInfo.pt,pv:this._initLogInfo.pv,cc:this._initLogInfo.cc,aid:this._initLogInfo.aid,d:this._initLogInfo.d,os:e.os,osv:e.ver,q:this._initLogInfo.q}},e}();t["default"]=s},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var r=function(){function e(){n(this,e)}return e.pcType=function(){var e=navigator.userAgent;return e.indexOf("iPhone")!=-1||e.indexOf("iPad")!=-1||e.indexOf("iPod")!=-1||e.indexOf("Android")!=-1?"html5_mo":"html5_pc"},e.osInfo=function(){var e=new audiop.UAParser,t=e.getResult();return{os:t.os.name,ver:t.os.version}},e}();t["default"]=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(4),a=r(o),s=function(){function e(t){i(this,e),this._initLogInfo=t,this.ct="",this.ec=0,this.ql=null}return e.prototype.toObject=function(){var e=a["default"].osInfo();return{sid:this._initLogInfo.sid.toString(),pt:this._initLogInfo.pt,cc:this._initLogInfo.cc,aid:this._initLogInfo.aid,du:this._initLogInfo.du.toString(),os:e.os,osv:e.ver,it:this._initLogInfo.it.toString(),ql:[this._getQlObject()],ct:this.ct,lv:this._initLogInfo.lv,prtc:this._initLogInfo.prtc.toString(),ns:this._initLogInfo.ns.toString(),ec:this.ec.toString(),pv:this._initLogInfo.pv,cdn:this._initLogInfo.cdn}},e.prototype._getQlObject=function(){return this.ql?this.ql.toObject():null},e}();t["default"]=s},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var r=function(){function e(){n(this,e),this._sp=[],this.bt=0,this.wt=0,this.bc=0,this.q="",this.qit_start=0,this.qit_end=0}return e.prototype.addSeekPoint=function(e){this._sp.push(Math.round(e))},e.prototype.toObject=function(){return{q:this.q,qit:(this.qit_end-this.qit_start).toString(),bt:this.bt.toString(),bc:this.bc.toString(),wt:this.wt.toString(),sp:this._sp}},e}();t["default"]=r},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var r=function(){function e(){n(this,e)}return e.getTimeStamp=function(){var e=new Date,t=this.leadingZeros(e.getFullYear(),4)+"-"+this.leadingZeros(e.getMonth()+1,2)+"-"+this.leadingZeros(e.getDate(),2)+" "+this.leadingZeros(e.getHours(),2)+":"+this.leadingZeros(e.getMinutes(),2)+":"+this.leadingZeros(e.getSeconds(),2);return t},e.leadingZeros=function(e,t){var n="";if(e=e.toString(),e.length<t)for(var r=0;r<t-e.length;r++)n+="0";return n+e},e}();t["default"]=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(9),a=r(o),s=function(){function e(){i(this,e),a["default"].support.cors=!0}return e.prototype.sendLog=function(e,t,n,r,i){a["default"].ajax({headers:i,cache:!1,url:e,type:"POST",crossDomain:!0,data:{p:encodeURIComponent(t)},success:function(e){r&&r({type:n+"_success",data:t})},error:function(e){r&&r({type:n+"_error",data:e})},xhrFields:{withCredentials:!0}})},e}();t["default"]=s},function(e,t,n){var r,i;!function(t,n){"object"==typeof e&&"object"==typeof e.exports?e.exports=t.document?n(t,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return n(e)}:n(t)}("undefined"!=typeof window?window:this,function(n,o){function a(e){var t=!!e&&"length"in e&&e.length,n=ve.type(e);return"function"!==n&&!ve.isWindow(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}function s(e,t,n){if(ve.isFunction(t))return ve.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return ve.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(Le.test(t))return ve.filter(t,e,n);t=ve.filter(t,e)}return ve.grep(e,function(e){return ve.inArray(e,t)>-1!==n})}function u(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}function l(e){var t={};return ve.each(e.match(De)||[],function(e,n){t[n]=!0}),t}function c(){se.addEventListener?(se.removeEventListener("DOMContentLoaded",f),n.removeEventListener("load",f)):(se.detachEvent("onreadystatechange",f),n.detachEvent("onload",f))}function f(){(se.addEventListener||"load"===n.event.type||"complete"===se.readyState)&&(c(),ve.ready())}function p(e,t,n){if(void 0===n&&1===e.nodeType){var r="data-"+t.replace(Pe,"-$1").toLowerCase();if(n=e.getAttribute(r),"string"==typeof n){try{n="true"===n||"false"!==n&&("null"===n?null:+n+""===n?+n:Me.test(n)?ve.parseJSON(n):n)}catch(i){}ve.data(e,t,n)}else n=void 0}return n}function d(e){var t;for(t in e)if(("data"!==t||!ve.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}function h(e,t,n,r){if(He(e)){var i,o,a=ve.expando,s=e.nodeType,u=s?ve.cache:e,l=s?e[a]:e[a]&&a;if(l&&u[l]&&(r||u[l].data)||void 0!==n||"string"!=typeof t)return l||(l=s?e[a]=ae.pop()||ve.guid++:a),u[l]||(u[l]=s?{}:{toJSON:ve.noop}),"object"!=typeof t&&"function"!=typeof t||(r?u[l]=ve.extend(u[l],t):u[l].data=ve.extend(u[l].data,t)),o=u[l],r||(o.data||(o.data={}),o=o.data),void 0!==n&&(o[ve.camelCase(t)]=n),"string"==typeof t?(i=o[t],null==i&&(i=o[ve.camelCase(t)])):i=o,i}}function g(e,t,n){if(He(e)){var r,i,o=e.nodeType,a=o?ve.cache:e,s=o?e[ve.expando]:ve.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){ve.isArray(t)?t=t.concat(ve.map(t,ve.camelCase)):t in r?t=[t]:(t=ve.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;for(;i--;)delete r[t[i]];if(n?!d(r):!ve.isEmptyObject(r))return}(n||(delete a[s].data,d(a[s])))&&(o?ve.cleanData([e],!0):ge.deleteExpando||a!=a.window?delete a[s]:a[s]=void 0)}}}function y(e,t,n,r){var i,o=1,a=20,s=r?function(){return r.cur()}:function(){return ve.css(e,t,"")},u=s(),l=n&&n[3]||(ve.cssNumber[t]?"":"px"),c=(ve.cssNumber[t]||"px"!==l&&+u)&&Re.exec(ve.css(e,t));if(c&&c[3]!==l){l=l||c[3],n=n||[],c=+u||1;do o=o||".5",c/=o,ve.style(e,t,c+l);while(o!==(o=s()/u)&&1!==o&&--a)}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}function v(e){var t=Ve.split("|"),n=e.createDocumentFragment();if(n.createElement)for(;t.length;)n.createElement(t.pop());return n}function m(e,t){var n,r,i=0,o="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):void 0;if(!o)for(o=[],n=e.childNodes||e;null!=(r=n[i]);i++)!t||ve.nodeName(r,t)?o.push(r):ve.merge(o,m(r,t));return void 0===t||t&&ve.nodeName(e,t)?ve.merge([e],o):o}function b(e,t){for(var n,r=0;null!=(n=e[r]);r++)ve._data(n,"globalEval",!t||ve._data(t[r],"globalEval"))}function x(e){ze.test(e.type)&&(e.defaultChecked=e.checked)}function w(e,t,n,r,i){for(var o,a,s,u,l,c,f,p=e.length,d=v(t),h=[],g=0;g<p;g++)if(a=e[g],a||0===a)if("object"===ve.type(a))ve.merge(h,a.nodeType?[a]:a);else if(Ge.test(a)){for(u=u||d.appendChild(t.createElement("div")),l=(Ue.exec(a)||["",""])[1].toLowerCase(),f=Ye[l]||Ye._default,u.innerHTML=f[1]+ve.htmlPrefilter(a)+f[2],o=f[0];o--;)u=u.lastChild;if(!ge.leadingWhitespace&&Je.test(a)&&h.push(t.createTextNode(Je.exec(a)[0])),!ge.tbody)for(a="table"!==l||Qe.test(a)?"<table>"!==f[1]||Qe.test(a)?0:u:u.firstChild,o=a&&a.childNodes.length;o--;)ve.nodeName(c=a.childNodes[o],"tbody")&&!c.childNodes.length&&a.removeChild(c);for(ve.merge(h,u.childNodes),u.textContent="";u.firstChild;)u.removeChild(u.firstChild);u=d.lastChild}else h.push(t.createTextNode(a));for(u&&d.removeChild(u),ge.appendChecked||ve.grep(m(h,"input"),x),g=0;a=h[g++];)if(r&&ve.inArray(a,r)>-1)i&&i.push(a);else if(s=ve.contains(a.ownerDocument,a),u=m(d.appendChild(a),"script"),s&&b(u),n)for(o=0;a=u[o++];)Xe.test(a.type||"")&&n.push(a);return u=null,d}function T(){return!0}function _(){return!1}function E(){try{return se.activeElement}catch(e){}}function C(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)C(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),i===!1)i=_;else if(!i)return e;return 1===o&&(a=i,i=function(e){return ve().off(e),a.apply(this,arguments)},i.guid=a.guid||(a.guid=ve.guid++)),e.each(function(){ve.event.add(this,t,i,r,n)})}function S(e,t){return ve.nodeName(e,"table")&&ve.nodeName(11!==t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function L(e){return e.type=(null!==ve.find.attr(e,"type"))+"/"+e.type,e}function N(e){var t=ut.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function j(e,t){if(1===t.nodeType&&ve.hasData(e)){var n,r,i,o=ve._data(e),a=ve._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;r<i;r++)ve.event.add(t,n,s[n][r])}a.data&&(a.data=ve.extend({},a.data))}}function k(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!ge.noCloneEvent&&t[ve.expando]){i=ve._data(t);for(r in i.events)ve.removeEvent(t,r,i.handle);t.removeAttribute(ve.expando)}"script"===n&&t.text!==e.text?(L(t).text=e.text,N(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),ge.html5Clone&&e.innerHTML&&!ve.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&ze.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}}function A(e,t,n,r){t=le.apply([],t);var i,o,a,s,u,l,c=0,f=e.length,p=f-1,d=t[0],h=ve.isFunction(d);if(h||f>1&&"string"==typeof d&&!ge.checkClone&&st.test(d))return e.each(function(i){var o=e.eq(i);h&&(t[0]=d.call(this,i,o.html())),A(o,t,n,r)});if(f&&(l=w(t,e[0].ownerDocument,!1,e,r),i=l.firstChild,1===l.childNodes.length&&(l=i),i||r)){for(s=ve.map(m(l,"script"),L),a=s.length;c<f;c++)o=l,c!==p&&(o=ve.clone(o,!0,!0),a&&ve.merge(s,m(o,"script"))),n.call(e[c],o,c);if(a)for(u=s[s.length-1].ownerDocument,ve.map(s,N),c=0;c<a;c++)o=s[c],Xe.test(o.type||"")&&!ve._data(o,"globalEval")&&ve.contains(u,o)&&(o.src?ve._evalUrl&&ve._evalUrl(o.src):ve.globalEval((o.text||o.textContent||o.innerHTML||"").replace(lt,"")));l=i=null}return e}function O(e,t,n){for(var r,i=t?ve.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||ve.cleanData(m(r)),r.parentNode&&(n&&ve.contains(r.ownerDocument,r)&&b(m(r,"script")),r.parentNode.removeChild(r));return e}function D(e,t){var n=ve(t.createElement(e)).appendTo(t.body),r=ve.css(n[0],"display");return n.detach(),r}function I(e){var t=se,n=dt[e];return n||(n=D(e,t),"none"!==n&&n||(pt=(pt||ve("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),t=(pt[0].contentWindow||pt[0].contentDocument).document,t.write(),t.close(),n=D(e,t),pt.detach()),dt[e]=n),n}function q(e,t){return{get:function(){return e()?void delete this.get:(this.get=t).apply(this,arguments)}}}function H(e){if(e in Nt)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),n=Lt.length;n--;)if(e=Lt[n]+t,e in Nt)return e}function M(e,t){for(var n,r,i,o=[],a=0,s=e.length;a<s;a++)r=e[a],r.style&&(o[a]=ve._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&We(r)&&(o[a]=ve._data(r,"olddisplay",I(r.nodeName)))):(i=We(r),(n&&"none"!==n||!i)&&ve._data(r,"olddisplay",i?n:ve.css(r,"display"))));for(a=0;a<s;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}function P(e,t,n){var r=Et.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function F(e,t,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;o<4;o+=2)"margin"===n&&(a+=ve.css(e,n+Be[o],!0,i)),r?("content"===n&&(a-=ve.css(e,"padding"+Be[o],!0,i)),"margin"!==n&&(a-=ve.css(e,"border"+Be[o]+"Width",!0,i))):(a+=ve.css(e,"padding"+Be[o],!0,i),"padding"!==n&&(a+=ve.css(e,"border"+Be[o]+"Width",!0,i)));return a}function R(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=mt(e),a=ge.boxSizing&&"border-box"===ve.css(e,"boxSizing",!1,o);if(i<=0||null==i){if(i=bt(e,t,o),(i<0||null==i)&&(i=e.style[t]),gt.test(i))return i;r=a&&(ge.boxSizingReliable()||i===e.style[t]),i=parseFloat(i)||0}return i+F(e,t,n||(a?"border":"content"),r,o)+"px"}function B(e,t,n,r,i){return new B.prototype.init(e,t,n,r,i)}function W(){return n.setTimeout(function(){jt=void 0}),jt=ve.now()}function $(e,t){var n,r={height:e},i=0;for(t=t?1:0;i<4;i+=2-t)n=Be[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function z(e,t,n){for(var r,i=(J.tweeners[t]||[]).concat(J.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function U(e,t,n){var r,i,o,a,s,u,l,c,f=this,p={},d=e.style,h=e.nodeType&&We(e),g=ve._data(e,"fxshow");n.queue||(s=ve._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,u=s.empty.fire,s.empty.fire=function(){s.unqueued||u()}),s.unqueued++,f.always(function(){f.always(function(){s.unqueued--,ve.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[d.overflow,d.overflowX,d.overflowY],l=ve.css(e,"display"),c="none"===l?ve._data(e,"olddisplay")||I(e.nodeName):l,"inline"===c&&"none"===ve.css(e,"float")&&(ge.inlineBlockNeedsLayout&&"inline"!==I(e.nodeName)?d.zoom=1:d.display="inline-block")),n.overflow&&(d.overflow="hidden",ge.shrinkWrapBlocks()||f.always(function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],At.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(h?"hide":"show")){if("show"!==i||!g||void 0===g[r])continue;h=!0}p[r]=g&&g[r]||ve.style(e,r)}else l=void 0;if(ve.isEmptyObject(p))"inline"===("none"===l?I(e.nodeName):l)&&(d.display=l);else{g?"hidden"in g&&(h=g.hidden):g=ve._data(e,"fxshow",{}),o&&(g.hidden=!h),h?ve(e).show():f.done(function(){ve(e).hide()}),f.done(function(){var t;ve._removeData(e,"fxshow");for(t in p)ve.style(e,t,p[t])});for(r in p)a=z(h?g[r]:0,r,f),r in g||(g[r]=a.start,h&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function X(e,t){var n,r,i,o,a;for(n in e)if(r=ve.camelCase(n),i=t[r],o=e[n],ve.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=ve.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function J(e,t,n){var r,i,o=0,a=J.prefilters.length,s=ve.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=jt||W(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;a<u;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),o<1&&u?n:(s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:ve.extend({},t),opts:ve.extend(!0,{specialEasing:{},easing:ve.easing._default},n),originalProperties:t,originalOptions:n,startTime:jt||W(),duration:n.duration,tweens:[],createTween:function(t,n){var r=ve.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(X(c,l.opts.specialEasing);o<a;o++)if(r=J.prefilters[o].call(l,e,c,l.opts))return ve.isFunction(r.stop)&&(ve._queueHooks(l.elem,l.opts.queue).stop=ve.proxy(r.stop,r)),r;return ve.map(c,z,l),ve.isFunction(l.opts.start)&&l.opts.start.call(e,l),ve.fx.timer(ve.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function V(e){return ve.attr(e,"class")||""}function Y(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(De)||[];if(ve.isFunction(n))for(;r=o[i++];)"+"===r.charAt(0)?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function G(e,t,n,r){function i(s){var u;return o[s]=!0,ve.each(e[s]||[],function(e,s){
var l=s(t,n,r);return"string"!=typeof l||a||o[l]?a?!(u=l):void 0:(t.dataTypes.unshift(l),i(l),!1)}),u}var o={},a=e===nn;return i(t.dataTypes[0])||!o["*"]&&i("*")}function Q(e,t){var n,r,i=ve.ajaxSettings.flatOptions||{};for(r in t)void 0!==t[r]&&((i[r]?e:n||(n={}))[r]=t[r]);return n&&ve.extend(!0,e,n),e}function Z(e,t,n){for(var r,i,o,a,s=e.contents,u=e.dataTypes;"*"===u[0];)u.shift(),void 0===i&&(i=e.mimeType||t.getResponseHeader("Content-Type"));if(i)for(a in s)if(s[a]&&s[a].test(i)){u.unshift(a);break}if(u[0]in n)o=u[0];else{for(a in n){if(!u[0]||e.converters[a+" "+u[0]]){o=a;break}r||(r=a)}o=o||r}if(o)return o!==u[0]&&u.unshift(o),n[o]}function K(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(a=l[u+" "+o]||l["* "+o],!a)for(i in l)if(s=i.split(" "),s[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){a===!0?a=l[i]:l[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(f){return{state:"parsererror",error:a?f:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}function ee(e){return e.style&&e.style.display||ve.css(e,"display")}function te(e){if(!ve.contains(e.ownerDocument||se,e))return!0;for(;e&&1===e.nodeType;){if("none"===ee(e)||"hidden"===e.type)return!0;e=e.parentNode}return!1}function ne(e,t,n,r){var i;if(ve.isArray(t))ve.each(t,function(t,i){n||un.test(e)?r(e,i):ne(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==ve.type(t))r(e,t);else for(i in t)ne(e+"["+i+"]",t[i],n,r)}function re(){try{return new n.XMLHttpRequest}catch(e){}}function ie(){try{return new n.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}function oe(e){return ve.isWindow(e)?e:9===e.nodeType&&(e.defaultView||e.parentWindow)}var ae=[],se=n.document,ue=ae.slice,le=ae.concat,ce=ae.push,fe=ae.indexOf,pe={},de=pe.toString,he=pe.hasOwnProperty,ge={},ye="1.12.4",ve=function(e,t){return new ve.fn.init(e,t)},me=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,be=/^-ms-/,xe=/-([\da-z])/gi,we=function(e,t){return t.toUpperCase()};ve.fn=ve.prototype={jquery:ye,constructor:ve,selector:"",length:0,toArray:function(){return ue.call(this)},get:function(e){return null!=e?e<0?this[e+this.length]:this[e]:ue.call(this)},pushStack:function(e){var t=ve.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e){return ve.each(this,e)},map:function(e){return this.pushStack(ve.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(ue.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:ce,sort:ae.sort,splice:ae.splice},ve.extend=ve.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||ve.isFunction(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(i=arguments[s]))for(r in i)e=a[r],n=i[r],a!==n&&(l&&n&&(ve.isPlainObject(n)||(t=ve.isArray(n)))?(t?(t=!1,o=e&&ve.isArray(e)?e:[]):o=e&&ve.isPlainObject(e)?e:{},a[r]=ve.extend(l,o,n)):void 0!==n&&(a[r]=n));return a},ve.extend({expando:"jQuery"+(ye+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return"function"===ve.type(e)},isArray:Array.isArray||function(e){return"array"===ve.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){var t=e&&e.toString();return!ve.isArray(e)&&t-parseFloat(t)+1>=0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},isPlainObject:function(e){var t;if(!e||"object"!==ve.type(e)||e.nodeType||ve.isWindow(e))return!1;try{if(e.constructor&&!he.call(e,"constructor")&&!he.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}if(!ge.ownFirst)for(t in e)return he.call(e,t);for(t in e);return void 0===t||he.call(e,t)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?pe[de.call(e)]||"object":typeof e},globalEval:function(e){e&&ve.trim(e)&&(n.execScript||function(e){n.eval.call(n,e)})(e)},camelCase:function(e){return e.replace(be,"ms-").replace(xe,we)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t){var n,r=0;if(a(e))for(n=e.length;r<n&&t.call(e[r],r,e[r])!==!1;r++);else for(r in e)if(t.call(e[r],r,e[r])===!1)break;return e},trim:function(e){return null==e?"":(e+"").replace(me,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(a(Object(e))?ve.merge(n,"string"==typeof e?[e]:e):ce.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(fe)return fe.call(t,e,n);for(r=t.length,n=n?n<0?Math.max(0,r+n):n:0;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;)e[i++]=t[r++];if(n!==n)for(;void 0!==t[r];)e[i++]=t[r++];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)r=!t(e[o],o),r!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(a(e))for(r=e.length;o<r;o++)i=t(e[o],o,n),null!=i&&s.push(i);else for(o in e)i=t(e[o],o,n),null!=i&&s.push(i);return le.apply([],s)},guid:1,proxy:function(e,t){var n,r,i;if("string"==typeof t&&(i=e[t],t=e,e=i),ve.isFunction(e))return n=ue.call(arguments,2),r=function(){return e.apply(t||this,n.concat(ue.call(arguments)))},r.guid=e.guid=e.guid||ve.guid++,r},now:function(){return+new Date},support:ge}),"function"==typeof Symbol&&(ve.fn[Symbol.iterator]=ae[Symbol.iterator]),ve.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){pe["[object "+t+"]"]=t.toLowerCase()});var Te=function(e){function t(e,t,n,r){var i,o,a,s,u,l,f,d,h=t&&t.ownerDocument,g=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==g&&9!==g&&11!==g)return n;if(!r&&((t?t.ownerDocument||t:R)!==O&&A(t),t=t||O,I)){if(11!==g&&(l=ve.exec(e)))if(i=l[1]){if(9===g){if(!(a=t.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(h&&(a=h.getElementById(i))&&P(t,a)&&a.id===i)return n.push(a),n}else{if(l[2])return Z.apply(n,t.getElementsByTagName(e)),n;if((i=l[3])&&w.getElementsByClassName&&t.getElementsByClassName)return Z.apply(n,t.getElementsByClassName(i)),n}if(w.qsa&&!U[e+" "]&&(!q||!q.test(e))){if(1!==g)h=t,d=e;else if("object"!==t.nodeName.toLowerCase()){for((s=t.getAttribute("id"))?s=s.replace(be,"\\$&"):t.setAttribute("id",s=F),f=C(e),o=f.length,u=pe.test(s)?"#"+s:"[id='"+s+"']";o--;)f[o]=u+" "+p(f[o]);d=f.join(","),h=me.test(e)&&c(t.parentNode)||t}if(d)try{return Z.apply(n,h.querySelectorAll(d)),n}catch(y){}finally{s===F&&t.removeAttribute("id")}}}return L(e.replace(se,"$1"),t,n,r)}function n(){function e(n,r){return t.push(n+" ")>T.cacheLength&&delete e[t.shift()],e[n+" "]=r}var t=[];return e}function r(e){return e[F]=!0,e}function i(e){var t=O.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function o(e,t){for(var n=e.split("|"),r=n.length;r--;)T.attrHandle[n[r]]=t}function a(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||J)-(~e.sourceIndex||J);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function s(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function u(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function l(e){return r(function(t){return t=+t,r(function(n,r){for(var i,o=e([],n.length,t),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function c(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}function f(){}function p(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function d(e,t,n){var r=t.dir,i=n&&"parentNode"===r,o=W++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||i)return e(t,n,o)}:function(t,n,a){var s,u,l,c=[B,o];if(a){for(;t=t[r];)if((1===t.nodeType||i)&&e(t,n,a))return!0}else for(;t=t[r];)if(1===t.nodeType||i){if(l=t[F]||(t[F]={}),u=l[t.uniqueID]||(l[t.uniqueID]={}),(s=u[r])&&s[0]===B&&s[1]===o)return c[2]=s[2];if(u[r]=c,c[2]=e(t,n,a))return!0}}}function h(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function g(e,n,r){for(var i=0,o=n.length;i<o;i++)t(e,n[i],r);return r}function y(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function v(e,t,n,i,o,a){return i&&!i[F]&&(i=v(i)),o&&!o[F]&&(o=v(o,a)),r(function(r,a,s,u){var l,c,f,p=[],d=[],h=a.length,v=r||g(t||"*",s.nodeType?[s]:s,[]),m=!e||!r&&t?v:y(v,p,e,s,u),b=n?o||(r?e:h||i)?[]:a:m;if(n&&n(m,b,s,u),i)for(l=y(b,d),i(l,[],s,u),c=l.length;c--;)(f=l[c])&&(b[d[c]]=!(m[d[c]]=f));if(r){if(o||e){if(o){for(l=[],c=b.length;c--;)(f=b[c])&&l.push(m[c]=f);o(null,b=[],l,u)}for(c=b.length;c--;)(f=b[c])&&(l=o?ee(r,f):p[c])>-1&&(r[l]=!(a[l]=f))}}else b=y(b===a?b.splice(h,b.length):b),o?o(null,a,b,u):Z.apply(a,b)})}function m(e){for(var t,n,r,i=e.length,o=T.relative[e[0].type],a=o||T.relative[" "],s=o?1:0,u=d(function(e){return e===t},a,!0),l=d(function(e){return ee(t,e)>-1},a,!0),c=[function(e,n,r){var i=!o&&(r||n!==N)||((t=n).nodeType?u(e,n,r):l(e,n,r));return t=null,i}];s<i;s++)if(n=T.relative[e[s].type])c=[d(h(c),n)];else{if(n=T.filter[e[s].type].apply(null,e[s].matches),n[F]){for(r=++s;r<i&&!T.relative[e[r].type];r++);return v(s>1&&h(c),s>1&&p(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace(se,"$1"),n,s<r&&m(e.slice(s,r)),r<i&&m(e=e.slice(r)),r<i&&p(e))}c.push(n)}return h(c)}function b(e,n){var i=n.length>0,o=e.length>0,a=function(r,a,s,u,l){var c,f,p,d=0,h="0",g=r&&[],v=[],m=N,b=r||o&&T.find.TAG("*",l),x=B+=null==m?1:Math.random()||.1,w=b.length;for(l&&(N=a===O||a||l);h!==w&&null!=(c=b[h]);h++){if(o&&c){for(f=0,a||c.ownerDocument===O||(A(c),s=!I);p=e[f++];)if(p(c,a||O,s)){u.push(c);break}l&&(B=x)}i&&((c=!p&&c)&&d--,r&&g.push(c))}if(d+=h,i&&h!==d){for(f=0;p=n[f++];)p(g,v,a,s);if(r){if(d>0)for(;h--;)g[h]||v[h]||(v[h]=G.call(u));v=y(v)}Z.apply(u,v),l&&!r&&v.length>0&&d+n.length>1&&t.uniqueSort(u)}return l&&(B=x,N=m),g};return i?r(a):a}var x,w,T,_,E,C,S,L,N,j,k,A,O,D,I,q,H,M,P,F="sizzle"+1*new Date,R=e.document,B=0,W=0,$=n(),z=n(),U=n(),X=function(e,t){return e===t&&(k=!0),0},J=1<<31,V={}.hasOwnProperty,Y=[],G=Y.pop,Q=Y.push,Z=Y.push,K=Y.slice,ee=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},te="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",ne="[\\x20\\t\\r\\n\\f]",re="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ie="\\["+ne+"*("+re+")(?:"+ne+"*([*^$|!~]?=)"+ne+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+re+"))|)"+ne+"*\\]",oe=":("+re+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+ie+")*)|.*)\\)|)",ae=new RegExp(ne+"+","g"),se=new RegExp("^"+ne+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ne+"+$","g"),ue=new RegExp("^"+ne+"*,"+ne+"*"),le=new RegExp("^"+ne+"*([>+~]|"+ne+")"+ne+"*"),ce=new RegExp("="+ne+"*([^\\]'\"]*?)"+ne+"*\\]","g"),fe=new RegExp(oe),pe=new RegExp("^"+re+"$"),de={ID:new RegExp("^#("+re+")"),CLASS:new RegExp("^\\.("+re+")"),TAG:new RegExp("^("+re+"|[*])"),ATTR:new RegExp("^"+ie),PSEUDO:new RegExp("^"+oe),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ne+"*(even|odd|(([+-]|)(\\d*)n|)"+ne+"*(?:([+-]|)"+ne+"*(\\d+)|))"+ne+"*\\)|)","i"),bool:new RegExp("^(?:"+te+")$","i"),needsContext:new RegExp("^"+ne+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ne+"*((?:-\\d)?\\d*)"+ne+"*\\)|)(?=[^-]|$)","i")},he=/^(?:input|select|textarea|button)$/i,ge=/^h\d$/i,ye=/^[^{]+\{\s*\[native \w/,ve=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,me=/[+~]/,be=/'|\\/g,xe=new RegExp("\\\\([\\da-f]{1,6}"+ne+"?|("+ne+")|.)","ig"),we=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},Te=function(){A()};try{Z.apply(Y=K.call(R.childNodes),R.childNodes),Y[R.childNodes.length].nodeType}catch(_e){Z={apply:Y.length?function(e,t){Q.apply(e,K.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}w=t.support={},E=t.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},A=t.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:R;return r!==O&&9===r.nodeType&&r.documentElement?(O=r,D=O.documentElement,I=!E(O),(n=O.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",Te,!1):n.attachEvent&&n.attachEvent("onunload",Te)),w.attributes=i(function(e){return e.className="i",!e.getAttribute("className")}),w.getElementsByTagName=i(function(e){return e.appendChild(O.createComment("")),!e.getElementsByTagName("*").length}),w.getElementsByClassName=ye.test(O.getElementsByClassName),w.getById=i(function(e){return D.appendChild(e).id=F,!O.getElementsByName||!O.getElementsByName(F).length}),w.getById?(T.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&I){var n=t.getElementById(e);return n?[n]:[]}},T.filter.ID=function(e){var t=e.replace(xe,we);return function(e){return e.getAttribute("id")===t}}):(delete T.find.ID,T.filter.ID=function(e){var t=e.replace(xe,we);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}}),T.find.TAG=w.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):w.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},T.find.CLASS=w.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&I)return t.getElementsByClassName(e)},H=[],q=[],(w.qsa=ye.test(O.querySelectorAll))&&(i(function(e){D.appendChild(e).innerHTML="<a id='"+F+"'></a><select id='"+F+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+ne+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||q.push("\\["+ne+"*(?:value|"+te+")"),e.querySelectorAll("[id~="+F+"-]").length||q.push("~="),e.querySelectorAll(":checked").length||q.push(":checked"),e.querySelectorAll("a#"+F+"+*").length||q.push(".#.+[+~]")}),i(function(e){var t=O.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&q.push("name"+ne+"*[*^$|!~]?="),e.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),q.push(",.*:")})),(w.matchesSelector=ye.test(M=D.matches||D.webkitMatchesSelector||D.mozMatchesSelector||D.oMatchesSelector||D.msMatchesSelector))&&i(function(e){w.disconnectedMatch=M.call(e,"div"),M.call(e,"[s!='']:x"),H.push("!=",oe)}),q=q.length&&new RegExp(q.join("|")),H=H.length&&new RegExp(H.join("|")),t=ye.test(D.compareDocumentPosition),P=t||ye.test(D.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},X=t?function(e,t){if(e===t)return k=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n?n:(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1,1&n||!w.sortDetached&&t.compareDocumentPosition(e)===n?e===O||e.ownerDocument===R&&P(R,e)?-1:t===O||t.ownerDocument===R&&P(R,t)?1:j?ee(j,e)-ee(j,t):0:4&n?-1:1)}:function(e,t){if(e===t)return k=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,s=[e],u=[t];if(!i||!o)return e===O?-1:t===O?1:i?-1:o?1:j?ee(j,e)-ee(j,t):0;if(i===o)return a(e,t);for(n=e;n=n.parentNode;)s.unshift(n);for(n=t;n=n.parentNode;)u.unshift(n);for(;s[r]===u[r];)r++;return r?a(s[r],u[r]):s[r]===R?-1:u[r]===R?1:0},O):O},t.matches=function(e,n){return t(e,null,null,n)},t.matchesSelector=function(e,n){if((e.ownerDocument||e)!==O&&A(e),n=n.replace(ce,"='$1']"),w.matchesSelector&&I&&!U[n+" "]&&(!H||!H.test(n))&&(!q||!q.test(n)))try{var r=M.call(e,n);if(r||w.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return t(n,O,null,[e]).length>0},t.contains=function(e,t){return(e.ownerDocument||e)!==O&&A(e),P(e,t)},t.attr=function(e,t){(e.ownerDocument||e)!==O&&A(e);var n=T.attrHandle[t.toLowerCase()],r=n&&V.call(T.attrHandle,t.toLowerCase())?n(e,t,!I):void 0;return void 0!==r?r:w.attributes||!I?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},t.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},t.uniqueSort=function(e){var t,n=[],r=0,i=0;if(k=!w.detectDuplicates,j=!w.sortStable&&e.slice(0),e.sort(X),k){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1)}return j=null,e},_=t.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=_(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=_(t);return n},T=t.selectors={cacheLength:50,createPseudo:r,match:de,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(xe,we),e[3]=(e[3]||e[4]||e[5]||"").replace(xe,we),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&t.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return de.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&fe.test(n)&&(t=C(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(xe,we).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=$[e+" "];return t||(t=new RegExp("(^|"+ne+")"+e+"("+ne+"|$)"))&&$(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,n,r){return function(i){var o=t.attr(i,e);return null==o?"!="===n:!n||(o+="","="===n?o===r:"!="===n?o!==r:"^="===n?r&&0===o.indexOf(r):"*="===n?r&&o.indexOf(r)>-1:"$="===n?r&&o.slice(-r.length)===r:"~="===n?(" "+o.replace(ae," ")+" ").indexOf(r)>-1:"|="===n&&(o===r||o.slice(0,r.length+1)===r+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,b=!1;if(y){if(o){for(;g;){for(p=t;p=p[g];)if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){for(p=y,f=p[F]||(p[F]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===B&&l[1],b=d&&l[2],p=d&&y.childNodes[d];p=++d&&p&&p[g]||(b=d=0)||h.pop();)if(1===p.nodeType&&++b&&p===t){c[e]=[B,d,b];break}}else if(m&&(p=t,f=p[F]||(p[F]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===B&&l[1],b=d),b===!1)for(;(p=++d&&p&&p[g]||(b=d=0)||h.pop())&&((s?p.nodeName.toLowerCase()!==v:1!==p.nodeType)||!++b||(m&&(f=p[F]||(p[F]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),c[e]=[B,b]),p!==t)););return b-=i,b===r||b%r===0&&b/r>=0}}},PSEUDO:function(e,n){var i,o=T.pseudos[e]||T.setFilters[e.toLowerCase()]||t.error("unsupported pseudo: "+e);return o[F]?o(n):o.length>1?(i=[e,e,"",n],T.setFilters.hasOwnProperty(e.toLowerCase())?r(function(e,t){for(var r,i=o(e,n),a=i.length;a--;)r=ee(e,i[a]),e[r]=!(t[r]=i[a])}):function(e){return o(e,0,i)}):o}},pseudos:{not:r(function(e){var t=[],n=[],i=S(e.replace(se,"$1"));return i[F]?r(function(e,t,n,r){for(var o,a=i(e,null,r,[]),s=e.length;s--;)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop()}}),has:r(function(e){return function(n){return t(e,n).length>0}}),contains:r(function(e){return e=e.replace(xe,we),function(t){return(t.textContent||t.innerText||_(t)).indexOf(e)>-1}}),lang:r(function(e){return pe.test(e||"")||t.error("unsupported lang: "+e),e=e.replace(xe,we).toLowerCase(),function(t){var n;do if(n=I?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===D},focus:function(e){return e===O.activeElement&&(!O.hasFocus||O.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!T.pseudos.empty(e)},header:function(e){return ge.test(e.nodeName)},input:function(e){return he.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:l(function(){return[0]}),last:l(function(e,t){return[t-1]}),eq:l(function(e,t,n){return[n<0?n+t:n]}),even:l(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:l(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:l(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:l(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},T.pseudos.nth=T.pseudos.eq;for(x in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})T.pseudos[x]=s(x);for(x in{submit:!0,reset:!0})T.pseudos[x]=u(x);return f.prototype=T.filters=T.pseudos,T.setFilters=new f,C=t.tokenize=function(e,n){var r,i,o,a,s,u,l,c=z[e+" "];if(c)return n?0:c.slice(0);for(s=e,u=[],l=T.preFilter;s;){r&&!(i=ue.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),r=!1,(i=le.exec(s))&&(r=i.shift(),o.push({value:r,type:i[0].replace(se," ")}),s=s.slice(r.length));for(a in T.filter)!(i=de[a].exec(s))||l[a]&&!(i=l[a](i))||(r=i.shift(),o.push({value:r,type:a,matches:i}),s=s.slice(r.length));if(!r)break}return n?s.length:s?t.error(e):z(e,u).slice(0)},S=t.compile=function(e,t){var n,r=[],i=[],o=U[e+" "];if(!o){for(t||(t=C(e)),n=t.length;n--;)o=m(t[n]),o[F]?r.push(o):i.push(o);o=U(e,b(i,r)),o.selector=e}return o},L=t.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,f=!r&&C(e=l.selector||e);if(n=n||[],1===f.length){if(o=f[0]=f[0].slice(0),o.length>2&&"ID"===(a=o[0]).type&&w.getById&&9===t.nodeType&&I&&T.relative[o[1].type]){if(t=(T.find.ID(a.matches[0].replace(xe,we),t)||[])[0],!t)return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}for(i=de.needsContext.test(e)?0:o.length;i--&&(a=o[i],!T.relative[s=a.type]);)if((u=T.find[s])&&(r=u(a.matches[0].replace(xe,we),me.test(o[0].type)&&c(t.parentNode)||t))){if(o.splice(i,1),e=r.length&&p(o),!e)return Z.apply(n,r),n;break}}return(l||S(e,f))(r,t,!I,n,!t||me.test(e)&&c(t.parentNode)||t),n},w.sortStable=F.split("").sort(X).join("")===F,w.detectDuplicates=!!k,A(),w.sortDetached=i(function(e){return 1&e.compareDocumentPosition(O.createElement("div"))}),i(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||o("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),w.attributes&&i(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||o("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),i(function(e){return null==e.getAttribute("disabled")})||o(te,function(e,t,n){var r;if(!n)return e[t]===!0?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),t}(n);ve.find=Te,ve.expr=Te.selectors,ve.expr[":"]=ve.expr.pseudos,ve.uniqueSort=ve.unique=Te.uniqueSort,ve.text=Te.getText,ve.isXMLDoc=Te.isXML,ve.contains=Te.contains;var _e=function(e,t,n){for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(i&&ve(e).is(n))break;r.push(e)}return r},Ee=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},Ce=ve.expr.match.needsContext,Se=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,Le=/^.[^:#\[\.,]*$/;ve.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?ve.find.matchesSelector(r,e)?[r]:[]:ve.find.matches(e,ve.grep(t,function(e){return 1===e.nodeType}))},ve.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(ve(e).filter(function(){for(t=0;t<i;t++)if(ve.contains(r[t],this))return!0}));for(t=0;t<i;t++)ve.find(e,r[t],n);return n=this.pushStack(i>1?ve.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},filter:function(e){return this.pushStack(s(this,e||[],!1))},not:function(e){return this.pushStack(s(this,e||[],!0))},is:function(e){return!!s(this,"string"==typeof e&&Ce.test(e)?ve(e):e||[],!1).length}});var Ne,je=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,ke=ve.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||Ne,"string"==typeof e){if(r="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:je.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof ve?t[0]:t,ve.merge(this,ve.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:se,!0)),Se.test(r[1])&&ve.isPlainObject(t))for(r in t)ve.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}if(i=se.getElementById(r[2]),i&&i.parentNode){if(i.id!==r[2])return Ne.find(e);this.length=1,this[0]=i}return this.context=se,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):ve.isFunction(e)?"undefined"!=typeof n.ready?n.ready(e):e(ve):(void 0!==e.selector&&(this.selector=e.selector,this.context=e.context),ve.makeArray(e,this))};ke.prototype=ve.fn,Ne=ve(se);var Ae=/^(?:parents|prev(?:Until|All))/,Oe={children:!0,contents:!0,next:!0,prev:!0};ve.fn.extend({has:function(e){var t,n=ve(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(ve.contains(this,n[t]))return!0})},closest:function(e,t){for(var n,r=0,i=this.length,o=[],a=Ce.test(e)||"string"!=typeof e?ve(e,t||this.context):0;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&ve.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?ve.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?ve.inArray(this[0],ve(e)):ve.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(ve.uniqueSort(ve.merge(this.get(),ve(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),ve.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return _e(e,"parentNode")},parentsUntil:function(e,t,n){return _e(e,"parentNode",n)},next:function(e){return u(e,"nextSibling")},prev:function(e){return u(e,"previousSibling")},nextAll:function(e){return _e(e,"nextSibling")},prevAll:function(e){return _e(e,"previousSibling")},nextUntil:function(e,t,n){return _e(e,"nextSibling",n)},prevUntil:function(e,t,n){return _e(e,"previousSibling",n)},siblings:function(e){return Ee((e.parentNode||{}).firstChild,e)},children:function(e){return Ee(e.firstChild)},contents:function(e){return ve.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:ve.merge([],e.childNodes)}},function(e,t){ve.fn[e]=function(n,r){var i=ve.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=ve.filter(r,i)),this.length>1&&(Oe[e]||(i=ve.uniqueSort(i)),Ae.test(e)&&(i=i.reverse())),this.pushStack(i)}});var De=/\S+/g;ve.Callbacks=function(e){e="string"==typeof e?l(e):ve.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=e.once,r=t=!0;a.length;s=-1)for(n=a.shift();++s<o.length;)o[s].apply(n[0],n[1])===!1&&e.stopOnFalse&&(s=o.length,n=!1);e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},c={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function r(t){ve.each(t,function(t,n){ve.isFunction(n)?e.unique&&c.has(n)||o.push(n):n&&n.length&&"string"!==ve.type(n)&&r(n)})}(arguments),n&&!t&&u()),this},remove:function(){return ve.each(arguments,function(e,t){for(var n;(n=ve.inArray(t,o,n))>-1;)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?ve.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=!0,n||c.disable(),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=n||[],n=[e,n.slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},ve.extend({Deferred:function(e){var t=[["resolve","done",ve.Callbacks("once memory"),"resolved"],["reject","fail",ve.Callbacks("once memory"),"rejected"],["notify","progress",ve.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return ve.Deferred(function(n){ve.each(t,function(t,o){var a=ve.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&ve.isFunction(e.promise)?e.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[o[0]+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?ve.extend(e,r):r}},i={};return r.pipe=r.then,ve.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t,n,r,i=0,o=ue.call(arguments),a=o.length,s=1!==a||e&&ve.isFunction(e.promise)?a:0,u=1===s?e:ve.Deferred(),l=function(e,n,r){return function(i){n[e]=this,r[e]=arguments.length>1?ue.call(arguments):i,r===t?u.notifyWith(n,r):--s||u.resolveWith(n,r)}};if(a>1)for(t=new Array(a),n=new Array(a),r=new Array(a);i<a;i++)o[i]&&ve.isFunction(o[i].promise)?o[i].promise().progress(l(i,n,t)).done(l(i,r,o)).fail(u.reject):--s;return s||u.resolveWith(r,o),u.promise()}});var Ie;ve.fn.ready=function(e){return ve.ready.promise().done(e),this},ve.extend({isReady:!1,readyWait:1,holdReady:function(e){e?ve.readyWait++:ve.ready(!0)},ready:function(e){(e===!0?--ve.readyWait:ve.isReady)||(ve.isReady=!0,e!==!0&&--ve.readyWait>0||(Ie.resolveWith(se,[ve]),ve.fn.triggerHandler&&(ve(se).triggerHandler("ready"),ve(se).off("ready"))))}}),ve.ready.promise=function(e){if(!Ie)if(Ie=ve.Deferred(),"complete"===se.readyState||"loading"!==se.readyState&&!se.documentElement.doScroll)n.setTimeout(ve.ready);else if(se.addEventListener)se.addEventListener("DOMContentLoaded",f),n.addEventListener("load",f);else{se.attachEvent("onreadystatechange",f),n.attachEvent("onload",f);var t=!1;try{t=null==n.frameElement&&se.documentElement}catch(r){}t&&t.doScroll&&!function i(){if(!ve.isReady){try{t.doScroll("left")}catch(e){return n.setTimeout(i,50)}c(),ve.ready()}}()}return Ie.promise(e)},ve.ready.promise();var qe;for(qe in ve(ge))break;ge.ownFirst="0"===qe,ge.inlineBlockNeedsLayout=!1,ve(function(){var e,t,n,r;n=se.getElementsByTagName("body")[0],
n&&n.style&&(t=se.createElement("div"),r=se.createElement("div"),r.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",n.appendChild(r).appendChild(t),"undefined"!=typeof t.style.zoom&&(t.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",ge.inlineBlockNeedsLayout=e=3===t.offsetWidth,e&&(n.style.zoom=1)),n.removeChild(r))}),function(){var e=se.createElement("div");ge.deleteExpando=!0;try{delete e.test}catch(t){ge.deleteExpando=!1}e=null}();var He=function(e){var t=ve.noData[(e.nodeName+" ").toLowerCase()],n=+e.nodeType||1;return(1===n||9===n)&&(!t||t!==!0&&e.getAttribute("classid")===t)},Me=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Pe=/([A-Z])/g;ve.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?ve.cache[e[ve.expando]]:e[ve.expando],!!e&&!d(e)},data:function(e,t,n){return h(e,t,n)},removeData:function(e,t){return g(e,t)},_data:function(e,t,n){return h(e,t,n,!0)},_removeData:function(e,t){return g(e,t,!0)}}),ve.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=ve.data(o),1===o.nodeType&&!ve._data(o,"parsedAttrs"))){for(n=a.length;n--;)a[n]&&(r=a[n].name,0===r.indexOf("data-")&&(r=ve.camelCase(r.slice(5)),p(o,r,i[r])));ve._data(o,"parsedAttrs",!0)}return i}return"object"==typeof e?this.each(function(){ve.data(this,e)}):arguments.length>1?this.each(function(){ve.data(this,e,t)}):o?p(o,e,ve.data(o,e)):void 0},removeData:function(e){return this.each(function(){ve.removeData(this,e)})}}),ve.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=ve._data(e,t),n&&(!r||ve.isArray(n)?r=ve._data(e,t,ve.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=ve.queue(e,t),r=n.length,i=n.shift(),o=ve._queueHooks(e,t),a=function(){ve.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return ve._data(e,n)||ve._data(e,n,{empty:ve.Callbacks("once memory").add(function(){ve._removeData(e,t+"queue"),ve._removeData(e,n)})})}}),ve.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?ve.queue(this[0],e):void 0===t?this:this.each(function(){var n=ve.queue(this,e,t);ve._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&ve.dequeue(this,e)})},dequeue:function(e){return this.each(function(){ve.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=ve.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)n=ve._data(o[a],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}}),function(){var e;ge.shrinkWrapBlocks=function(){if(null!=e)return e;e=!1;var t,n,r;return n=se.getElementsByTagName("body")[0],n&&n.style?(t=se.createElement("div"),r=se.createElement("div"),r.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",n.appendChild(r).appendChild(t),"undefined"!=typeof t.style.zoom&&(t.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",t.appendChild(se.createElement("div")).style.width="5px",e=3!==t.offsetWidth),n.removeChild(r),e):void 0}}();var Fe=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Re=new RegExp("^(?:([+-])=|)("+Fe+")([a-z%]*)$","i"),Be=["Top","Right","Bottom","Left"],We=function(e,t){return e=t||e,"none"===ve.css(e,"display")||!ve.contains(e.ownerDocument,e)},$e=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===ve.type(n)){i=!0;for(s in n)$e(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,ve.isFunction(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(ve(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},ze=/^(?:checkbox|radio)$/i,Ue=/<([\w:-]+)/,Xe=/^$|\/(?:java|ecma)script/i,Je=/^\s+/,Ve="abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";!function(){var e=se.createElement("div"),t=se.createDocumentFragment(),n=se.createElement("input");e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",ge.leadingWhitespace=3===e.firstChild.nodeType,ge.tbody=!e.getElementsByTagName("tbody").length,ge.htmlSerialize=!!e.getElementsByTagName("link").length,ge.html5Clone="<:nav></:nav>"!==se.createElement("nav").cloneNode(!0).outerHTML,n.type="checkbox",n.checked=!0,t.appendChild(n),ge.appendChecked=n.checked,e.innerHTML="<textarea>x</textarea>",ge.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue,t.appendChild(e),n=se.createElement("input"),n.setAttribute("type","radio"),n.setAttribute("checked","checked"),n.setAttribute("name","t"),e.appendChild(n),ge.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,ge.noCloneEvent=!!e.addEventListener,e[ve.expando]=1,ge.attributes=!e.getAttribute(ve.expando)}();var Ye={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:ge.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]};Ye.optgroup=Ye.option,Ye.tbody=Ye.tfoot=Ye.colgroup=Ye.caption=Ye.thead,Ye.th=Ye.td;var Ge=/<|&#?\w+;/,Qe=/<tbody/i;!function(){var e,t,r=se.createElement("div");for(e in{submit:!0,change:!0,focusin:!0})t="on"+e,(ge[e]=t in n)||(r.setAttribute(t,"t"),ge[e]=r.attributes[t].expando===!1);r=null}();var Ze=/^(?:input|select|textarea)$/i,Ke=/^key/,et=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,tt=/^(?:focusinfocus|focusoutblur)$/,nt=/^([^.]*)(?:\.(.+)|)/;ve.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=ve._data(e);if(y){for(n.handler&&(u=n,n=u.handler,i=u.selector),n.guid||(n.guid=ve.guid++),(a=y.events)||(a=y.events={}),(c=y.handle)||(c=y.handle=function(e){return"undefined"==typeof ve||e&&ve.event.triggered===e.type?void 0:ve.event.dispatch.apply(c.elem,arguments)},c.elem=e),t=(t||"").match(De)||[""],s=t.length;s--;)o=nt.exec(t[s])||[],d=g=o[1],h=(o[2]||"").split(".").sort(),d&&(l=ve.event.special[d]||{},d=(i?l.delegateType:l.bindType)||d,l=ve.event.special[d]||{},f=ve.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&ve.expr.match.needsContext.test(i),namespace:h.join(".")},u),(p=a[d])||(p=a[d]=[],p.delegateCount=0,l.setup&&l.setup.call(e,r,h,c)!==!1||(e.addEventListener?e.addEventListener(d,c,!1):e.attachEvent&&e.attachEvent("on"+d,c))),l.add&&(l.add.call(e,f),f.handler.guid||(f.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,f):p.push(f),ve.event.global[d]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=ve.hasData(e)&&ve._data(e);if(y&&(c=y.events)){for(t=(t||"").match(De)||[""],l=t.length;l--;)if(s=nt.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){for(f=ve.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,p=c[d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),u=o=p.length;o--;)a=p[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(p.splice(o,1),a.selector&&p.delegateCount--,f.remove&&f.remove.call(e,a));u&&!p.length&&(f.teardown&&f.teardown.call(e,h,y.handle)!==!1||ve.removeEvent(e,d,y.handle),delete c[d])}else for(d in c)ve.event.remove(e,d+t[l],n,r,!0);ve.isEmptyObject(c)&&(delete y.handle,ve._removeData(e,"events"))}},trigger:function(e,t,r,i){var o,a,s,u,l,c,f,p=[r||se],d=he.call(e,"type")?e.type:e,h=he.call(e,"namespace")?e.namespace.split("."):[];if(s=c=r=r||se,3!==r.nodeType&&8!==r.nodeType&&!tt.test(d+ve.event.triggered)&&(d.indexOf(".")>-1&&(h=d.split("."),d=h.shift(),h.sort()),a=d.indexOf(":")<0&&"on"+d,e=e[ve.expando]?e:new ve.Event(d,"object"==typeof e&&e),e.isTrigger=i?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=r),t=null==t?[e]:ve.makeArray(t,[e]),l=ve.event.special[d]||{},i||!l.trigger||l.trigger.apply(r,t)!==!1)){if(!i&&!l.noBubble&&!ve.isWindow(r)){for(u=l.delegateType||d,tt.test(u+d)||(s=s.parentNode);s;s=s.parentNode)p.push(s),c=s;c===(r.ownerDocument||se)&&p.push(c.defaultView||c.parentWindow||n)}for(f=0;(s=p[f++])&&!e.isPropagationStopped();)e.type=f>1?u:l.bindType||d,o=(ve._data(s,"events")||{})[e.type]&&ve._data(s,"handle"),o&&o.apply(s,t),o=a&&s[a],o&&o.apply&&He(s)&&(e.result=o.apply(s,t),e.result===!1&&e.preventDefault());if(e.type=d,!i&&!e.isDefaultPrevented()&&(!l._default||l._default.apply(p.pop(),t)===!1)&&He(r)&&a&&r[d]&&!ve.isWindow(r)){c=r[a],c&&(r[a]=null),ve.event.triggered=d;try{r[d]()}catch(g){}ve.event.triggered=void 0,c&&(r[a]=c)}return e.result}},dispatch:function(e){e=ve.event.fix(e);var t,n,r,i,o,a=[],s=ue.call(arguments),u=(ve._data(this,"events")||{})[e.type]||[],l=ve.event.special[e.type]||{};if(s[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){for(a=ve.event.handlers.call(this,e,u),t=0;(i=a[t++])&&!e.isPropagationStopped();)for(e.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!e.isImmediatePropagationStopped();)e.rnamespace&&!e.rnamespace.test(o.namespace)||(e.handleObj=o,e.data=o.data,r=((ve.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s),void 0!==r&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()));return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,a=[],s=t.delegateCount,u=e.target;if(s&&u.nodeType&&("click"!==e.type||isNaN(e.button)||e.button<1))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(r=[],n=0;n<s;n++)o=t[n],i=o.selector+" ",void 0===r[i]&&(r[i]=o.needsContext?ve(i,this).index(u)>-1:ve.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&a.push({elem:u,handlers:r})}return s<t.length&&a.push({elem:this,handlers:t.slice(s)}),a},fix:function(e){if(e[ve.expando])return e;var t,n,r,i=e.type,o=e,a=this.fixHooks[i];for(a||(this.fixHooks[i]=a=et.test(i)?this.mouseHooks:Ke.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new ve.Event(o),t=r.length;t--;)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||se),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,a.filter?a.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,o=t.button,a=t.fromElement;return null==e.pageX&&null!=t.clientX&&(r=e.target.ownerDocument||se,i=r.documentElement,n=r.body,e.pageX=t.clientX+(i&&i.scrollLeft||n&&n.scrollLeft||0)-(i&&i.clientLeft||n&&n.clientLeft||0),e.pageY=t.clientY+(i&&i.scrollTop||n&&n.scrollTop||0)-(i&&i.clientTop||n&&n.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?t.toElement:a),e.which||void 0===o||(e.which=1&o?1:2&o?3:4&o?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==E()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){if(this===E()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if(ve.nodeName(this,"input")&&"checkbox"===this.type&&this.click)return this.click(),!1},_default:function(e){return ve.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n){var r=ve.extend(new ve.Event,n,{type:e,isSimulated:!0});ve.event.trigger(r,null,t),r.isDefaultPrevented()&&n.preventDefault()}},ve.removeEvent=se.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)}:function(e,t,n){var r="on"+t;e.detachEvent&&("undefined"==typeof e[r]&&(e[r]=null),e.detachEvent(r,n))},ve.Event=function(e,t){return this instanceof ve.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&e.returnValue===!1?T:_):this.type=e,t&&ve.extend(this,t),this.timeStamp=e&&e.timeStamp||ve.now(),void(this[ve.expando]=!0)):new ve.Event(e,t)},ve.Event.prototype={constructor:ve.Event,isDefaultPrevented:_,isPropagationStopped:_,isImmediatePropagationStopped:_,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=T,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=T,e&&!this.isSimulated&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=T,e&&e.stopImmediatePropagation&&e.stopImmediatePropagation(),this.stopPropagation()}},ve.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){ve.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||ve.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),ge.submit||(ve.event.special.submit={setup:function(){return!ve.nodeName(this,"form")&&void ve.event.add(this,"click._submit keypress._submit",function(e){var t=e.target,n=ve.nodeName(t,"input")||ve.nodeName(t,"button")?ve.prop(t,"form"):void 0;n&&!ve._data(n,"submit")&&(ve.event.add(n,"submit._submit",function(e){e._submitBubble=!0}),ve._data(n,"submit",!0))})},postDispatch:function(e){e._submitBubble&&(delete e._submitBubble,this.parentNode&&!e.isTrigger&&ve.event.simulate("submit",this.parentNode,e))},teardown:function(){return!ve.nodeName(this,"form")&&void ve.event.remove(this,"._submit")}}),ge.change||(ve.event.special.change={setup:function(){return Ze.test(this.nodeName)?("checkbox"!==this.type&&"radio"!==this.type||(ve.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._justChanged=!0)}),ve.event.add(this,"click._change",function(e){this._justChanged&&!e.isTrigger&&(this._justChanged=!1),ve.event.simulate("change",this,e)})),!1):void ve.event.add(this,"beforeactivate._change",function(e){var t=e.target;Ze.test(t.nodeName)&&!ve._data(t,"change")&&(ve.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||ve.event.simulate("change",this.parentNode,e)}),ve._data(t,"change",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||"radio"!==t.type&&"checkbox"!==t.type)return e.handleObj.handler.apply(this,arguments)},teardown:function(){return ve.event.remove(this,"._change"),!Ze.test(this.nodeName)}}),ge.focusin||ve.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){ve.event.simulate(t,e.target,ve.event.fix(e))};ve.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=ve._data(r,t);i||r.addEventListener(e,n,!0),ve._data(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=ve._data(r,t)-1;i?ve._data(r,t,i):(r.removeEventListener(e,n,!0),ve._removeData(r,t))}}}),ve.fn.extend({on:function(e,t,n,r){return C(this,e,t,n,r)},one:function(e,t,n,r){return C(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,ve(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return t!==!1&&"function"!=typeof t||(n=t,t=void 0),n===!1&&(n=_),this.each(function(){ve.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){ve.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return ve.event.trigger(e,t,n,!0)}});var rt=/ jQuery\d+="(?:null|\d+)"/g,it=new RegExp("<(?:"+Ve+")[\\s/>]","i"),ot=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,at=/<script|<style|<link/i,st=/checked\s*(?:[^=]|=\s*.checked.)/i,ut=/^true\/(.*)/,lt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ct=v(se),ft=ct.appendChild(se.createElement("div"));ve.extend({htmlPrefilter:function(e){return e.replace(ot,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s,u=ve.contains(e.ownerDocument,e);if(ge.html5Clone||ve.isXMLDoc(e)||!it.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(ft.innerHTML=e.outerHTML,ft.removeChild(o=ft.firstChild)),!(ge.noCloneEvent&&ge.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||ve.isXMLDoc(e)))for(r=m(o),s=m(e),a=0;null!=(i=s[a]);++a)r[a]&&k(i,r[a]);if(t)if(n)for(s=s||m(e),r=r||m(o),a=0;null!=(i=s[a]);a++)j(i,r[a]);else j(e,o);return r=m(o,"script"),r.length>0&&b(r,!u&&m(e,"script")),r=s=i=null,o},cleanData:function(e,t){for(var n,r,i,o,a=0,s=ve.expando,u=ve.cache,l=ge.attributes,c=ve.event.special;null!=(n=e[a]);a++)if((t||He(n))&&(i=n[s],o=i&&u[i])){if(o.events)for(r in o.events)c[r]?ve.event.remove(n,r):ve.removeEvent(n,r,o.handle);u[i]&&(delete u[i],l||"undefined"==typeof n.removeAttribute?n[s]=void 0:n.removeAttribute(s),ae.push(i))}}}),ve.fn.extend({domManip:A,detach:function(e){return O(this,e,!0)},remove:function(e){return O(this,e)},text:function(e){return $e(this,function(e){return void 0===e?ve.text(this):this.empty().append((this[0]&&this[0].ownerDocument||se).createTextNode(e))},null,e,arguments.length)},append:function(){return A(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=S(this,e);t.appendChild(e)}})},prepend:function(){return A(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=S(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return A(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return A(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++){for(1===e.nodeType&&ve.cleanData(m(e,!1));e.firstChild;)e.removeChild(e.firstChild);e.options&&ve.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return ve.clone(this,e,t)})},html:function(e){return $e(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e)return 1===t.nodeType?t.innerHTML.replace(rt,""):void 0;if("string"==typeof e&&!at.test(e)&&(ge.htmlSerialize||!it.test(e))&&(ge.leadingWhitespace||!Je.test(e))&&!Ye[(Ue.exec(e)||["",""])[1].toLowerCase()]){e=ve.htmlPrefilter(e);try{for(;n<r;n++)t=this[n]||{},1===t.nodeType&&(ve.cleanData(m(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return A(this,arguments,function(t){var n=this.parentNode;ve.inArray(this,e)<0&&(ve.cleanData(m(this)),n&&n.replaceChild(t,this))},e)}}),ve.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){ve.fn[e]=function(e){for(var n,r=0,i=[],o=ve(e),a=o.length-1;r<=a;r++)n=r===a?this:this.clone(!0),ve(o[r])[t](n),ce.apply(i,n.get());return this.pushStack(i)}});var pt,dt={HTML:"block",BODY:"block"},ht=/^margin/,gt=new RegExp("^("+Fe+")(?!px)[a-z%]+$","i"),yt=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i},vt=se.documentElement;!function(){function e(){var e,c,f=se.documentElement;f.appendChild(u),l.style.cssText="-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",t=i=s=!1,r=a=!0,n.getComputedStyle&&(c=n.getComputedStyle(l),t="1%"!==(c||{}).top,s="2px"===(c||{}).marginLeft,i="4px"===(c||{width:"4px"}).width,l.style.marginRight="50%",r="4px"===(c||{marginRight:"4px"}).marginRight,e=l.appendChild(se.createElement("div")),e.style.cssText=l.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",e.style.marginRight=e.style.width="0",l.style.width="1px",a=!parseFloat((n.getComputedStyle(e)||{}).marginRight),l.removeChild(e)),l.style.display="none",o=0===l.getClientRects().length,o&&(l.style.display="",l.innerHTML="<table><tr><td></td><td>t</td></tr></table>",l.childNodes[0].style.borderCollapse="separate",e=l.getElementsByTagName("td"),e[0].style.cssText="margin:0;border:0;padding:0;display:none",o=0===e[0].offsetHeight,o&&(e[0].style.display="",e[1].style.display="none",o=0===e[0].offsetHeight)),f.removeChild(u)}var t,r,i,o,a,s,u=se.createElement("div"),l=se.createElement("div");l.style&&(l.style.cssText="float:left;opacity:.5",ge.opacity="0.5"===l.style.opacity,ge.cssFloat=!!l.style.cssFloat,l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",ge.clearCloneStyle="content-box"===l.style.backgroundClip,u=se.createElement("div"),u.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",l.innerHTML="",u.appendChild(l),ge.boxSizing=""===l.style.boxSizing||""===l.style.MozBoxSizing||""===l.style.WebkitBoxSizing,ve.extend(ge,{reliableHiddenOffsets:function(){return null==t&&e(),o},boxSizingReliable:function(){return null==t&&e(),i},pixelMarginRight:function(){return null==t&&e(),r},pixelPosition:function(){return null==t&&e(),t},reliableMarginRight:function(){return null==t&&e(),a},reliableMarginLeft:function(){return null==t&&e(),s}}))}();var mt,bt,xt=/^(top|right|bottom|left)$/;n.getComputedStyle?(mt=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=n),t.getComputedStyle(e)},bt=function(e,t,n){var r,i,o,a,s=e.style;return n=n||mt(e),a=n?n.getPropertyValue(t)||n[t]:void 0,""!==a&&void 0!==a||ve.contains(e.ownerDocument,e)||(a=ve.style(e,t)),n&&!ge.pixelMarginRight()&&gt.test(a)&&ht.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o),void 0===a?a:a+""}):vt.currentStyle&&(mt=function(e){return e.currentStyle},bt=function(e,t,n){var r,i,o,a,s=e.style;return n=n||mt(e),a=n?n[t]:void 0,null==a&&s&&s[t]&&(a=s[t]),gt.test(a)&&!xt.test(t)&&(r=s.left,i=e.runtimeStyle,o=i&&i.left,o&&(i.left=e.currentStyle.left),s.left="fontSize"===t?"1em":a,a=s.pixelLeft+"px",s.left=r,o&&(i.left=o)),void 0===a?a:a+""||"auto"});var wt=/alpha\([^)]*\)/i,Tt=/opacity\s*=\s*([^)]*)/i,_t=/^(none|table(?!-c[ea]).+)/,Et=new RegExp("^("+Fe+")(.*)$","i"),Ct={position:"absolute",visibility:"hidden",display:"block"},St={letterSpacing:"0",fontWeight:"400"},Lt=["Webkit","O","Moz","ms"],Nt=se.createElement("div").style;ve.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=bt(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":ge.cssFloat?"cssFloat":"styleFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=ve.camelCase(t),u=e.style;if(t=ve.cssProps[s]||(ve.cssProps[s]=H(s)||s),a=ve.cssHooks[t]||ve.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:u[t];if(o=typeof n,"string"===o&&(i=Re.exec(n))&&i[1]&&(n=y(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(ve.cssNumber[s]?"":"px")),ge.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),!(a&&"set"in a&&void 0===(n=a.set(e,n,r)))))try{u[t]=n}catch(l){}}},css:function(e,t,n,r){var i,o,a,s=ve.camelCase(t);return t=ve.cssProps[s]||(ve.cssProps[s]=H(s)||s),a=ve.cssHooks[t]||ve.cssHooks[s],a&&"get"in a&&(o=a.get(e,!0,n)),void 0===o&&(o=bt(e,t,r)),"normal"===o&&t in St&&(o=St[t]),""===n||n?(i=parseFloat(o),n===!0||isFinite(i)?i||0:o):o}}),ve.each(["height","width"],function(e,t){ve.cssHooks[t]={get:function(e,n,r){if(n)return _t.test(ve.css(e,"display"))&&0===e.offsetWidth?yt(e,Ct,function(){return R(e,t,r)}):R(e,t,r)},set:function(e,n,r){var i=r&&mt(e);return P(e,n,r?F(e,t,r,ge.boxSizing&&"border-box"===ve.css(e,"boxSizing",!1,i),i):0)}}}),ge.opacity||(ve.cssHooks.opacity={get:function(e,t){return Tt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=ve.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===ve.trim(o.replace(wt,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=wt.test(o)?o.replace(wt,i):o+" "+i)}}),ve.cssHooks.marginRight=q(ge.reliableMarginRight,function(e,t){if(t)return yt(e,{display:"inline-block"},bt,[e,"marginRight"])}),ve.cssHooks.marginLeft=q(ge.reliableMarginLeft,function(e,t){if(t)return(parseFloat(bt(e,"marginLeft"))||(ve.contains(e.ownerDocument,e)?e.getBoundingClientRect().left-yt(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}):0))+"px"}),ve.each({margin:"",padding:"",border:"Width"},function(e,t){ve.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+Be[r]+t]=o[r]||o[r-2]||o[0];return i}},ht.test(e)||(ve.cssHooks[e+t].set=P)}),ve.fn.extend({css:function(e,t){return $e(this,function(e,t,n){var r,i,o={},a=0;if(ve.isArray(t)){for(r=mt(e),i=t.length;a<i;a++)o[t[a]]=ve.css(e,t[a],!1,r);return o}return void 0!==n?ve.style(e,t,n):ve.css(e,t)},e,t,arguments.length>1)},show:function(){return M(this,!0)},hide:function(){return M(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){We(this)?ve(this).show():ve(this).hide()})}}),ve.Tween=B,B.prototype={constructor:B,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||ve.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(ve.cssNumber[n]?"":"px")},cur:function(){var e=B.propHooks[this.prop];return e&&e.get?e.get(this):B.propHooks._default.get(this)},run:function(e){var t,n=B.propHooks[this.prop];return this.options.duration?this.pos=t=ve.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):B.propHooks._default.set(this),this}},B.prototype.init.prototype=B.prototype,B.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=ve.css(e.elem,e.prop,""),t&&"auto"!==t?t:0)},set:function(e){ve.fx.step[e.prop]?ve.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[ve.cssProps[e.prop]]&&!ve.cssHooks[e.prop]?e.elem[e.prop]=e.now:ve.style(e.elem,e.prop,e.now+e.unit)}}},B.propHooks.scrollTop=B.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},ve.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},ve.fx=B.prototype.init,ve.fx.step={};var jt,kt,At=/^(?:toggle|show|hide)$/,Ot=/queueHooks$/;ve.Animation=ve.extend(J,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return y(n.elem,e,Re.exec(t),n),n}]},tweener:function(e,t){ve.isFunction(e)?(t=e,e=["*"]):e=e.match(De);for(var n,r=0,i=e.length;r<i;r++)n=e[r],J.tweeners[n]=J.tweeners[n]||[],J.tweeners[n].unshift(t)},prefilters:[U],prefilter:function(e,t){t?J.prefilters.unshift(e):J.prefilters.push(e)}}),ve.speed=function(e,t,n){var r=e&&"object"==typeof e?ve.extend({},e):{complete:n||!n&&t||ve.isFunction(e)&&e,duration:e,easing:n&&t||t&&!ve.isFunction(t)&&t};return r.duration=ve.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in ve.fx.speeds?ve.fx.speeds[r.duration]:ve.fx.speeds._default,null!=r.queue&&r.queue!==!0||(r.queue="fx"),r.old=r.complete,r.complete=function(){ve.isFunction(r.old)&&r.old.call(this),r.queue&&ve.dequeue(this,r.queue)},r},ve.fn.extend({fadeTo:function(e,t,n,r){return this.filter(We).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=ve.isEmptyObject(e),o=ve.speed(t,n,r),a=function(){var t=J(this,ve.extend({},e),o);(i||ve._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=ve.timers,a=ve._data(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&Ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||ve.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=ve._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=ve.timers,a=r?r.length:0;for(n.finish=!0,ve.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),ve.each(["toggle","show","hide"],function(e,t){var n=ve.fn[t];ve.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate($(t,!0),e,r,i)}}),ve.each({slideDown:$("show"),slideUp:$("hide"),slideToggle:$("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){ve.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),ve.timers=[],ve.fx.tick=function(){var e,t=ve.timers,n=0;for(jt=ve.now();n<t.length;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||ve.fx.stop(),jt=void 0},ve.fx.timer=function(e){ve.timers.push(e),e()?ve.fx.start():ve.timers.pop()},ve.fx.interval=13,ve.fx.start=function(){kt||(kt=n.setInterval(ve.fx.tick,ve.fx.interval))},ve.fx.stop=function(){n.clearInterval(kt),kt=null},ve.fx.speeds={slow:600,fast:200,_default:400},ve.fn.delay=function(e,t){return e=ve.fx?ve.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,r){var i=n.setTimeout(t,e);r.stop=function(){n.clearTimeout(i)}})},function(){var e,t=se.createElement("input"),n=se.createElement("div"),r=se.createElement("select"),i=r.appendChild(se.createElement("option"));n=se.createElement("div"),n.setAttribute("className","t"),n.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",e=n.getElementsByTagName("a")[0],t.setAttribute("type","checkbox"),n.appendChild(t),e=n.getElementsByTagName("a")[0],e.style.cssText="top:1px",ge.getSetAttribute="t"!==n.className,ge.style=/top/.test(e.getAttribute("style")),ge.hrefNormalized="/a"===e.getAttribute("href"),ge.checkOn=!!t.value,ge.optSelected=i.selected,ge.enctype=!!se.createElement("form").enctype,r.disabled=!0,ge.optDisabled=!i.disabled,t=se.createElement("input"),t.setAttribute("value",""),ge.input=""===t.getAttribute("value"),t.value="t",t.setAttribute("type","radio"),ge.radioValue="t"===t.value}();var Dt=/\r/g,It=/[\x20\t\r\n\f]+/g;ve.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=ve.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,ve(this).val()):e,null==i?i="":"number"==typeof i?i+="":ve.isArray(i)&&(i=ve.map(i,function(e){return null==e?"":e+""})),t=ve.valHooks[this.type]||ve.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return t=ve.valHooks[i.type]||ve.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:(n=i.value,
"string"==typeof n?n.replace(Dt,""):null==n?"":n)}}}),ve.extend({valHooks:{option:{get:function(e){var t=ve.find.attr(e,"value");return null!=t?t:ve.trim(ve.text(e)).replace(It," ")}},select:{get:function(e){for(var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||i<0,a=o?null:[],s=o?i+1:r.length,u=i<0?s:o?i:0;u<s;u++)if(n=r[u],(n.selected||u===i)&&(ge.optDisabled?!n.disabled:null===n.getAttribute("disabled"))&&(!n.parentNode.disabled||!ve.nodeName(n.parentNode,"optgroup"))){if(t=ve(n).val(),o)return t;a.push(t)}return a},set:function(e,t){for(var n,r,i=e.options,o=ve.makeArray(t),a=i.length;a--;)if(r=i[a],ve.inArray(ve.valHooks.option.get(r),o)>-1)try{r.selected=n=!0}catch(s){r.scrollHeight}else r.selected=!1;return n||(e.selectedIndex=-1),i}}}}),ve.each(["radio","checkbox"],function(){ve.valHooks[this]={set:function(e,t){if(ve.isArray(t))return e.checked=ve.inArray(ve(e).val(),t)>-1}},ge.checkOn||(ve.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var qt,Ht,Mt=ve.expr.attrHandle,Pt=/^(?:checked|selected)$/i,Ft=ge.getSetAttribute,Rt=ge.input;ve.fn.extend({attr:function(e,t){return $e(this,ve.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){ve.removeAttr(this,e)})}}),ve.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?ve.prop(e,t,n):(1===o&&ve.isXMLDoc(e)||(t=t.toLowerCase(),i=ve.attrHooks[t]||(ve.expr.match.bool.test(t)?Ht:qt)),void 0!==n?null===n?void ve.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:(r=ve.find.attr(e,t),null==r?void 0:r))},attrHooks:{type:{set:function(e,t){if(!ge.radioValue&&"radio"===t&&ve.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(De);if(o&&1===e.nodeType)for(;n=o[i++];)r=ve.propFix[n]||n,ve.expr.match.bool.test(n)?Rt&&Ft||!Pt.test(n)?e[r]=!1:e[ve.camelCase("default-"+n)]=e[r]=!1:ve.attr(e,n,""),e.removeAttribute(Ft?n:r)}}),Ht={set:function(e,t,n){return t===!1?ve.removeAttr(e,n):Rt&&Ft||!Pt.test(n)?e.setAttribute(!Ft&&ve.propFix[n]||n,n):e[ve.camelCase("default-"+n)]=e[n]=!0,n}},ve.each(ve.expr.match.bool.source.match(/\w+/g),function(e,t){var n=Mt[t]||ve.find.attr;Rt&&Ft||!Pt.test(t)?Mt[t]=function(e,t,r){var i,o;return r||(o=Mt[t],Mt[t]=i,i=null!=n(e,t,r)?t.toLowerCase():null,Mt[t]=o),i}:Mt[t]=function(e,t,n){if(!n)return e[ve.camelCase("default-"+t)]?t.toLowerCase():null}}),Rt&&Ft||(ve.attrHooks.value={set:function(e,t,n){return ve.nodeName(e,"input")?void(e.defaultValue=t):qt&&qt.set(e,t,n)}}),Ft||(qt={set:function(e,t,n){var r=e.getAttributeNode(n);if(r||e.setAttributeNode(r=e.ownerDocument.createAttribute(n)),r.value=t+="","value"===n||t===e.getAttribute(n))return t}},Mt.id=Mt.name=Mt.coords=function(e,t,n){var r;if(!n)return(r=e.getAttributeNode(t))&&""!==r.value?r.value:null},ve.valHooks.button={get:function(e,t){var n=e.getAttributeNode(t);if(n&&n.specified)return n.value},set:qt.set},ve.attrHooks.contenteditable={set:function(e,t,n){qt.set(e,""!==t&&t,n)}},ve.each(["width","height"],function(e,t){ve.attrHooks[t]={set:function(e,n){if(""===n)return e.setAttribute(t,"auto"),n}}})),ge.style||(ve.attrHooks.style={get:function(e){return e.style.cssText||void 0},set:function(e,t){return e.style.cssText=t+""}});var Bt=/^(?:input|select|textarea|button|object)$/i,Wt=/^(?:a|area)$/i;ve.fn.extend({prop:function(e,t){return $e(this,ve.prop,e,t,arguments.length>1)},removeProp:function(e){return e=ve.propFix[e]||e,this.each(function(){try{this[e]=void 0,delete this[e]}catch(t){}})}}),ve.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&ve.isXMLDoc(e)||(t=ve.propFix[t]||t,i=ve.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=ve.find.attr(e,"tabindex");return t?parseInt(t,10):Bt.test(e.nodeName)||Wt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),ge.hrefNormalized||ve.each(["href","src"],function(e,t){ve.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),ge.optSelected||(ve.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),ve.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){ve.propFix[this.toLowerCase()]=this}),ge.enctype||(ve.propFix.enctype="encoding");var $t=/[\t\r\n\f]/g;ve.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(ve.isFunction(e))return this.each(function(t){ve(this).addClass(e.call(this,t,V(this)))});if("string"==typeof e&&e)for(t=e.match(De)||[];n=this[u++];)if(i=V(n),r=1===n.nodeType&&(" "+i+" ").replace($t," ")){for(a=0;o=t[a++];)r.indexOf(" "+o+" ")<0&&(r+=o+" ");s=ve.trim(r),i!==s&&ve.attr(n,"class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(ve.isFunction(e))return this.each(function(t){ve(this).removeClass(e.call(this,t,V(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof e&&e)for(t=e.match(De)||[];n=this[u++];)if(i=V(n),r=1===n.nodeType&&(" "+i+" ").replace($t," ")){for(a=0;o=t[a++];)for(;r.indexOf(" "+o+" ")>-1;)r=r.replace(" "+o+" "," ");s=ve.trim(r),i!==s&&ve.attr(n,"class",s)}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):ve.isFunction(e)?this.each(function(n){ve(this).toggleClass(e.call(this,n,V(this),t),t)}):this.each(function(){var t,r,i,o;if("string"===n)for(r=0,i=ve(this),o=e.match(De)||[];t=o[r++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else void 0!==e&&"boolean"!==n||(t=V(this),t&&ve._data(this,"__className__",t),ve.attr(this,"class",t||e===!1?"":ve._data(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;for(t=" "+e+" ";n=this[r++];)if(1===n.nodeType&&(" "+V(n)+" ").replace($t," ").indexOf(t)>-1)return!0;return!1}}),ve.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){ve.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),ve.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}});var zt=n.location,Ut=ve.now(),Xt=/\?/,Jt=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;ve.parseJSON=function(e){if(n.JSON&&n.JSON.parse)return n.JSON.parse(e+"");var t,r=null,i=ve.trim(e+"");return i&&!ve.trim(i.replace(Jt,function(e,n,i,o){return t&&n&&(r=0),0===r?e:(t=i||n,r+=!o-!i,"")}))?Function("return "+i)():ve.error("Invalid JSON: "+e)},ve.parseXML=function(e){var t,r;if(!e||"string"!=typeof e)return null;try{n.DOMParser?(r=new n.DOMParser,t=r.parseFromString(e,"text/xml")):(t=new n.ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e))}catch(i){t=void 0}return t&&t.documentElement&&!t.getElementsByTagName("parsererror").length||ve.error("Invalid XML: "+e),t};var Vt=/#.*$/,Yt=/([?&])_=[^&]*/,Gt=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Qt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Zt=/^(?:GET|HEAD)$/,Kt=/^\/\//,en=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,tn={},nn={},rn="*/".concat("*"),on=zt.href,an=en.exec(on.toLowerCase())||[];ve.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:on,type:"GET",isLocal:Qt.test(an[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":rn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":ve.parseJSON,"text xml":ve.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Q(Q(e,ve.ajaxSettings),t):Q(ve.ajaxSettings,e)},ajaxPrefilter:Y(tn),ajaxTransport:Y(nn),ajax:function(e,t){function r(e,t,r,i){var o,f,m,b,w,_=t;2!==x&&(x=2,u&&n.clearTimeout(u),c=void 0,s=i||"",T.readyState=e>0?4:0,o=e>=200&&e<300||304===e,r&&(b=Z(p,T,r)),b=K(p,b,T,o),o?(p.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(ve.lastModified[a]=w),w=T.getResponseHeader("etag"),w&&(ve.etag[a]=w)),204===e||"HEAD"===p.type?_="nocontent":304===e?_="notmodified":(_=b.state,f=b.data,m=b.error,o=!m)):(m=_,!e&&_||(_="error",e<0&&(e=0))),T.status=e,T.statusText=(t||_)+"",o?g.resolveWith(d,[f,_,T]):g.rejectWith(d,[T,_,m]),T.statusCode(v),v=void 0,l&&h.trigger(o?"ajaxSuccess":"ajaxError",[T,p,o?f:m]),y.fireWith(d,[T,_]),l&&(h.trigger("ajaxComplete",[T,p]),--ve.active||ve.event.trigger("ajaxStop")))}"object"==typeof e&&(t=e,e=void 0),t=t||{};var i,o,a,s,u,l,c,f,p=ve.ajaxSetup({},t),d=p.context||p,h=p.context&&(d.nodeType||d.jquery)?ve(d):ve.event,g=ve.Deferred(),y=ve.Callbacks("once memory"),v=p.statusCode||{},m={},b={},x=0,w="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===x){if(!f)for(f={};t=Gt.exec(s);)f[t[1].toLowerCase()]=t[2];t=f[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?s:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return x||(e=b[n]=b[n]||e,m[e]=t),this},overrideMimeType:function(e){return x||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(x<2)for(t in e)v[t]=[v[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||w;return c&&c.abort(t),r(0,t),this}};if(g.promise(T).complete=y.add,T.success=T.done,T.error=T.fail,p.url=((e||p.url||on)+"").replace(Vt,"").replace(Kt,an[1]+"//"),p.type=t.method||t.type||p.method||p.type,p.dataTypes=ve.trim(p.dataType||"*").toLowerCase().match(De)||[""],null==p.crossDomain&&(i=en.exec(p.url.toLowerCase()),p.crossDomain=!(!i||i[1]===an[1]&&i[2]===an[2]&&(i[3]||("http:"===i[1]?"80":"443"))===(an[3]||("http:"===an[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=ve.param(p.data,p.traditional)),G(tn,p,t,T),2===x)return T;l=ve.event&&p.global,l&&0===ve.active++&&ve.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Zt.test(p.type),a=p.url,p.hasContent||(p.data&&(a=p.url+=(Xt.test(a)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=Yt.test(a)?a.replace(Yt,"$1_="+Ut++):a+(Xt.test(a)?"&":"?")+"_="+Ut++)),p.ifModified&&(ve.lastModified[a]&&T.setRequestHeader("If-Modified-Since",ve.lastModified[a]),ve.etag[a]&&T.setRequestHeader("If-None-Match",ve.etag[a])),(p.data&&p.hasContent&&p.contentType!==!1||t.contentType)&&T.setRequestHeader("Content-Type",p.contentType),T.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+rn+"; q=0.01":""):p.accepts["*"]);for(o in p.headers)T.setRequestHeader(o,p.headers[o]);if(p.beforeSend&&(p.beforeSend.call(d,T,p)===!1||2===x))return T.abort();w="abort";for(o in{success:1,error:1,complete:1})T[o](p[o]);if(c=G(nn,p,t,T)){if(T.readyState=1,l&&h.trigger("ajaxSend",[T,p]),2===x)return T;p.async&&p.timeout>0&&(u=n.setTimeout(function(){T.abort("timeout")},p.timeout));try{x=1,c.send(m,r)}catch(_){if(!(x<2))throw _;r(-1,_)}}else r(-1,"No Transport");return T},getJSON:function(e,t,n){return ve.get(e,t,n,"json")},getScript:function(e,t){return ve.get(e,void 0,t,"script")}}),ve.each(["get","post"],function(e,t){ve[t]=function(e,n,r,i){return ve.isFunction(n)&&(i=i||r,r=n,n=void 0),ve.ajax(ve.extend({url:e,type:t,dataType:i,data:n,success:r},ve.isPlainObject(e)&&e))}}),ve._evalUrl=function(e){return ve.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},ve.fn.extend({wrapAll:function(e){if(ve.isFunction(e))return this.each(function(t){ve(this).wrapAll(e.call(this,t))});if(this[0]){var t=ve(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstChild&&1===e.firstChild.nodeType;)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return ve.isFunction(e)?this.each(function(t){ve(this).wrapInner(e.call(this,t))}):this.each(function(){var t=ve(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=ve.isFunction(e);return this.each(function(n){ve(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){ve.nodeName(this,"body")||ve(this).replaceWith(this.childNodes)}).end()}}),ve.expr.filters.hidden=function(e){return ge.reliableHiddenOffsets()?e.offsetWidth<=0&&e.offsetHeight<=0&&!e.getClientRects().length:te(e)},ve.expr.filters.visible=function(e){return!ve.expr.filters.hidden(e)};var sn=/%20/g,un=/\[\]$/,ln=/\r?\n/g,cn=/^(?:submit|button|image|reset|file)$/i,fn=/^(?:input|select|textarea|keygen)/i;ve.param=function(e,t){var n,r=[],i=function(e,t){t=ve.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(void 0===t&&(t=ve.ajaxSettings&&ve.ajaxSettings.traditional),ve.isArray(e)||e.jquery&&!ve.isPlainObject(e))ve.each(e,function(){i(this.name,this.value)});else for(n in e)ne(n,e[n],t,i);return r.join("&").replace(sn,"+")},ve.fn.extend({serialize:function(){return ve.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=ve.prop(this,"elements");return e?ve.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!ve(this).is(":disabled")&&fn.test(this.nodeName)&&!cn.test(e)&&(this.checked||!ze.test(e))}).map(function(e,t){var n=ve(this).val();return null==n?null:ve.isArray(n)?ve.map(n,function(e){return{name:t.name,value:e.replace(ln,"\r\n")}}):{name:t.name,value:n.replace(ln,"\r\n")}}).get()}}),ve.ajaxSettings.xhr=void 0!==n.ActiveXObject?function(){return this.isLocal?ie():se.documentMode>8?re():/^(get|post|head|put|delete|options)$/i.test(this.type)&&re()||ie()}:re;var pn=0,dn={},hn=ve.ajaxSettings.xhr();n.attachEvent&&n.attachEvent("onunload",function(){for(var e in dn)dn[e](void 0,!0)}),ge.cors=!!hn&&"withCredentials"in hn,hn=ge.ajax=!!hn,hn&&ve.ajaxTransport(function(e){if(!e.crossDomain||ge.cors){var t;return{send:function(r,i){var o,a=e.xhr(),s=++pn;if(a.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(o in e.xhrFields)a[o]=e.xhrFields[o];e.mimeType&&a.overrideMimeType&&a.overrideMimeType(e.mimeType),e.crossDomain||r["X-Requested-With"]||(r["X-Requested-With"]="XMLHttpRequest");for(o in r)void 0!==r[o]&&a.setRequestHeader(o,r[o]+"");a.send(e.hasContent&&e.data||null),t=function(n,r){var o,u,l;if(t&&(r||4===a.readyState))if(delete dn[s],t=void 0,a.onreadystatechange=ve.noop,r)4!==a.readyState&&a.abort();else{l={},o=a.status,"string"==typeof a.responseText&&(l.text=a.responseText);try{u=a.statusText}catch(c){u=""}o||!e.isLocal||e.crossDomain?1223===o&&(o=204):o=l.text?200:404}l&&i(o,u,l,a.getAllResponseHeaders())},e.async?4===a.readyState?n.setTimeout(t):a.onreadystatechange=dn[s]=t:t()},abort:function(){t&&t(void 0,!0)}}}}),ve.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return ve.globalEval(e),e}}}),ve.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),ve.ajaxTransport("script",function(e){if(e.crossDomain){var t,n=se.head||ve("head")[0]||se.documentElement;return{send:function(r,i){t=se.createElement("script"),t.async=!0,e.scriptCharset&&(t.charset=e.scriptCharset),t.src=e.url,t.onload=t.onreadystatechange=function(e,n){(n||!t.readyState||/loaded|complete/.test(t.readyState))&&(t.onload=t.onreadystatechange=null,t.parentNode&&t.parentNode.removeChild(t),t=null,n||i(200,"success"))},n.insertBefore(t,n.firstChild)},abort:function(){t&&t.onload(void 0,!0)}}}});var gn=[],yn=/(=)\?(?=&|$)|\?\?/;ve.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=gn.pop()||ve.expando+"_"+Ut++;return this[e]=!0,e}}),ve.ajaxPrefilter("json jsonp",function(e,t,r){var i,o,a,s=e.jsonp!==!1&&(yn.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&yn.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return i=e.jsonpCallback=ve.isFunction(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(yn,"$1"+i):e.jsonp!==!1&&(e.url+=(Xt.test(e.url)?"&":"?")+e.jsonp+"="+i),e.converters["script json"]=function(){return a||ve.error(i+" was not called"),a[0]},e.dataTypes[0]="json",o=n[i],n[i]=function(){a=arguments},r.always(function(){void 0===o?ve(n).removeProp(i):n[i]=o,e[i]&&(e.jsonpCallback=t.jsonpCallback,gn.push(i)),a&&ve.isFunction(o)&&o(a[0]),a=o=void 0}),"script"}),ve.parseHTML=function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||se;var r=Se.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=w([e],t,i),i&&i.length&&ve(i).remove(),ve.merge([],r.childNodes))};var vn=ve.fn.load;ve.fn.load=function(e,t,n){if("string"!=typeof e&&vn)return vn.apply(this,arguments);var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=ve.trim(e.slice(s,e.length)),e=e.slice(0,s)),ve.isFunction(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&ve.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?ve("<div>").append(ve.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},ve.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){ve.fn[t]=function(e){return this.on(t,e)}}),ve.expr.filters.animated=function(e){return ve.grep(ve.timers,function(t){return e===t.elem}).length},ve.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=ve.css(e,"position"),f=ve(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=ve.css(e,"top"),u=ve.css(e,"left"),l=("absolute"===c||"fixed"===c)&&ve.inArray("auto",[o,u])>-1,l?(r=f.position(),a=r.top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),ve.isFunction(t)&&(t=t.call(e,n,ve.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},ve.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){ve.offset.setOffset(this,e,t)});var t,n,r={top:0,left:0},i=this[0],o=i&&i.ownerDocument;if(o)return t=o.documentElement,ve.contains(t,i)?("undefined"!=typeof i.getBoundingClientRect&&(r=i.getBoundingClientRect()),n=oe(o),{top:r.top+(n.pageYOffset||t.scrollTop)-(t.clientTop||0),left:r.left+(n.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}):r},position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===ve.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),ve.nodeName(e[0],"html")||(n=e.offset()),n.top+=ve.css(e[0],"borderTopWidth",!0),n.left+=ve.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-ve.css(r,"marginTop",!0),left:t.left-n.left-ve.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&!ve.nodeName(e,"html")&&"static"===ve.css(e,"position");)e=e.offsetParent;return e||vt})}}),ve.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n=/Y/.test(t);ve.fn[e]=function(r){return $e(this,function(e,r,i){var o=oe(e);return void 0===i?o?t in o?o[t]:o.document.documentElement[r]:e[r]:void(o?o.scrollTo(n?ve(o).scrollLeft():i,n?i:ve(o).scrollTop()):e[r]=i)},e,r,arguments.length,null)}}),ve.each(["top","left"],function(e,t){ve.cssHooks[t]=q(ge.pixelPosition,function(e,n){if(n)return n=bt(e,t),gt.test(n)?ve(e).position()[t]+"px":n})}),ve.each({Height:"height",Width:"width"},function(e,t){ve.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){ve.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),a=n||(r===!0||i===!0?"margin":"border");return $e(this,function(t,n,r){var i;return ve.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===r?ve.css(t,n,a):ve.style(t,n,r,a)},t,o?r:void 0,o,null)}})}),ve.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),ve.fn.size=function(){return this.length},ve.fn.andSelf=ve.fn.addBack,r=[],i=function(){return ve}.apply(t,r),!(void 0!==i&&(e.exports=i));var mn=n.jQuery,bn=n.$;return ve.noConflict=function(e){return n.$===ve&&(n.$=bn),e&&n.jQuery===ve&&(n.jQuery=mn),ve},o||(n.jQuery=n.$=ve),ve})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var s=n(2),u=r(s),l=function(e){function t(n){i(this,t);var r=o(this,e.call(this,n));return r.pcType="flash",r}return a(t,e),t.prototype.addEvent=function(){var e=this;window.__logging_hls_flash_eventListener__=function(t,n){window.__nts_ria_audio__[n].eventHandler(t),"ipc_success"!=t.type&&"ipc_fail"!=t.type&&"pt_success"!=t.type&&"pt_fail"!=t.type||(window.__nts_ria_audio__[n].logStatus(t),"ipc_fail"==t.type&&"securityError"==t.data.type?e.throwError("ipc"):"pt_fail"==t.type&&"securityError"==t.data.type&&e.throwError("pt"))}},t.prototype.removeEvent=function(){window.__logging_hls_flash_eventListener__=function(e,t){}},t.prototype.setAudio=function(e){this.reset(),this.audio=e,null==window.__nts_ria_audio__&&(window.__nts_ria_audio__={}),window.__nts_ria_audio__[e.name||e.id]=this,this.addEvent()},t.prototype.throwError=function(e){setTimeout(function(){throw new Error("flash crossdomain security error - "+e)},1)},t.prototype.onError=function(e){this.ptLogInfo.ec=e.code},t.prototype.logStatus=function(e){this.dispatchEvent(e)},t.prototype.sendLog=function(e,t,n,r,i){this.audio.__send_log(e,t,n,i)},t}(u["default"]);t["default"]=l}]);
/**
 * Created by naver on 19/04/2017.
 */
if ( !window.audiop ) window.audiop = {};
audiop.AudiopLoggerCore = function(api, playLogUrl, qualityLogUrl, mediaElementOrSwf) {
    this.options = {
        api: api,
        playLogUrl: playLogUrl,
        qualityLogUrl: qualityLogUrl
    }

    if (!this.options.playLogUrl || !this.options.qualityLogUrl) {
        throw new Error("invalid logger setup");
    }

    this.loggerCore = this._createLoggerCore(mediaElementOrSwf);
    this.loggerTimestamp = {
        requestPlayAPI: 0,
        responsePlayAPI: 0
    };
};

audiop.AudiopLoggerCore.prototype._createLoggerCore = function(mediaElementOrSwf) {

    if (!mediaElementOrSwf) {
        throw new Error("swf or mediaElement not created");
    }

    var loggerCore = new window.nts.ria.audio.PlatformLogger(mediaElementOrSwf);

    if (!loggerCore) {
        throw new Error("logger creation error");
    }

    return loggerCore;
};

audiop.AudiopLoggerCore.prototype.setMediaElement = function(mediaElement) {
    this.loggerCore.setAudio(mediaElement);
}

/**
 * log ì…‹ì—…
 * play ì‹œì ë§ˆë‹¤ í˜¸ì¶œë˜ì–´ì•¼í•¨
 */
audiop.AudiopLoggerCore.prototype.setupPlayLogInfo = function(ail) {
    if (!this.loggerTimestamp.requestPlayAPI || !this.loggerTimestamp.responsePlayAPI) {
        throw new Error("invalid logger setup");
    }

    /**
     * logger setup
     */
    this.loggerCore.setInitLogInfo({
        // ìž¬ìƒ,í’ˆì§ˆ ë¡œê·¸ crosssdomain ì— header ì„¤ì • í›„, ë°°í¬
        // header: {
        //     "x-audiop-partner-key": this.options.api.partnerKey,
        //     "x-audiop-partner-ver": audiop.PartnerInfoUtils.getPartnerVer(this.options.api.partnerId)
        // },
        ipcURL : this.options.playLogUrl, // ìž¬ìƒë¡œê·¸ url
        ptURL : this.options.qualityLogUrl, // í’ˆì§ˆë¡œê·¸ url
        sid : ail.sid, // ì˜¤ë””ì˜¤ ì„œë¹„ìŠ¤ì˜ id
        pv : "2.0.0.9", // í”Œë ˆì´ì–´ ë²„ì „ (swf ë²„ì „)
        cc : ail.cc, // êµ­ê°€ì½”ë“œ
        aid : ail.aid, // ì˜¤ë””ì˜¤ì˜ audioId
        d : "", // ìž¬ìƒë˜ëŠ” ë‹¨ë§ì˜ ëª¨ë¸ (ì•Œìˆ˜ ì—†ëŠ” ê²½ìš° ê³µë°±)
        q : ail.q, //"aac_128k", // ì˜¤ë””ì˜¤ í’ˆì§ˆ ì •ë³´
        du : ail.du, // ì˜¤ë””ì˜¤ ê¸¸ì´ (ms)
        it : (this.loggerTimestamp.responsePlayAPI - this.loggerTimestamp.requestPlayAPI), // ìž¬ìƒìš”ì²­ì„ í•œ ìˆœê°„ë¶€í„° ìž¬ìƒì •ë³´ë¥¼ íšë“í•˜ëŠ” ë°ê¹Œì§€ ì†Œìš”ë˜ëŠ” ì‹œê°„(ms ë‹¨ìœ„) (í”Œë ˆì´ì–´ ë¡œë”© ì‹œê°„ ~ ìž¬ìƒ url ë°›ì•„ì˜¤ëŠ” ì‹œê°„. ì„œë²„ì™€ì˜ í†µì‹  ì‹œê°„.)
        lv : "1", // Log version (int í˜•) Major ì—…ë°ì´íŠ¸ ì‹œë§Œ ë³€ê²½ë¨
        prtc : "3", // í”„ë¡œí† ì½œ 1 : HTTP 2 : RTMP 3: HLS
        ns : "0", // Network ìƒíƒœ 1 : Cellular 2 : wifi 3 : ìœ ì„ 
        cdn : ail.cdn
    });
};

audiop.AudiopLoggerCore.prototype.timestamp_requestPlayAPI = function() {
    this._resetPlayAPITimestamp();

    this.loggerTimestamp.requestPlayAPI = (new Date()).getTime();
};

audiop.AudiopLoggerCore.prototype.timestamp_responsePlayAPI = function() {
    this.loggerTimestamp.responsePlayAPI = (new Date()).getTime();
};

audiop.AudiopLoggerCore.prototype._resetPlayAPITimestamp = function() {
    this.loggerTimestamp.requestPlayAPI = 0;
    this.loggerTimestamp.responsePlayAPI = 0;
};
/**
 * Created by naver on 10/04/2017.
 * ì´ˆê¸° ë¡œë”©ë˜ëŠ” jsì˜ ê²½ìš° ì–´ë–¤ ë¸Œë¼ìš°ì €ì—ì„œ ë¡œë”©ë ì§€ ëª¨ë¥´ê¸° ë•Œë¬¸ì—, library(jQuery) ì—†ì´ ê°œë°œ
 * ë¸Œë¼ìš°ì €ì— ë”°ë¥¸ flashHls, html5Hls ëª¨ë“ˆì˜ ì„ íƒ dynamic download
 */
if ( !window.audiop ) window.audiop = {};
audiop.MusicWebPlayerCore = function (options) {

    this.options = {

        api: {
            partnerKey: "",
            partnerId: "",
            extra: ""
        },

        containerId : "audiop_web_player_core",

        /**
         * event(key)ëŠ” HTMLMediaElement ê¸°ì¤€
         */
        callbacks : {
            "loadinfo" : function(audioInfo) {},
            "loadstart" : function() {},
            "canplay" : function() {},
            "playing" : function() {},
            "pause" : function() {},
            "ended" : function() {},
            "timeupdate" : function(sec) {},
            "seeking" : function() {},
            "seeked" : function(pos) {},
            "volumechange" : function(vol) {},
            "waiting" : function() {},
            "error" : function() {},
            "serviceinfo" : function() {},  // ë®¤ì§ì„œë¹„ìŠ¤ìš© callback
            "servicelog" : function() {}  // ë®¤ì§ì„œë¹„ìŠ¤ìš© callback
        }
    };

    if (!!options) {
        if (!!options.containerId) {
            this.options.containerId = options.containerId;
        }

        if (!!options.callbacks) {
            for (evt in this.options.callbacks) {
                if (!!options.callbacks[evt]) {
                    this.options.callbacks[evt] = options.callbacks[evt];
                }
            }

            var self = this;
            if (!!this.options.callbacks["loadinfo"]) {
                var loadInfoCallback = this.options.callbacks["loadinfo"];

                this.options.callbacks["loadinfo"] = function (audioInfo) {
                    self.currentAudioInfo = audioInfo;
                    loadInfoCallback(audioInfo);
                }
            } else {
                this.options.callbacks["loadinfo"] = function (audioInfo) {
                    self.currentAudioInfo = audioInfo;
                }
            }
        }

        /**
         * replace default value
         */
        for (var option in options) {
            if (!this.options[option] && !!options[option]) {
                this.options[option] = options[option];
            }
        }

        this.options.api.headers = {
            "x-audiop-partner-key": this.options.api.partnerKey,
            "x-audiop-partner-ver": audiop.PartnerInfoUtils.getPartnerVer(this.options.api.partnerId)
        };
    }


    this.playerCoreSwitcher = null;
    this.currentAudioInfo = null;


    var self = this;
    this.playerCoreTypeInfoList = {
        "MSE" : {
            jsUrl : audiop.MusicWebPlayerCoreConfig.https.audiopMusicWebPlayerCoreHtml5ExtJsUrl,
            jsLoadedCheck : function () {
                return (!!window.AudiopMusicMseHlsSwitcher);
            },
            jsOnloadCallback : function() {
                if (!!window.AudiopMusicMseHlsSwitcher) {
                    self.playerCoreSwitcher = new AudiopMusicMseHlsSwitcher({
                        api: self.options.api,
                        // audiop
                        audiopAPIInfoes: audiop.MusicWebPlayerCoreConfig.https.audiopAPIInfoes,
                        audiopAPIPlay: audiop.MusicWebPlayerCoreConfig.https.audiopAPIPlay,
                        callbacks: self.options.callbacks,
                        playLogUrl: audiop.MusicWebPlayerCoreConfig.https.playLogUrl,
                        qualityLogUrl: audiop.MusicWebPlayerCoreConfig.https.qualityLogUrl,

                        // music
                        musicAPIStPlay: audiop.MusicWebPlayerCoreConfig.https.musicAPIStPlay,
                        musicAPIStLog: audiop.MusicWebPlayerCoreConfig.https.musicAPIStLog,
                        musicAPIDeviceInfo: audiop.MusicWebPlayerCoreConfig.https.musicAPIDeviceInfo,
                        musicAPIAudioId: audiop.MusicWebPlayerCoreConfig.https.musicAPIAudioId,
                        musicServiceType : self.options.musicServiceType,
                        musicDeviceType : self.options.musicDeviceType,
                        callbacks: self.options.callbacks
                    });
                }
            }
        },
        "AUDIO_TAG_HLS" : {
            jsUrl : audiop.MusicWebPlayerCoreConfig.https.audiopMusicWebPlayerCoreHtml5JsUrl,
            jsLoadedCheck : function () {
                return (!!window.AudiopMusicAudioTagSwitcher);
            },
            jsOnloadCallback : function() {
                if (!!window.AudiopMusicAudioTagSwitcher) {
                    self.playerCoreSwitcher = new AudiopMusicAudioTagSwitcher({
                        api: self.options.api,
                        // audiop
                        audiopAPIInfoes: audiop.MusicWebPlayerCoreConfig.https.audiopAPIInfoes,
                        audiopAPIPlay: audiop.MusicWebPlayerCoreConfig.https.audiopAPIPlay,
                        callbacks: self.options.callbacks,
                        playLogUrl: audiop.MusicWebPlayerCoreConfig.https.playLogUrl,
                        qualityLogUrl: audiop.MusicWebPlayerCoreConfig.https.qualityLogUrl,
                        streamingMode: "HLS",

                        // music
                        musicAPIStPlay: audiop.MusicWebPlayerCoreConfig.https.musicAPIStPlay,
                        musicAPIStLog: audiop.MusicWebPlayerCoreConfig.https.musicAPIStLog,
                        musicAPIDeviceInfo: audiop.MusicWebPlayerCoreConfig.https.musicAPIDeviceInfo,
                        musicAPIAudioId: audiop.MusicWebPlayerCoreConfig.https.musicAPIAudioId,
                        musicServiceType : self.options.musicServiceType,
                        musicDeviceType : self.options.musicDeviceType,
                        callbacks: self.options.callbacks,
                    });
                }

            }
        }
    };

    this._init();
}

/**
 * player ìž¬ìƒ (ì„œë¸Œ)ëª¨ë“ˆ ìƒì„±
 * @private
 */
audiop.MusicWebPlayerCore.prototype._init = function () {

    this._checkOptions();

    /**
     * dyanmic loading (flash or html5)
     */
    this._setupPlayerCoreSwitcher();
}

/**
 * ì˜µì…˜ ìœ íš¨ì„± ê²€ì‚¬
 * @private
 */
audiop.MusicWebPlayerCore.prototype._checkOptions = function () {
    if (!this.options.containerId) {
        throw new Error("Invalid Markup.");
    }
}

/**
 * player ìž¬ìƒ (ì„œë¸Œ)ëª¨ë“ˆ ìƒì„±
 * - ë¸Œë¼ìš°ì € í™˜ê²½ì— ë§žëŠ” ìž¬ìƒ (ì„œë¸Œ)ëª¨ë“ˆ js ë¡œë”©
 * - ìž¬ìƒ (ì„œë¸Œ)ëª¨ë“ˆ ì´ˆê¸°í™”
 * @private
 */
audiop.MusicWebPlayerCore.prototype._setupPlayerCoreSwitcher = function () {
    var playerCoreListType = audiop.AudiopWebPlayerCoreSelector.choosePlayerCore();
    var playerCoreTypeInfo = this.playerCoreTypeInfoList[playerCoreListType];

    if (!playerCoreTypeInfo) {
        return ;
    }

    audiop.JsDynamicLoader.loadJs(
        this.options.containerId,
        playerCoreTypeInfo.jsUrl,
        playerCoreTypeInfo.jsLoadedCheck,
        playerCoreTypeInfo.jsOnloadCallback
    );
};

/**
 * ë¸Œë¼ìš°ì € ì§€ì›ì—¬ë¶€
 * @returns {boolean}
 */
audiop.MusicWebPlayerCore.prototype.isSupportedUserAgent = function () {
    var playerCoreListType = audiop.AudiopWebPlayerCoreSelector.choosePlayerCore();
    var playerCoreTypeInfo = this.playerCoreTypeInfoList[playerCoreListType];

    if (!playerCoreTypeInfo) {
        return false;
    }
    return true;
}

/**
 * ìž¬ìƒ ì‹œìž‘
 * @param trackId
 */
audiop.MusicWebPlayerCore.prototype.play = function (trackId) {

    if (!this.playerCoreSwitcher) {
        this.options.callbacks["error"]("UNSUPPORTED_USERAGENT");
        return ;
    }

    this.playerCoreSwitcher.play(trackId);
}

/**
 * ì¼ì‹œ ì •ì§€
 */
audiop.MusicWebPlayerCore.prototype.pause = function () {
    if (!!this.playerCoreSwitcher) {
        this.playerCoreSwitcher.pause();
    }
}

/**
 * resume
 */
audiop.MusicWebPlayerCore.prototype.resume = function () {
    if (!!this.playerCoreSwitcher) {
        this.playerCoreSwitcher.resume();
    }
}

/**
 * ë³¼ë¥¨ ì¡°ì •
 * @param volume 0 <= value <= 1
 */
audiop.MusicWebPlayerCore.prototype.volume = function (volume) {
    if (!!this.playerCoreSwitcher) {
        volume = (volume < 0 ? 0 : volume);
        volume = (volume > 1 ? 1 : volume);

        if (0 < volume) {
            volume = Math.round(volume * 10)/10;
        }

        return this.playerCoreSwitcher.volume(volume);
    } else {
        return 0;
    }
}

/**
 * ê²€ìƒ‰(seek)
 * @param targetTime
 */
audiop.MusicWebPlayerCore.prototype.seek = function (targetTime) {
    if (!!this.playerCoreSwitcher && !!this.currentAudioInfo && !!this.currentAudioInfo.playTime) {
        targetTime = (targetTime <= 0 ? 0 : targetTime);
        targetTime = (this.currentAudioInfo.playTime < targetTime ? this.currentAudioInfo.playTime : targetTime);

        this.playerCoreSwitcher.seek(targetTime);
    }
}

/**
 * currentTime
 */
audiop.MusicWebPlayerCore.prototype.currentTime = function () {
    if (!!this.playerCoreSwitcher) {
        return this.playerCoreSwitcher.currentTime();
    }
}

/**
 * audio tag ë°˜í™˜
 */
audiop.MusicWebPlayerCore.prototype.getAudioTag = function () {
    if (!!this.playerCoreSwitcher) {
        return this.playerCoreSwitcher.getAudioTag();
    }
}
