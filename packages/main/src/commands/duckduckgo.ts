import { addSearchParams } from "../libs";
import TelegramBot from "../telegram_bot";
import {
  TelegramUpdate,
  TelegramInlineQueryResultArticle,
  DDGQueryResponse,
} from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate,
  args: string[]
): Promise<Response> =>
  ((query) =>
    ((duckduckgo_url) =>
      update.inline_query && query === ""
        ? self.answerInlineQuery(update.inline_query.id, [
            new TelegramInlineQueryResultArticle("https://duckduckgo.com"),
          ])
        : update.inline_query
          ? fetch(
              addSearchParams(new URL("https://api.duckduckgo.com"), {
                q: query,
                format: "json",
                t: "telegram_bot",
                no_redirect: "1",
              }).href
            ).then((response) =>
              response
                .json()
                .then((results) => results as DDGQueryResponse)
                .then((ddg_response) =>
                  ((
                    instant_answer_url,
                    thumb_url,
                    default_thumb_url = "https://duckduckgo.com/assets/icons/meta/DDG-icon_256x256.png"
                  ) =>
                    self.answerInlineQuery(
                      update.inline_query?.id ?? 0,
                      instant_answer_url !== ""
                        ? [
                            new TelegramInlineQueryResultArticle(
                              `${instant_answer_url}\n\n<a href="${
                                addSearchParams(new URL(duckduckgo_url), {
                                  q: args
                                    .slice(2)
                                    .join(" ")
                                    .replace(/^!\w* /, ""),
                                }).href
                              }">Results From DuckDuckGo</a>`,
                              instant_answer_url,
                              "HTML",
                              thumb_url
                            ),
                            new TelegramInlineQueryResultArticle(
                              duckduckgo_url,
                              duckduckgo_url,
                              "",
                              default_thumb_url
                            ),
                          ]
                        : [
                            new TelegramInlineQueryResultArticle(
                              duckduckgo_url,
                              duckduckgo_url,
                              "",
                              default_thumb_url
                            ),
                          ],
                      3600 // 1 hour
                    ))(
                    ddg_response.Redirect ?? ddg_response.AbstractURL,
                    ddg_response.Redirect === ""
                      ? `https://duckduckgo.com${
                          ddg_response.Image !== "" && ddg_response.Image
                            ? ddg_response.Image
                            : ddg_response.RelatedTopics.length !== 0 &&
                                ddg_response.RelatedTopics[0].Icon.URL !== ""
                              ? ddg_response.RelatedTopics[0].Icon.URL
                              : "/i/f96d4798.png"
                        }`
                      : ""
                  )
                )
            )
          : self.sendMessage(update.message?.chat.id ?? 0, duckduckgo_url))(
      query === ""
        ? "https://duckduckgo.com"
        : (() => {
            if (query[0][0] !== "/") {
              return addSearchParams(new URL("https://duckduckgo.com"), {
                q: query,
              }).href;
            }
            return addSearchParams(new URL("https://duckduckgo.com"), {
              q: query.split(" ").slice(1).join(" "),
            }).href;
          })()
    ))(args.join(" "));
