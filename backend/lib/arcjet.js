import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["ip.src"],
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
    characteristics:["ip.src"],
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