## Project under development

<img src="./docs/momoka.png" width="150">

# Simple Line BX Monitor bot
Momoka is simple Crypto info bot, perform some simple task via messaging api

## Feature
- Ask crypto currency price in THB and USD in realtime (via Bx.in.th and cryptowatch)
- Ask for margin between Bx and Bitfinex
# Demo
you can add friend with Momoka right now `@nat4157k`

## Command
### Check price: 
check crypto price reference from [http://bx.in.th](http://bx.in.th) and [cryptowat.ch](http://cryptowat.ch)

`${crypto-prefix} ${currency}` 

eg: `omg thb`
### Check margin between Thailand and Foreign exchange: 
`โมโมกะ เทียบราคานอกหน่อย`

## Setup
- Create Line bussiness account
- Create Line Bot account and setup webhook in Line management
- create .env file from .env.example
- run service `npm run dev`


## Architecture
Momoka bot create with a simple design pattern (see below)

![image](./docs/diagram.png) 

## Roadmap and TODO
- Subscribe price and alert
- Subscribe by margin diff and alert

## Donate
*BTC*: `12UjMPBdMTRXboHDL2wrbZvZxFMH1uXnv6`

*OMG or ETH*: `0x962B0F5AE1976A9ddE8880503d65088b25E0f1E3`

## Patreon
[MomokaCryptoBot Pateron page](https://www.patreon.com/momokacrypto)
