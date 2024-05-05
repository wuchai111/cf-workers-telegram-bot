import Handler from "./handler";
import TelegramApi from "./telegram_api";
import { Config, Webhook, Commands, Kv } from "./types";
import translate from "./commands/translate";
import clear from "./commands/clear";
import image from "./commands/image";
import question from "./commands/question";
import sean from "./commands/sean";
import code from "./commands/code";
import duckduckgo from "./commands/duckduckgo";
import kanye from "./commands/kanye";
import joke from "./commands/joke";
import dog from "./commands/dog";
import bored from "./commands/bored";
import epoch from "./commands/epoch";
import roll from "./commands/roll";
import commandlist from "./commands/commandlist";
import toss from "./commands/toss";
import ping from "./commands/ping";
import getchatinfo from "./commands/getchatinfo";

export default class TelegramBot extends TelegramApi {
  translate: Function;
  clear: Function;
  image: Function;
  question: Function;
  sean: Function;
  code: Function;
  duckduckgo: Function;
  kanye: Function;
  joke: Function;
  dog: Function;
  bored: Function;
  epoch: Function;
  roll: Function;
  commandList: Function;
  toss: Function;
  ping: Function;
  getChatInfo: Function;
  url: URL;
  kv: Kv;
  get_set: KVNamespace;
  ai: Ai;
  db: D1Database;
  r2: R2Bucket;
  bot_name: string;
  chat_model: string;

  constructor(config: Config) {
    super(
      config.commands as Commands,
      config.webhook as Webhook,
      config.handler as Handler
    );
    this.translate = translate;
    this.clear = clear;
    this.image = image;
    this.question = question;
    this.sean = sean;
    this.code = code;
    this.duckduckgo = duckduckgo;
    this.kanye = kanye;
    this.joke = joke;
    this.dog = dog;
    this.bored = bored;
    this.epoch = epoch;
    this.roll = roll;
    this.commandList = commandlist;
    this.toss = toss;
    this.ping = ping;
    this.getChatInfo = getchatinfo;
    this.url = config.url;
    this.kv = config.kv as Kv;
    this.get_set = config.kv?.get_set as KVNamespace;
    this.ai = config.ai;
    this.db = config.db;
    this.r2 = config.r2;
    this.bot_name = config.bot_name;
    this.chat_model = config.chat_model;
  }
}
