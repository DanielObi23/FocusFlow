import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";

// TODO: token arent being refreshed
export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["ip.src", "request.method", "request.path"],
    rules: [
        shield({mode:"LIVE"}), //protection from SQL injection, XSS, CSRF attacks
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        tokenBucket({
            mode:"LIVE",
            refillRate: 25,
            interval: 5000,
            capacity: 50
        })
    ]
 });

export const ajStrict = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["ip.src", "request.method", "request.path"],
    rules: [
        shield({mode:"LIVE"}), //protection from SQL injection, XSS, CSRF attacks
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        tokenBucket({
            mode:"LIVE",
            refillRate: 2,
            interval: 5000,
            capacity: 10
        })
    ]
 });