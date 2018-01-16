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

        audiopAPIInfoes: "http://apis.naver.com/audiopweb/audiopapiweb/audio/{audioId}/infoes?kbps={kbps}",
        audiopAPIPlay : "http://apis.naver.com/audiopweb/audiopapiweb/play/web/audio/{audioId}?kbps={kbps}&extra={extra}",

        playLogUrl : "https://audioapi.nmv.naver.com/pc", // �ъ깮濡쒓렇 url
        qualityLogUrl : "https://logapi.audiop.naver.com/quality.html", // �덉쭏濡쒓렇 url

        musicAPIStPlay: "http://apis.naver.com/nmwebplayer/music/mobilewebmusic_stplay_trackStPlay?play.trackId={play.trackId}&play.serviceType={play.serviceType}&deviceId={deviceId}&play.mediaSourceType={mediaSourceType}",
        musicAPIStLog: "https://apis.naver.com/nmwebplayer/music/mobilewebmusic_stplay_trackStLog?log.serviceType={log.serviceType}&log.time={log.time}&log.trackId={log.trackId}&log.recordTime={log.recordTime}&log.totalTime={log.totalTime}&log.token={log.token}&log.info={log.info}&deviceId={deviceId}",
        musicAPIDeviceInfo: "http://apis.naver.com/nmwebplayer/musicapiweb/device/{deviceType}/deviceId",
        musicAPIAudioId: "http://apis.naver.com/nmwebplayer/musicapiweb/audioplatform/track/{trackId}/audioId.json"
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

        if (this.checkCurrentProtocol() == "http") {
            url = url.replace(/^http[s]?/, "http");
        } else {
            url = url.replace(/^http[s]?/, "http");
        }

        return url;
    },

    checkCurrentProtocol : function() {
        return !!location.href.match(/^http/) ? "http" : "http";
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
