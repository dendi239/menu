"use server"

import { Client } from "@notionhq/client"

const NOTION_KEY = process.env.NOTION_KEY;
const MENU_DATABASE_ID = "e87c01ab-fb0a-477c-a18b-c3345950f6c2";

const notion = new Client({
  auth: NOTION_KEY,
})

export type Dish = {
  name: string,
  ingridients: Array<string>,
  imageURL: string | undefined,
  description: string,
}


export async function getDishes() {
  const menuItems = await notion.databases.query({
    database_id: MENU_DATABASE_ID
  })

  return menuItems.results.flatMap(item => {
    if (!("properties" in item) ||
        !("title" in item.properties.Name) ||
        item.properties.Name.title.length === 0 ||
        !("text" in item.properties.Name.title[0]) ||
        !("rich_text" in item.properties.Description) ||
        item.properties.Description.rich_text.length === 0 ||
        !("url" in item.properties.ImageURL) || 
        !("multi_select" in item.properties.Ingridients) ||
        !("hidden" in item.properties) || 
        !("checkbox" in item.properties.hidden) ||
        item.properties.hidden.checkbox)
      {
      return []
    }

    var imageURL: string | undefined
    if (item.properties.ImageURL.url === null) {
      imageURL = undefined
    } else {
      imageURL = item.properties.ImageURL.url
    }

    const dish: Dish = {
      name: item.properties.Name.title[0].text.content,
      ingridients: item.properties.Ingridients.multi_select.map(item =>
        item.name
      ),
      description: item.properties.Description.rich_text[0].plain_text,
      imageURL: imageURL,
    }

    return [dish]
  })
}
